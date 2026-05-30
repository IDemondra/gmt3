import { userRoutes } from './routes/userRoutes.js';
import { clientRoutes } from './routes/clientRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';
import type { BunRequest, RouteHandler } from './types/http.js';

const allRoutes: Record<string, Record<string, RouteHandler>> = {
	...userRoutes,
	...clientRoutes,
};

const PROTECTED_ROUTES = new Set([
	'PUT /api/utilisateurs/:id',
	'DELETE /api/utilisateurs/:id',
	'PUT /api/clients/:id',
	'DELETE /api/clients/:id',
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

	// ── CORS ──
	if (req.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		});
	}

	// ── Route matching ──
	const matched = matchRoute(req.method, pathname, allRoutes);

	if (!matched) {
		return Response.json({ error: 'NOT_FOUND' }, { status: 404 });
	}

	// ── Auth guard ──
	if (matched.isProtected) {
		const authResult = await authMiddleware(req);
		if (authResult) return authResult;
	}

	try {
		const result = await matched.handler(req, matched.params);
		const response = result instanceof Response ? result : Response.json(result);
		response.headers.set('Access-Control-Allow-Origin', '*');
		return response;
	} catch (err) {
		console.error('[ERREUR]', err);
		return Response.json({ error: 'ERREUR_INTERNE' }, { status: 500 });
	}
}
