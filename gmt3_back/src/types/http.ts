import type { Server } from 'bun';

export interface BunRequest extends Request {
	params?: Record<string, string>;
	user?: { id: number; nomUtilisateur: string; role: string };
}

export type RouteHandler<T extends Record<string, string> = Record<string, string>> = (req: BunRequest, params: T) => Response | Promise<Response>;
export type RouteMap = Record<string, Record<string, RouteHandler<any>>>;
