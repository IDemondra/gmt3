import { EvenementService } from '../services/EvenementService.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Evenement } from '../types/index.js';

const evenementService = new EvenementService(new EvenementRepository());

export const EvenementController = {
	async getAll(req: BunRequest): Promise<Response> {
		const items = await evenementService.getAll();
		return Response.json(items);
	},

	async getById(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		const item = await evenementService.getById(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		return Response.json(item);
	},

	async create(req: BunRequest): Promise<Response> {
		const body = await req.json() as {
			titre: string;
			description?: string;
			dateEvenement: string;
			lieu?: string;
			imagePrincipale?: string;
			estPublie?: boolean;
		};
		if (!body.titre || !body.dateEvenement) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
		}
		const item = await evenementService.create({
			titre: body.titre,
			description: body.description ?? null,
			dateEvenement: body.dateEvenement,
			lieu: body.lieu ?? null,
			imagePrincipale: body.imagePrincipale ?? null,
			estPublie: body.estPublie ?? true,
		});
		return Response.json(item, { status: 201 });
	},

	async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		const body = await req.json() as Partial<Evenement>;
		const item = await evenementService.update(id, body);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		return Response.json(item);
	},

	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		const ok = await evenementService.delete(id);
		if (!ok) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		return Response.json({ success: true });
	},
};
