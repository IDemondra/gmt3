import { EvenementController } from '../controllers/EvenementController.js';
import type { RouteMap } from '../types/http.js';

export const evenementRoutes: RouteMap = {
	'/api/evenements': {
		GET: EvenementController.getAll,
		POST: EvenementController.create,
	},
	'/api/evenements/:id': {
		GET: EvenementController.getById as import('../types/http.js').RouteHandler,
		PUT: EvenementController.update as import('../types/http.js').RouteHandler,
		DELETE: EvenementController.delete as import('../types/http.js').RouteHandler,
	},
};
