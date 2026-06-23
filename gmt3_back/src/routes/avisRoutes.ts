import { AvisController } from '../controllers/AvisController.js';
import type { RouteMap, RouteHandler } from '../types/http.js';

export const avisRoutes: RouteMap = {
	'/api/avis': {
		GET: AvisController.getAll,
		POST: AvisController.create,
	},
	'/api/avis/:id': {
		DELETE: AvisController.delete as RouteHandler,
	},
	'/api/avis/:id/approuver': {
		PUT: AvisController.approve as RouteHandler,
	},
};
