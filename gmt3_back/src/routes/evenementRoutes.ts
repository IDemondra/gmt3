import { EvenementController } from '../controllers/EvenementController.js';
import type { RouteMap, RouteHandler } from '../types/http.js';

const withId = (fn: (req: import('../types/http.js').BunRequest, params: { id: string }) => Promise<Response>): RouteHandler =>
	(req, params) => fn(req, params as { id: string });

export const evenementRoutes: RouteMap = {
	'/api/evenements': {
		GET: EvenementController.getAll,
		POST: EvenementController.create,
	},
	'/api/evenements/:id': {
		GET: withId(EvenementController.getById),
		PUT: withId(EvenementController.update),
		DELETE: withId(EvenementController.delete),
	},
};
