import { userRoutes } from './routes/userRoutes.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { evenementRoutes } from './routes/evenementRoutes.js';
import { reservationRoutes } from './routes/reservationRoutes.js';
import { kpiRoutes } from './routes/kpiRoutes.js';
import { avisRoutes } from './routes/avisRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import { db } from './config/database.js';
import { journalAudit } from './models/schema.js';
import type { BunRequest, RouteHandler } from './types/http.js';
import { existsSync } from 'fs';
import { resolve } from 'path';

const STATIC_UPLOADS_ROOT = resolve(import.meta.dir, '..', 'uploads');

// In-memory rate limiter: max 10 login attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const publicAttempts = new Map<string, { count: number; resetAt: number }>();
const PUBLIC_RATE_LIMIT_MAX = 20;

function checkLoginRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = loginAttempts.get(ip);
	if (!entry || now > entry.resetAt) {
		loginAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}
	if (entry.count >= RATE_LIMIT_MAX) return false;
	entry.count++;
	return true;
}

function checkPublicRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = publicAttempts.get(ip);
	if (!entry || now > entry.resetAt) {
		publicAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return true;
	}
	if (entry.count >= PUBLIC_RATE_LIMIT_MAX) return false;
	entry.count++;
	return true;
}

const allRoutes: Record<string, Record<string, RouteHandler>> = {
	...userRoutes,
	...clientRoutes,
	...evenementRoutes,
	...reservationRoutes,
	...kpiRoutes,
	...avisRoutes,
};

// Routes nécessitant le rôle "admin" (gestion des comptes).
const ADMIN_ONLY_ROUTES = new Set([
	'GET /api/utilisateurs',
	'GET /api/utilisateurs/:id',
	'POST /api/utilisateurs',
	'PUT /api/utilisateurs/:id',
	'DELETE /api/utilisateurs/:id',
	'DELETE /api/clients/:id',
	'DELETE /api/evenements/:id',
	'DELETE /api/reservations/:id',
	'DELETE /api/avis/:id',
	'PUT /api/avis/:id/approuver',
]);

const PROTECTED_ROUTES = new Set([
	// utilisateurs
	'GET /api/utilisateurs',
	'GET /api/utilisateurs/:id',
	'PUT /api/utilisateurs/:id',
	'DELETE /api/utilisateurs/:id',
	// clients
	'GET /api/clients',
	'GET /api/clients/:id',
	'POST /api/clients',
	'PUT /api/clients/:id',
	'DELETE /api/clients/:id',
	// evenements (mutations only)
	'POST /api/evenements',
	'PUT /api/evenements/:id',
	'DELETE /api/evenements/:id',
	'POST /api/evenements/:id/photos',
	// reservations (read + mutations, PII)
	'GET /api/reservations',
	'GET /api/reservations/:id',
	'PUT /api/reservations/:id',
	'DELETE /api/reservations/:id',
	// kpis
	'GET /api/kpis',
	// avis (modération — POST public reste non protégé)
	'GET /api/avis',
	'DELETE /api/avis/:id',
	'PUT /api/avis/:id/approuver',
]);

function matchRoute(
	method: string,
	pathname: string,
	routes: Record<string, Record<string, RouteHandler>>,
): { handler: RouteHandler; params: Record<string, string>; isProtected: boolean; isAdminOnly: boolean } | null {
	for (const [pattern, methods] of Object.entries(routes)) {
		const patternParts = pattern.split('/');
		const pathParts = pathname.split('/');

		if (patternParts.length !== pathParts.length) continue;

		const params: Record<string, string> = {};
		let match = true;

		for (let i = 0; i < patternParts.length; i++) {
			const pp = patternParts[i]!;
			const pv = pathParts[i]!;

			if (pp.startsWith(':')) {
				params[pp.slice(1)] = pv;
			} else if (pp !== pv) {
				match = false;
				break;
			}
		}

		if (match) {
			const handler = methods[method];
			if (handler) {
				// Check if this route+method is protected
				const routeKey = `${method} ${pattern}`;
				return { handler, params, isProtected: PROTECTED_ROUTES.has(routeKey), isAdminOnly: ADMIN_ONLY_ROUTES.has(routeKey) };
			}
		}
	}
	return null;
}

