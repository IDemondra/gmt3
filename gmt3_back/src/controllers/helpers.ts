import { parseId, readJsonObject } from '../utils/validation.js';

export function errorResponse(error: string, message?: string, status = 400): Response {
	return Response.json(message ? { error, message } : { error }, { status });
}

export function idOrError(params: { id?: string }): number | Response {
	const id = parseId(params.id);
	return id ?? errorResponse('ID_INVALIDE', 'ID invalide');
}

export function notFound(error: string, message: string): Response {
	return errorResponse(error, message, 404);
}

export async function jsonOrError(req: Request): Promise<Record<string, unknown> | Response> {
	const body = await readJsonObject(req);
	return body ?? errorResponse('JSON_INVALIDE', 'JSON invalide');
}
