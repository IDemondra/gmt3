import { EvenementService } from '../services/EvenementService.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import { PhotoEvenementRepository } from '../repositories/PhotoEvenementRepository.js';
import { AvisRepository } from '../repositories/AvisRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Evenement } from '../types/index.js';
import { buildGalleryUploadPlan } from '../utils/photoGallery.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileTypeFromBuffer } from 'file-type';
import heicConvert from 'heic-convert';

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const HEIC_MIMES = new Set(['image/heic', 'image/heif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_GALLERY_PHOTOS = 10;

async function validateImageBuffer(file: File): Promise<{ buf: Buffer; ext: string } | null> {
	if (file.size > MAX_FILE_SIZE) return null;
	const rawBuf = Buffer.from(await file.arrayBuffer());
	const type = await fileTypeFromBuffer(rawBuf);
	if (!type) return null;

	if (HEIC_MIMES.has(type.mime)) {
		// Photos iPhone (réglage "Format élevé") sont exportées en HEIC/HEIF.
		// Aucun navigateur autre que Safari ne sait les afficher : on convertit en JPEG côté serveur.
		try {
			const jpegArrayBuffer = await heicConvert({ buffer: rawBuf, format: 'JPEG', quality: 0.9 });
			const jpegBuf = Buffer.from(jpegArrayBuffer);
			if (jpegBuf.length > MAX_FILE_SIZE) return null;
			return { buf: jpegBuf, ext: 'jpg' };
		} catch {
			return null;
		}
	}

	if (!ALLOWED_IMAGE_MIMES.has(type.mime)) return null;
	return { buf: rawBuf, ext: type.ext };
}

function formatEvenementDates<T extends { dateEvenement?: string | null; dateDepart?: string | null; dateRetour?: string | null; dateCreation?: string | null }>(e: T): T {
	return {
		...e,
		dateEvenement: formatDateToDDMMYYYY(e.dateEvenement),
		dateDepart: formatDateToDDMMYYYY(e.dateDepart),
		dateRetour: formatDateToDDMMYYYY(e.dateRetour),
		dateCreation: formatDateToDDMMYYYY(e.dateCreation),
	};
}

function calculateDuration(e: { dateDepart?: string | null; heureDepart?: string | null; dateRetour?: string | null; heureRetour?: string | null }): string | null {
	if (!e.dateDepart || !e.dateRetour) return null;
	try {
		const start = new Date(`${e.dateDepart}${e.heureDepart ? `T${e.heureDepart}:00` : 'T00:00:00'}`);
		const end = new Date(`${e.dateRetour}${e.heureRetour ? `T${e.heureRetour}:00` : 'T00:00:00'}`);
		const hours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
		const days = Math.floor(hours / 24);
		const remainingHours = hours % 24;
		if (days > 0 && remainingHours > 0) return `${days}j ${remainingHours}h`;
		if (days > 0) return `${days}j`;
		if (remainingHours > 0) return `${remainingHours}h`;
		return null;
	} catch {
		return null;
	}
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
	return fd.getAll('photosEvenement')
		.filter((value): value is File => value instanceof File && value.size > 0)
		.slice(0, MAX_GALLERY_PHOTOS);
}

const evenementService = new EvenementService(new EvenementRepository());
const photoRepository = new PhotoEvenementRepository();
const avisRepository = new AvisRepository();

function avgNote(items: { note: number }[]): number {
	if (items.length === 0) return 0;
	return Math.round((items.reduce((s, a) => s + a.note, 0) / items.length) * 10) / 10;
}

async function serializeEvenement(id: number) {
	const item = await evenementService.getById(id);
	if (!item) return null;
	const photosEvenement = await photoRepository.findByEvenementIdOrdered(id);
	const avis = await avisRepository.findApprovedByEvenementId(id);
	const formatted = formatEvenementDates(item);
	return { ...formatted, photosEvenement, avis, noteMoyenne: avgNote(avis), nombreAvis: avis.length, duration: calculateDuration(item) };
}

async function storeGalleryPhotos(evenementId: number, fd: GalleryFormData) {
	const files = getGalleryFiles(fd);
	if (files.length === 0) return [];

	const validatedFiles: Array<{ file: File; buf: Buffer; ext: string }> = [];
	for (const file of files) {
		const validated = await validateImageBuffer(file);
		if (validated) validatedFiles.push({ file, buf: validated.buf, ext: validated.ext });
	}
	if (validatedFiles.length === 0) return [];

	const plan = buildGalleryUploadPlan(evenementId, validatedFiles.map((v) => v.file));
	const galleryDir = ensureGalleryDir(evenementId);

	for (let i = 0; i < plan.length; i++) {
		const item = plan[i]!;
		const validated = validatedFiles[i]!;
		const correctedFilename = item.filename.replace(/\.[^.]+$/, `.${validated.ext}`);
		const filePath = resolve(galleryDir, correctedFilename);
		writeFileSync(filePath, validated.buf);
		item.filename = correctedFilename;
		item.url = `/uploads/evenements/${evenementId}/gallery/${correctedFilename}`;
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
		const allPhotos = await photoRepository.findAll();
		const photosByEvent = new Map<number, typeof allPhotos>();
		for (const photo of allPhotos) {
			const list = photosByEvent.get(photo.evenementId) ?? [];
			list.push(photo);
			photosByEvent.set(photo.evenementId, list);
		}
		for (const list of photosByEvent.values()) {
			list.sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0));
		}
		const approvedAvis = await avisRepository.findAllApproved();
		const avisByEvent = new Map<number, typeof approvedAvis>();
		for (const a of approvedAvis) {
			const list = avisByEvent.get(a.evenementId) ?? [];
			list.push(a);
			avisByEvent.set(a.evenementId, list);
		}
		return Response.json({
			data: items.map((item) => {
				const avis = avisByEvent.get(item.id) ?? [];
				return {
					...formatEvenementDates(item),
					id: item.id,
					duration: calculateDuration(item),
					photosEvenement: photosByEvent.get(item.id) ?? [],
					avis,
					noteMoyenne: avgNote(avis),
					nombreAvis: avis.length,
				};
			}),
			message: `${items.length} événement(s) trouvé(s)`
		});
	},

	async getById(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });

		const item = await serializeEvenement(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });

		return Response.json({ ...item, id, message: 'Événement chargé avec succès' });
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
			const validated = await validateImageBuffer(imageFile);
			if (!validated) {
				await evenementService.delete(item.id);
				return Response.json({ error: 'FICHIER_INVALIDE', message: 'Image invalide ou trop grande (max 5 Mo, formats: JPEG/PNG/WEBP/GIF/HEIC)' }, { status: 400 });
			}
			const dir = ensureDir(item.id);
			const filename = `main.${validated.ext}`;
			writeFileSync(resolve(dir, filename), validated.buf);
			await evenementService.update(item.id, { imagePrincipale: `/uploads/evenements/${item.id}/${filename}` });
		}

		await storeGalleryPhotos(item.id, fd);
		const created = await serializeEvenement(item.id);
		if (!created) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		return Response.json({ ...created, id: item.id, message: 'Événement créé avec succès' }, { status: 201 });
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
			const validated = await validateImageBuffer(imageFile);
			if (!validated) {
				return Response.json({ error: 'FICHIER_INVALIDE', message: 'Image invalide ou trop grande (max 5 Mo, formats: JPEG/PNG/WEBP/GIF/HEIC)' }, { status: 400 });
			}
			const dir = ensureDir(id);
			const filename = `main.${validated.ext}`;
			writeFileSync(resolve(dir, filename), validated.buf);
			data.imagePrincipale = `/uploads/evenements/${id}/${filename}`;
		}

		const item = await evenementService.update(id, data);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		await storeGalleryPhotos(id, fd);
		const updated = await serializeEvenement(id);
		if (!updated) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		return Response.json({ ...updated, id, message: 'Événement modifié avec succès' });
	},

	async delete(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
		const ok = await evenementService.delete(id);
		if (!ok) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		return Response.json({ success: true, message: 'Événement supprimé avec succès' });
	},
};