export async function handleRequest(req: BunRequest): Promise<Response> {
	const url = new URL(req.url);
	const pathname = url.pathname;
	const ALLOWED_ORIGINS = new Set(
		(Bun.env.CORS_ORIGINS || 'https://gmt3-fianarantsoa.mg,http://localhost:4321,http://localhost:5173').split(','),
	);
	const requestOrigin = req.headers.get('Origin') || '';
	const allowedOrigin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : '';

	const corsHeaders = {
		'Access-Control-Allow-Origin': allowedOrigin || 'null',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Vary': 'Origin',
	};

	if (pathname.startsWith('/uploads/')) {
		const relativePath = pathname.slice('/uploads/'.length);
		const filePath = resolve(STATIC_UPLOADS_ROOT, relativePath);
		if (!filePath.startsWith(STATIC_UPLOADS_ROOT) || !existsSync(filePath)) {
			return Response.json({ error: 'NOT_FOUND' }, { status: 404, headers: corsHeaders });
		}

		return new Response(Bun.file(filePath), {
			headers: corsHeaders,
		});
	}

	// ── CORS preflight ──
	if (req.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	}

	// ── Route matching ──
	const matched = matchRoute(req.method, pathname, allRoutes);

	if (!matched) {
		return Response.json({ error: 'NOT_FOUND' }, { status: 404, headers: corsHeaders });
	}

	// ── Login rate limiting ──
	if (req.method === 'POST' && pathname === '/api/utilisateurs/login') {
		const ip = req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ?? req.headers.get('X-Real-IP') ?? 'unknown';
		if (!checkLoginRateLimit(ip)) {
			return Response.json({ error: 'TROP_DE_TENTATIVES', message: 'Trop de tentatives. Réessayez dans 15 minutes.' }, { status: 429, headers: corsHeaders });
		}
	}
	if (req.method === 'POST' && (pathname === '/api/reservations' || pathname === '/api/avis')) {
		const ip = req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ?? req.headers.get('X-Real-IP') ?? 'unknown';
		if (!checkPublicRateLimit(ip)) return Response.json({ error: 'TROP_DE_TENTATIVES' }, { status: 429, headers: corsHeaders });
	}

	// ── Auth guard ──
	if (matched.isProtected || matched.isAdminOnly) {
		const authResult = await authMiddleware(req);
		if (authResult) {
			for (const [key, value] of Object.entries(corsHeaders)) authResult.headers.set(key, value);
			return authResult;
		}
	}

	// ── Role guard (admin) ──
	if (matched.isAdminOnly) {
		const role = (req as any).user?.role;
		if (role !== 'admin') {
			return Response.json({ error: 'ACCES_REFUSE', message: 'Réservé aux administrateurs' }, { status: 403, headers: corsHeaders });
		}
	}

	try {
		const result = await matched.handler(req, matched.params);
		const response = result instanceof Response ? result : Response.json(result);
		if (matched.isProtected && ['POST', 'PUT', 'DELETE'].includes(req.method) && response.ok && req.user) {
			const ip = req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ?? req.headers.get('X-Real-IP');
			await db.insert(journalAudit).values({ utilisateurId: req.user.id, action: req.method, ressource: pathname, adresseIp: ip ?? null, dateCreation: new Date().toISOString() });
		}
		for (const [key, value] of Object.entries(corsHeaders)) {
			response.headers.set(key, value);
		}
		return response;
	} catch (err) {
		console.error('[ERREUR]', err);
		return Response.json({ error: 'ERREUR_INTERNE' }, { status: 500, headers: corsHeaders });
	}
}
