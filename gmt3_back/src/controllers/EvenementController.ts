import { EvenementService } from '../services/EvenementService.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import { PhotoEvenementRepository } from '../repositories/PhotoEvenementRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Evenement } from '../types/index.js';
import { buildGalleryUploadPlan } from '../utils/photoGallery.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

function formatEvenementDates<T extends { dateEvenement?: string | null; dateDepart?: string | null; dateRetour?: string | null; dateCreation?: string | null }>(e: T): T {
	return {
		...e,
		dateEvenement: formatDateToDDMMYYYY(e.dateEvenement),
		dateDepart: formatDateToDDMMYYYY(e.dateDepart),
		dateRetour: formatDateToDDMMYYYY(e.dateRetour),
		dateCreation: formatDateToDDMMYYYY(e.dateCreation),
	};
}

const UPLOADS_ROOT = resolve(import.meta.dir, '..', '..', 'uploads', 'evenements');

function ensureDir(id: number) {
	const dir = resolve(UPLOADS_ROOT, String(id));
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

function ensureGalleryDir(id: number) {
	const dir = resolve(ensureDir(id), 'gallery');
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

type GalleryFormData = {
	getAll(name: string): unknown[];
};

function getGalleryFiles(fd: GalleryFormData): File[] {
	return fd.getAll('photosEvenement').filter((value): value is File => value instanceof File && value.size > 0);
}

const evenementService = new EvenementService(new EvenementRepository());
const photoRepository = new PhotoEvenementRepository();

async function serializeEvenement(id: number) {
	const item = await evenementService.getById(id);
	if (!item) return null;
	const photosEvenement = await photoRepository.findByEvenementIdOrdered(id);
	return { ...formatEvenementDates(item), photosEvenement };
}

async function storeGalleryPhotos(evenementId: number, fd: GalleryFormData) {
	const files = getGalleryFiles(fd);
	if (files.length === 0) return [];

	const plan = buildGalleryUploadPlan(evenementId, files);
	const galleryDir = ensureGalleryDir(evenementId);

	for (const item of plan) {
		const filePath = resolve(galleryDir, item.filename);
		writeFileSync(filePath, Buffer.from(await item.file.arrayBuffer()));
	}

	await photoRepository.deleteByEvenementId(evenementId);
	return photoRepository.createMany(
		plan.map((item) => ({
			evenementId,
			url: item.url,
			ordre: item.ordre,
			legende: null,
		})),
	);
}

export const EvenementController = {
	async getAll(req: BunRequest): Promise<Response> {
		const items = await evenementService.getAll();
		return Response.json(items.map(formatEvenementDates));
	},

	async getById(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const item = await serializeEvenement(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		return Response.json(item);
	},

	async getPhotos(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const item = await evenementService.getById(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		const photosEvenement = await photoRepository.findByEvenementIdOrdered(id);
		return Response.json({ photosEvenement });
	},

	async replacePhotos(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const item = await evenementService.getById(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		const fd = await req.formData();
		const photos = await storeGalleryPhotos(id, fd);
		return Response.json({ success: true, photosEvenement: photos }, { status: 201 });
	},

	async create(req: BunRequest): Promise<Response> {
		const fd = await req.formData();
		const titre = fd.get('titre') as string;
		const dateEvenement = fd.get('dateEvenement') as string;
		const description = fd.get('description') as string || undefined;
		const lieu = fd.get('lieu') as string || undefined;
		const prixStr = fd.get('prix') as string;
		const prix = prixStr ? parseFloat(prixStr) : null;
		const heureDepart = fd.get('heureDepart') as string || undefined;
		const dateDepart = fd.get('dateDepart') as string || undefined;
		const heureRetour = fd.get('heureRetour') as string || undefined;
		const dateRetour = fd.get('dateRetour') as string || undefined;
		const estPublie = fd.get('estPublie') === 'on';

		if (!titre || !dateEvenement) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
		}

		const item = await evenementService.create({
			titre,
			description: description ?? null,
			dateEvenement,
			heureDepart: heureDepart ?? null,
			dateDepart: dateDepart ?? null,
			heureRetour: heureRetour ?? null,
			dateRetour: dateRetour ?? null,
			lieu: lieu ?? null,
			prix,
			imagePrincipale: null,
			estPublie,
		});

		const imageFile = fd.get('imagePrincipale') as File | null;
		if (imageFile && imageFile.size > 0) {
			const dir = ensureDir(item.id);
			const ext = imageFile.name.split('.').pop() || 'jpg';
			const filename = `main.${ext}`;
			const filePath = resolve(dir, filename);
			writeFileSync(filePath, Buffer.from(await imageFile.arrayBuffer()));
			await evenementService.update(item.id, { imagePrincipale: `/uploads/evenements/${item.id}/${filename}` });
		}

		await storeGalleryPhotos(item.id, fd);
		const created = await serializeEvenement(item.id);
		if (!created) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		return Response.json(created, { status: 201 });
	},

	async update(req: BunRequest, params: Record<string, string>): Promise<Response> {
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
		if (fd.get('heureDepart')) data.heureDepart = fd.get('heureDepart') as string;
		if (fd.get('dateDepart')) data.dateDepart = fd.get('dateDepart') as string;
		if (fd.get('heureRetour')) data.heureRetour = fd.get('heureRetour') as string;
		if (fd.get('dateRetour')) data.dateRetour = fd.get('dateRetour') as string;
		const prixStr = fd.get('prix') as string;
		if (prixStr) data.prix = parseFloat(prixStr);
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

		await storeGalleryPhotos(id, fd);
		const updated = await serializeEvenement(id);
		if (!updated) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		return Response.json(updated);
	},

	async delete(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		const ok = await evenementService.delete(id);
		if (!ok) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		return Response.json({ success: true });
	},
};
