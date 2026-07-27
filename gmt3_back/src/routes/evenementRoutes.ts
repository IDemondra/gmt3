import { EvenementController } from '../controllers/EvenementController.js';
import type { RouteMap } from '../types/http.js';

export const evenementRoutes: RouteMap = {
	'/api/evenements': {
		GET: EvenementController.getAll,
		POST: EvenementController.create,
	},
	'/api/evenements/code/:code': {
		GET: EvenementController.getByPublicCode as import('../types/http.js').RouteHandler,
	},
	'/api/evenements/:id': {
		GET: EvenementController.getById as import('../types/http.js').RouteHandler,
		PUT: EvenementController.update as import('../types/http.js').RouteHandler,
		DELETE: EvenementController.delete as import('../types/http.js').RouteHandler,
	},
	'/api/evenements/:id/photos': {
		GET: EvenementController.getPhotos as import('../types/http.js').RouteHandler,
		POST: EvenementController.replacePhotos as import('../types/http.js').RouteHandler,
	},
};
