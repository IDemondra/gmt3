import { TypeEvenementController } from '../controllers/TypeEvenementController.js';
import type { RouteMap } from '../types/http.js';

export const typeEvenementRoutes: RouteMap = {
	'/api/types-evenements': {
		GET: TypeEvenementController.getAll,
	},
};
