import { AvisService } from '../services/AvisService.js';
import { AvisRepository } from '../repositories/AvisRepository.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import type { BunRequest } from '../types/http.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileTypeFromBuffer } from 'file-type';

const ALLOWED_IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const UPLOADS_ROOT = resolve(import.meta.dir, '..', '..', 'uploads', 'avis');

const avisService = new AvisService(new AvisRepository());
const evenementRepository = new EvenementRepository();

function formatAvisDates<T extends { dateCreation?: string | null }>(a: T): T {
	return { ...a, dateCreation: formatDateToDDMMYYYY(a.dateCreation) };
}

function toPositiveInteger(value: unknown): number | null {
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : null;
}

async function storeAvisPhoto(evenementId: number, file: File): Promise<string | null> {
	if (file.size === 0 || file.size > MAX_FILE_SIZE) return null;
	const buf = Buffer.from(await file.arrayBuffer());
	const type = await fileTypeFromBuffer(buf);
	if (!type || !ALLOWED_IMAGE_MIMES.has(type.mime)) return null;
	const dir = resolve(UPLOADS_ROOT, String(evenementId));
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	const filename = `${Date.now()}.${type.ext}`;
	writeFileSync(resolve(dir, filename), buf);
	return `/uploads/avis/${evenementId}/${filename}`;
}

export const AvisController = {
	// ── Public : déposer un avis (non approuvé par défaut) ──
	async create(req: BunRequest): Promise<Response> {
		const fd = await req.formData();
		const evenementId = toPositiveInteger(fd.get('evenementId'));
		const nom = (fd.get('nom') as string | null)?.trim();
		const note = Number(fd.get('note'));
		const commentaire = (fd.get('commentaire') as string | null)?.trim() || null;

		if (!evenementId || !nom || !Number.isInteger(note) || note < 1 || note > 5) {
			return Response.json({ error: 'CHAMPS_INVALIDES', message: 'Nom, événement et note (1 à 5) sont obligatoires' }, { status: 400 });
		}

		const evenement = await evenementRepository.findById(evenementId);
		if (!evenement) {
			return Response.json({ error: 'EVENEMENT_INTROUVABLE', message: 'Événement introuvable' }, { status: 404 });
		}

		let photoUrl: string | null = null;
		const photo = fd.get('photo');
		if (photo instanceof File && photo.size > 0) {
			photoUrl = await storeAvisPhoto(evenementId, photo);
			if (!photoUrl) {
				return Response.json({ error: 'FICHIER_INVALIDE', message: 'Photo invalide (JPEG/PNG/WEBP, max 5 Mo)' }, { status: 400 });
			}
		}

		const created = await avisService.create({
			evenementId,
			nom,
			note,
			commentaire,
			photoUrl,
			estApprouve: false,
			dateCreation: new Date().toISOString(),
		});

		return Response.json({
			...formatAvisDates(created),
			message: 'Merci ! Votre avis sera publié après modération.',
		}, { status: 201 });
	},

	// ── Admin : liste complète (modération) ──
	async getAll(req: BunRequest): Promise<Response> {
		const items = await avisService.getAll();
		return Response.json({
			data: items.map(formatAvisDates),
			message: `${items.length} avis trouvé(s)`,
		});
	},

	// ── Admin : approuver ──
	async approve(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		const updated = await avisService.approve(id);
		if (!updated) return Response.json({ error: 'AVIS_INTROUVABLE' }, { status: 404 });
		return Response.json({ ...formatAvisDates(updated), message: 'Avis approuvé' });
	},

	// ── Admin : supprimer ──
	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		const ok = await avisService.delete(id);
		if (!ok) return Response.json({ error: 'AVIS_INTROUVABLE' }, { status: 404 });
		return Response.json({ success: true, message: 'Avis supprimé' });
	},
};
