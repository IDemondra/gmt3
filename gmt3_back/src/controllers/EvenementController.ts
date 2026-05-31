import { EvenementService } from '../services/EvenementService.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Evenement } from '../types/index.js';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const UPLOADS_ROOT = resolve(import.meta.dir, '..', '..', 'uploads', 'evenements');

function ensureDir(id: number) {
	const dir = resolve(UPLOADS_ROOT, String(id));
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

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
		const fd = await req.formData();
		const titre = fd.get('titre') as string;
		const dateEvenement = fd.get('dateEvenement') as string;
		const description = fd.get('description') as string || undefined;
		const lieu = fd.get('lieu') as string || undefined;
		const estPublie = fd.get('estPublie') === 'on';

		if (!titre || !dateEvenement) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
		}

		// 1. Créer l'événement sans image
		const item = await evenementService.create({
			titre,
			description: description ?? null,
			dateEvenement,
			lieu: lieu ?? null,
			imagePrincipale: null,
			estPublie,
		});

		// 2. Sauver l'image dans le dossier uploads/evenements/{id}/
		const imageFile = fd.get('imagePrincipale') as File | null;
		if (imageFile && imageFile.size > 0) {
			const dir = ensureDir(item.id);
			const ext = imageFile.name.split('.').pop() || 'jpg';
			const filename = `main.${ext}`;
			const filePath = resolve(dir, filename);
			writeFileSync(filePath, Buffer.from(await imageFile.arrayBuffer()));
			await evenementService.update(item.id, { imagePrincipale: `/uploads/evenements/${item.id}/${filename}` });
		}

		return Response.json(item, { status: 201 });
	},

	async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const fd = await req.formData();
		const data: Partial<Evenement> = {};

		const titre = fd.get('titre') as string;
		const dateEvenement = fd.get('dateEvenement') as string;
		if (titre) data.titre = titre;
		if (dateEvenement) data.dateEvenement = dateEvenement;
		if (fd.get('description')) data.description = fd.get('description') as string;
		if (fd.get('lieu')) data.lieu = fd.get('lieu') as string;
		data.estPublie = fd.get('estPublie') === 'on';

		const imageFile = fd.get('imagePrincipale') as File | null;
		if (imageFile && imageFile.size > 0) {
			const dir = ensureDir(id);
			const ext = imageFile.name.split('.').pop() || 'jpg';
			const filename = `main.${ext}`;
			const filePath = resolve(dir, filename);
			writeFileSync(filePath, Buffer.from(await imageFile.arrayBuffer()));
			data.imagePrincipale = `/uploads/evenements/${id}/${filename}`;
		}

		const item = await evenementService.update(id, data);
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
