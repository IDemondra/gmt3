import { existsSync, readdirSync, rmSync } from 'fs';
import { resolve, sep } from 'path';

export const UPLOADS_ROOT = resolve(import.meta.dir, '..', '..', 'uploads', 'evenements');
const UPLOADS_ROOT_PREFIX = `${UPLOADS_ROOT}${sep}`;

function assertEventId(eventId: number): void {
	if (!Number.isInteger(eventId) || eventId <= 0) throw new Error('Identifiant événement invalide');
}

export function eventUploadDir(eventId: number): string {
	assertEventId(eventId);
	return resolve(UPLOADS_ROOT, String(eventId));
}

export function galleryUploadDir(eventId: number): string {
	return resolve(eventUploadDir(eventId), 'gallery');
}

function safeUploadPath(filePath: string): string {
	const normalized = resolve(filePath);
	if (!normalized.startsWith(UPLOADS_ROOT_PREFIX)) throw new Error('Chemin upload hors périmètre');
	return normalized;
}

export function listGalleryFilePaths(eventId: number): string[] {
	const dir = galleryUploadDir(eventId);
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isFile())
		.map((entry) => safeUploadPath(resolve(dir, entry.name)));
}

export function removeFiles(filePaths: string[]): void {
	for (const filePath of filePaths) rmSync(safeUploadPath(filePath), { force: true });
}

export function removeUploadFile(url: string | null | undefined): void {
	const prefix = '/uploads/evenements/';
	if (!url?.startsWith(prefix)) return;
	const relativePath = url.slice(prefix.length).replaceAll('/', sep);
	const filePath = resolve(UPLOADS_ROOT, relativePath);
	if (filePath.startsWith(UPLOADS_ROOT_PREFIX)) removeFiles([filePath]);
}

export function removeEventUploadDir(eventId: number): void {
	rmSync(safeUploadPath(eventUploadDir(eventId)), { recursive: true, force: true });
}
