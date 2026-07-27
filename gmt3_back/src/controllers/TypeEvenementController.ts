import type { BunRequest } from '../types/http.js';
import { TypeEvenementService } from '../services/TypeEvenementService.js';

const typeEvenementService = new TypeEvenementService();

export const TypeEvenementController = {
	async getAll(_req: BunRequest): Promise<Response> {
		const data = await typeEvenementService.getActive();
		return Response.json({ data, message: `${data.length} type(s) d'événement trouvé(s)` });
	},
};
