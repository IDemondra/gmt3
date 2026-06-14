import { ReservationController } from '../controllers/ReservationController.js';
import type { RouteMap } from '../types/http.js';

export const reservationRoutes: RouteMap = {
	'/api/reservations': {
		GET: ReservationController.getAll,
		POST: ReservationController.create,
	},
	'/api/reservations/:id': {
		GET: ReservationController.getById as import('../types/http.js').RouteHandler,
		PUT: ReservationController.update as import('../types/http.js').RouteHandler,
		DELETE: ReservationController.delete as import('../types/http.js').RouteHandler,
	},
};
