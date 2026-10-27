import { EvenementService } from '../services/EvenementService.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import { PhotoEvenementRepository } from '../repositories/PhotoEvenementRepository.js';
import { AvisRepository } from '../repositories/AvisRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Evenement, PhotoEvenement } from '../types/index.js';
import { buildGalleryUploadPlan } from '../utils/photoGallery.js';
import { formatDateFields } from '../utils/date.js';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileTypeFromBuffer } from 'file-type';
import heicConvert from 'heic-convert';
import { optimizeImage } from '../utils/imageOptimize.js';
import { readFormString } from '../utils/validation.js';
import { idOrError } from './helpers.js';
import { db } from '../config/database.js';
import { reservations } from '../models/schema.js';
import { TypeEvenementService } from '../services/TypeEvenementService.js';
import { and, eq, ne, sql } from 'drizzle-orm';
import sharp from 'sharp';
import { eventUploadDir, galleryUploadDir, listGalleryFilePaths, removeEventUploadDir, removeFiles, removeUploadFile } from '../utils/uploadCleanup.js';

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const HEIC_MIMES = new Set(['image/heic', 'image/heif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_GALLERY_PHOTOS = 10;
const MAX_GALLERY_TOTAL_SIZE = 40 * 1024 * 1024; // 40 MB — garde-fou avant tout traitement (compression HEIC/sharp coûteuse)

type ImageValidationResult =
	| { ok: true; buf: Buffer; ext: string }
	| { ok: false; reason: 'TROP_LOURDE' | 'INVALIDE' };

async function validateImageBuffer(file: File): Promise<ImageValidationResult> {
	if (file.size > MAX_FILE_SIZE) return { ok: false, reason: 'TROP_LOURDE' };
	const rawBuf = Buffer.from(await file.arrayBuffer());
	const type = await fileTypeFromBuffer(rawBuf);
	if (!type) return { ok: false, reason: 'INVALIDE' };

	if (HEIC_MIMES.has(type.mime)) {
		// Photos iPhone (réglage "Format élevé") sont exportées en HEIC/HEIF.
		// Aucun navigateur autre que Safari ne sait les afficher : on convertit en JPEG côté serveur.
		try {
			const jpegArrayBuffer = await heicConvert({ buffer: rawBuf, format: 'JPEG', quality: 0.9 });
			const jpegBuf = Buffer.from(jpegArrayBuffer);
			if (jpegBuf.length > MAX_FILE_SIZE) return { ok: false, reason: 'TROP_LOURDE' };
			const optimized = await optimizeImage(jpegBuf, 'jpg');
			return { ok: true, ...optimized };
		} catch {
			return { ok: false, reason: 'INVALIDE' };
		}
	}

	if (!ALLOWED_IMAGE_MIMES.has(type.mime)) return { ok: false, reason: 'INVALIDE' };
	const metadata = await sharp(rawBuf, { limitInputPixels: 40_000_000 }).metadata();
	if (!metadata.width || !metadata.height || metadata.width * metadata.height > 40_000_000) return { ok: false, reason: 'INVALIDE' };
	const optimized = await optimizeImage(rawBuf, type.ext);
	return { ok: true, ...optimized };
}

function formatEvenementDates<T extends { dateEvenement?: string | null; dateDepart?: string | null; dateRetour?: string | null; dateCreation?: string | null }>(e: T): T {
	return formatDateFields(e, ['dateEvenement', 'dateDepart', 'dateRetour', 'dateCreation']);
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

function validEventData(input: { titre?: string | null; description?: string | null; dateEvenement?: string | null; dateDepart?: string | null; dateRetour?: string | null; prix?: number | null; capaciteMax?: number | null }): boolean {
	if (input.titre !== undefined && (input.titre === null || input.titre.trim().length < 3 || input.titre.length > 150)) return false;
	if (input.description !== undefined && input.description !== null && input.description.length > MAX_DESCRIPTION_LENGTH) return false;
	if (input.dateEvenement !== undefined && (input.dateEvenement === null || Number.isNaN(new Date(input.dateEvenement).getTime()))) return false;
	if (input.dateDepart && input.dateRetour && new Date(input.dateRetour) < new Date(input.dateDepart)) return false;
	if (input.prix !== undefined && input.prix !== null && (!Number.isFinite(input.prix) || input.prix < 0)) return false;
	return input.capaciteMax === undefined || input.capaciteMax === null || (Number.isInteger(input.capaciteMax) && input.capaciteMax > 0);
}

function ensureDir(id: number) {
	const dir = eventUploadDir(id);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	return dir;
}

function ensureGalleryDir(id: number) {
	const dir = galleryUploadDir(id);
	ensureDir(id);
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

/**
 * Rejette tôt si la somme des fichiers dépasse la limite globale, avant toute
 * conversion HEIC/sharp coûteuse (évite de faire tourner le serveur pour rien
 * sur un payload voué au rejet).
 */
function galleryTotalSizeError(fd: GalleryFormData): Response | null {
	const totalSize = getGalleryFiles(fd).reduce((sum, file) => sum + file.size, 0);
	if (totalSize > MAX_GALLERY_TOTAL_SIZE) {
		return Response.json(
			{ error: 'GALERIE_TROP_LOURDE', message: `Taille totale des photos trop importante (max ${MAX_GALLERY_TOTAL_SIZE / 1024 / 1024} Mo au total)` },
			{ status: 413 },
		);
	}
	return null;
}

const evenementService = new EvenementService(new EvenementRepository());
const photoRepository = new PhotoEvenementRepository();
const avisRepository = new AvisRepository();
const typeEvenementService = new TypeEvenementService();
const PUBLIC_CODE_ALPHABET = '23456789abcdefghijkmnopqrstuvwxyz';

function generatePublicCode(length = 10): string {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (byte) => PUBLIC_CODE_ALPHABET[byte % PUBLIC_CODE_ALPHABET.length]).join('');
}

async function createUniquePublicCode(): Promise<string> {
	for (;;) {
		const publicCode = generatePublicCode();
		if (!await evenementService.getByPublicCode(publicCode)) return publicCode;
	}
}

function avgNote(items: { note: number }[]): number {
	if (items.length === 0) return 0;
	return Math.round((items.reduce((s, a) => s + a.note, 0) / items.length) * 10) / 10;
}

function supportsDifficulty(type: { code: string }): boolean {
	return type.code === 'randonnee' || type.code === 'randonnee_touristique';
}

async function serializeEvenement(id: number) {
	const item = await evenementService.getById(id);
	if (!item) return null;
	const photosEvenement = await photoRepository.findByEvenementIdOrdered(id);
	const avis = await avisRepository.findApprovedByEvenementId(id);
	const formatted = formatEvenementDates(item);
	const reservationRows = await db.select({ places: sql<number>`coalesce(sum(${reservations.nombrePlaces}), 0)` }).from(reservations).where(and(ne(reservations.statut, 'annulee'), eq(reservations.evenementId, id)));
	const typeEvenement = await typeEvenementService.getById(item.typeEvenementId);
	return { ...formatted, typeEvenement: typeEvenement ?? null, photosEvenement, avis, noteMoyenne: avgNote(avis), nombreAvis: avis.length, placesReservees: Number(reservationRows[0]?.places ?? 0), duration: calculateDuration(item) };
}

export async function storeGalleryPhotos(evenementId: number, fd: GalleryFormData): Promise<PhotoEvenement[] | Response> {
	const files = getGalleryFiles(fd);
	if (files.length === 0) return [];

	const validatedFiles: Array<{ file: File; buf: Buffer; ext: string }> = [];
	for (const file of files) {
		const validated = await validateImageBuffer(file);
		if (!validated.ok) {
			const tooLarge = validated.reason === 'TROP_LOURDE';
			return Response.json(
				{
					error: tooLarge ? 'FICHIER_TROP_LOURD' : 'FICHIER_INVALIDE',
					message: tooLarge
						? `Photo "${file.name}" trop lourde (max 5 Mo par photo)`
						: `Photo "${file.name}" invalide (JPEG/PNG/WEBP/GIF/HEIC, max 5 Mo)`,
				},
				{ status: 400 },
			);
		}
		validatedFiles.push({ file, buf: validated.buf, ext: validated.ext });
	}
	if (validatedFiles.length === 0) return [];

	const plan = buildGalleryUploadPlan(evenementId, validatedFiles.map((v) => v.file));
	const galleryDir = ensureGalleryDir(evenementId);
	const previousGalleryFiles = listGalleryFilePaths(evenementId);
	const createdGalleryFiles: string[] = [];

	let photos: PhotoEvenement[];
	try {
		for (let i = 0; i < plan.length; i++) {
			const item = plan[i]!;
			const validated = validatedFiles[i]!;
			const correctedFilename = `${String(item.ordre).padStart(2, '0')}-${crypto.randomUUID()}.${validated.ext}`;
			const filePath = resolve(galleryDir, correctedFilename);
			createdGalleryFiles.push(filePath);
			writeFileSync(filePath, validated.buf);
			item.filename = correctedFilename;
			item.url = `/uploads/evenements/${evenementId}/gallery/${correctedFilename}`;
		}

		photos = await photoRepository.replaceByEvenementId(
			evenementId,
			plan.map((item) => ({
				evenementId,
				url: item.url,
				ordre: item.ordre,
				legende: null,
			})),
		);
	} catch (error) {
		try {
			removeFiles(createdGalleryFiles);
		} catch (cleanupError) {
			console.error('[GALERIE] Échec du nettoyage des nouveaux fichiers après rollback', cleanupError);
		}
		throw error;
	}

	try {
		removeFiles(previousGalleryFiles);
	} catch (cleanupError) {
		// La transaction est déjà validée : ne pas transformer un nettoyage
		// d'anciens fichiers en échec de remplacement de la galerie.
		console.error('[GALERIE] Échec du nettoyage des anciens fichiers', cleanupError);
	}
	return photos;
}

export const EvenementController = {
	async getAll(req: BunRequest): Promise<Response> {
		const allItems = await evenementService.getAll();
		const items = req.user ? allItems : allItems.filter((item) => item.estPublie);
		const reservationTotals = await db.select({ evenementId: reservations.evenementId, places: sql<number>`coalesce(sum(${reservations.nombrePlaces}), 0)` }).from(reservations).where(ne(reservations.statut, 'annulee')).groupBy(reservations.evenementId);
		const placesByEvent = new Map(reservationTotals.map((row) => [row.evenementId, Number(row.places)]));
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
		const activeTypes = await typeEvenementService.getActive();
		const typesById = new Map(activeTypes.map((type) => [type.id, type]));
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
					typeEvenement: typesById.get(item.typeEvenementId) ?? null,
					duration: calculateDuration(item),
					photosEvenement: photosByEvent.get(item.id) ?? [],
					avis,
					noteMoyenne: avgNote(avis),
					nombreAvis: avis.length,
					placesReservees: placesByEvent.get(item.id) ?? 0,
				};
			}),
			message: `${items.length} événement(s) trouvé(s)`
		});
	},

	async getById(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const item = await serializeEvenement(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		if (!item.estPublie && !req.user) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });

		return Response.json({ ...item, id, message: 'Événement chargé avec succès' });
	},

	async getByPublicCode(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const publicCode = params.code?.trim().toLowerCase();
		if (!publicCode || !/^[a-z0-9]{10}$/.test(publicCode)) {
			return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		}

		const item = await evenementService.getByPublicCode(publicCode);
		if (!item || (!item.estPublie && !req.user)) {
			return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		}

		const serialized = await serializeEvenement(item.id);
		if (!serialized) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		return Response.json({ ...serialized, id: item.id, message: 'Événement chargé avec succès' });
	},

	async getPhotos(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const item = await evenementService.getById(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		if (!item.estPublie && !req.user) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		const photosEvenement = await photoRepository.findByEvenementIdOrdered(id);
		return Response.json({ photosEvenement });
	},

	async replacePhotos(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const item = await evenementService.getById(id);
		if (!item) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		// Vérification ownership : seul l'admin ou le créateur peut modifier
		if (req.user?.role !== 'admin' && req.user?.id !== item.utilisateurId) {
			return Response.json({ error: 'ACCES_REFUSE', message: 'Vous ne pouvez modifier que vos propres événements' }, { status: 403 });
		}

		const fd = await req.formData();
		const sizeError = galleryTotalSizeError(fd);
		if (sizeError) return sizeError;

		const photos = await storeGalleryPhotos(id, fd);
		if (photos instanceof Response) return photos;
		return Response.json({ success: true, photosEvenement: photos }, { status: 201 });
	},

	async create(req: BunRequest): Promise<Response> {
		const fd = await req.formData();
		const titre = readFormString(fd, 'titre');
		const dateEvenement = readFormString(fd, 'dateEvenement');
		const description = readFormString(fd, 'description');
		const lieu = readFormString(fd, 'lieu');
		const difficulte = readFormString(fd, 'difficulte');
		const prixStr = readFormString(fd, 'prix');
		const prix = prixStr ? parseFloat(prixStr) : null;
		const capaciteMaxStr = readFormString(fd, 'capaciteMax');
		const capaciteMax = capaciteMaxStr ? Number(capaciteMaxStr) : null;
		const heureDepart = readFormString(fd, 'heureDepart');
		const dateDepart = readFormString(fd, 'dateDepart');
		const heureRetour = readFormString(fd, 'heureRetour');
		const dateRetour = readFormString(fd, 'dateRetour');
		const typeEvenementIdStr = readFormString(fd, 'typeEvenementId');
		const typeEvenementNom = readFormString(fd, 'typeEvenementNom');
		const requestedTypeId = typeEvenementIdStr && typeEvenementIdStr !== '__new__' ? Number(typeEvenementIdStr) : null;
		const resolvedType = await typeEvenementService.resolve(requestedTypeId, typeEvenementNom);
		const normalizedDifficulty = resolvedType && supportsDifficulty(resolvedType) ? difficulte : null;
		const estPublie = fd.get('estPublie') === 'on';

		if (!titre || !dateEvenement || !resolvedType || !validEventData({ titre, description, dateEvenement, dateDepart, dateRetour, prix, capaciteMax })) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
		}

		const item = await evenementService.create({
			publicCode: await createUniquePublicCode(),
			typeEvenementId: resolvedType.id,
			utilisateurId: req.user?.id ?? null,
			titre,
			description: description ?? null,
			dateEvenement,
			heureDepart: heureDepart ?? null,
			dateDepart: dateDepart ?? null,
			heureRetour: heureRetour ?? null,
			dateRetour: dateRetour ?? null,
			lieu: lieu ?? null,
			difficulte: normalizedDifficulty ?? null,
			prix,
			capaciteMax,
			imagePrincipale: null,
			estPublie,
		});

		const imageFile = fd.get('imagePrincipale') as File | null;
		if (imageFile && imageFile.size > 0) {
			const validated = await validateImageBuffer(imageFile);
			if (!validated.ok) {
				await evenementService.delete(item.id);
				return Response.json({ error: 'FICHIER_INVALIDE', message: 'Image invalide ou trop grande (max 5 Mo, formats: JPEG/PNG/WEBP/GIF/HEIC)' }, { status: 400 });
			}
			const dir = ensureDir(item.id);
			const filename = `main-${crypto.randomUUID()}.${validated.ext}`;
			writeFileSync(resolve(dir, filename), validated.buf);
			await evenementService.update(item.id, { imagePrincipale: `/uploads/evenements/${item.id}/${filename}` });
		}

		const createSizeError = galleryTotalSizeError(fd);
		if (createSizeError) {
			await evenementService.delete(item.id);
			removeEventUploadDir(item.id);
			return createSizeError;
		}

		const galleryResult = await storeGalleryPhotos(item.id, fd);
		if (galleryResult instanceof Response) {
			await evenementService.delete(item.id);
			removeEventUploadDir(item.id);
			return galleryResult;
		}
		const created = await serializeEvenement(item.id);
		if (!created) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		return Response.json({ ...created, id: item.id, message: 'Événement créé avec succès' }, { status: 201 });
	},

	async update(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const fd = await req.formData();
		const data: Partial<Evenement> = {};

		const titre = readFormString(fd, 'titre');
		const dateEvenement = readFormString(fd, 'dateEvenement');
		if (titre) data.titre = titre;
		if (dateEvenement) data.dateEvenement = dateEvenement;
		if (fd.has('description')) data.description = readFormString(fd, 'description') || null;
		if (readFormString(fd, 'lieu')) data.lieu = readFormString(fd, 'lieu');
		if (fd.has('difficulte')) data.difficulte = readFormString(fd, 'difficulte') || null;
		if (readFormString(fd, 'heureDepart')) data.heureDepart = readFormString(fd, 'heureDepart');
		if (readFormString(fd, 'dateDepart')) data.dateDepart = readFormString(fd, 'dateDepart');
		if (readFormString(fd, 'heureRetour')) data.heureRetour = readFormString(fd, 'heureRetour');
		if (readFormString(fd, 'dateRetour')) data.dateRetour = readFormString(fd, 'dateRetour');
		const prixStr = readFormString(fd, 'prix');
		if (prixStr) data.prix = parseFloat(prixStr);
		if (fd.has('capaciteMax')) {
			const value = readFormString(fd, 'capaciteMax');
			data.capaciteMax = value ? Number(value) : null;
		}
		if (fd.has('typeEvenementId') || fd.has('typeEvenementNom')) {
			const value = readFormString(fd, 'typeEvenementId');
			const typeEvenementNom = readFormString(fd, 'typeEvenementNom');
			const requestedTypeId = value && value !== '__new__' ? Number(value) : null;
			const resolvedType = await typeEvenementService.resolve(requestedTypeId, typeEvenementNom);
			if (!resolvedType) return Response.json({ error: 'TYPE_EVENEMENT_INVALIDE' }, { status: 400 });
			data.typeEvenementId = resolvedType.id;
			if (!supportsDifficulty(resolvedType)) data.difficulte = null;
		}
		data.estPublie = fd.get('estPublie') === 'on';
		if (!validEventData(data)) return Response.json({ error: 'CHAMPS_INVALIDES' }, { status: 400 });
		const existingItem = await evenementService.getById(id);
		if (!existingItem) return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });

		// Vérification ownership : seul l'admin ou le créateur peut modifier
		if (req.user?.role !== 'admin' && req.user?.id !== existingItem.utilisateurId) {
			return Response.json({ error: 'ACCES_REFUSE', message: 'Vous ne pouvez modifier que vos propres événements' }, { status: 403 });
		}

		const updateSizeError = galleryTotalSizeError(fd);
		if (updateSizeError) return updateSizeError;

		const imageFile = fd.get('imagePrincipale') as File | null;
		let newImagePath: string | null = null;
		if (imageFile && imageFile.size > 0) {
			const validated = await validateImageBuffer(imageFile);
			if (!validated.ok) {
				return Response.json({ error: 'FICHIER_INVALIDE', message: 'Image invalide ou trop grande (max 5 Mo, formats: JPEG/PNG/WEBP/GIF/HEIC)' }, { status: 400 });
			}
			const dir = ensureDir(id);
			const filename = `main-${crypto.randomUUID()}.${validated.ext}`;
			newImagePath = resolve(dir, filename);
			writeFileSync(newImagePath, validated.buf);
			data.imagePrincipale = `/uploads/evenements/${id}/${filename}`;
		}

		const item = await evenementService.update(id, data);
		if (!item) {
			if (newImagePath) removeFiles([newImagePath]);
			return Response.json({ error: 'EVENEMENT_INTROUVABLE' }, { status: 404 });
		}
		if (newImagePath && existingItem.imagePrincipale) removeUploadFile(existingItem.imagePrincipale);

		const galleryResult = await storeGalleryPhotos(id, fd);
		if (galleryResult instanceof Response) return galleryResult;
		const updated = await serializeEvenement(id);
		if (!updated) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		return Response.json({ ...updated, id, message: 'Événement modifié avec succès' });
	},

	async delete(req: BunRequest, params: Record<string, string>): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;
		const existingItem = await evenementService.getById(id);
		if (!existingItem) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });

		// Vérification ownership : seul l'admin ou le créateur peut supprimer
		if (req.user?.role !== 'admin' && req.user?.id !== existingItem.utilisateurId) {
			return Response.json({ error: 'ACCES_REFUSE', message: 'Vous ne pouvez supprimer que vos propres événements' }, { status: 403 });
		}

		const ok = await evenementService.delete(id);
		if (!ok) return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement non trouvé' }, { status: 404 });
		removeEventUploadDir(id);
		return Response.json({ success: true, message: 'Événement supprimé avec succès' });
	},
};
