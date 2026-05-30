import { UserController } from '../controllers/UserController.js';
import type { RouteMap, RouteHandler } from '../types/http.js';

const withId = (fn: (req: import('../types/http.js').BunRequest, params: { id: string }) => Promise<Response>): RouteHandler =>
	(req, params) => fn(req, params as { id: string });

export const userRoutes: RouteMap = {
	'/api/utilisateurs': {
		GET: UserController.getAll,
		POST: UserController.create,
	},
	'/api/utilisateurs/login': {
		POST: UserController.login,
	},
	'/api/utilisateurs/:id': {
		GET: withId(UserController.getById),
		PUT: withId(UserController.update),
		DELETE: withId(UserController.delete),
	},
};
