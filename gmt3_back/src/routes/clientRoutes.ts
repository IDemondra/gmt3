import { ClientController } from '../controllers/ClientController.js';
import type { RouteMap, RouteHandler } from '../types/http.js';

const withId = (fn: (req: import('../types/http.js').BunRequest, params: Record<string, string>) => Promise<Response>): RouteHandler =>
	(req, params) => fn(req, params);

export const clientRoutes: RouteMap = {
    '/api/clients': {
        GET: ClientController.getAll,
        POST: ClientController.create,
    },
    '/api/clients/:id': {
        GET: withId(ClientController.getById),
        PUT: withId(ClientController.update),
        DELETE: withId(ClientController.delete),
    },
};
