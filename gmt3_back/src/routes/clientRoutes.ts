import { ClientController } from '../controllers/ClientController.js';
import type { RouteMap, RouteHandler } from '../types/http.js';

const withId = (fn: (req: import('../types/http.js').BunRequest, params: { id: string }) => Promise<Response>): RouteHandler =>
    (req, params) => fn(req, params as { id: string });

export const clientRoutes: RouteMap = {
    '/api/clients': {
        GET: ClientController.getAll,
        POST: ClientController.create,
    },
    '/api/clients/:id': {
        GET: ClientController.getById,
        PUT: ClientController.update,
        DELETE: ClientController.delete,
    },
};
