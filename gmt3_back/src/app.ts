import { userRoutes } from './routes/userRoutes.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { evenementRoutes } from './routes/evenementRoutes.js';
import { reservationRoutes } from './routes/reservationRoutes.js';
import { kpiRoutes } from './routes/kpiRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import type { BunRequest, RouteHandler } from './types/http.js';

const allRoutes: Record<string, Record<string, RouteHandler>> = {
	...userRoutes,
	...clientRoutes,
	...evenementRoutes,
	...reservationRoutes,
	...kpiRoutes,
};

const PROTECTED_ROUTES = new Set([
	'PUT /api/utilisateurs/:id',
	'DELETE /api/utilisateurs/:id',
	'PUT /api/clients/:id',
	'DELETE /api/clients/:id',
	'POST /api/evenements',
	'PUT /api/evenements/:id',
	'DELETE /api/evenements/:id',
	'PUT /api/reservations/:id',
	'DELETE /api/reservations/:id',
	'GET /api/kpis',
]);

function matchRoute(
	method: string,
	pathname: string,
	routes: Record<string, Record<string, RouteHandler>>,
): { handler: RouteHandler; params: Record<string, string>; isProtected: boolean } | null {
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
				return { handler, params, isProtected: PROTECTED_ROUTES.has(routeKey) };
			}
		}
	}
	return null;
}

export async function handleRequest(req: BunRequest): Promise<Response> {
	const url = new URL(req.url);
	const pathname = url.pathname;
	const origin = req.headers.get('Origin') || '*';

	const corsHeaders = {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Vary': 'Origin',
	};

	// ── CORS preflight ──
	if (req.method === 'OPTIONS') {
		return new Response(null, { headers: corsHeaders });
	}

	// ── Route matching ──
	const matched = matchRoute(req.method, pathname, allRoutes);

	if (!matched) {
		return Response.json({ error: 'NOT_FOUND' }, { status: 404, headers: corsHeaders });
	}

	// ── Auth guard ──
	if (matched.isProtected) {
		const authResult = await authMiddleware(req);
		if (authResult) return authResult;
	}

	try {
		const result = await matched.handler(req, matched.params);
		const response = result instanceof Response ? result : Response.json(result);
		for (const [key, value] of Object.entries(corsHeaders)) {
			response.headers.set(key, value);
		}
		return response;
	} catch (err) {
		console.error('[ERREUR]', err);
		return Response.json({ error: 'ERREUR_INTERNE' }, { status: 500, headers: corsHeaders });
	}
}
