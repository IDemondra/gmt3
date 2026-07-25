import { expect, test } from 'bun:test';
import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { eventUploadDir, removeEventUploadDir } from '../src/utils/uploadCleanup.js';

test('supprime les fichiers uploadés avec le dossier de l’événement', async () => {
	const eventId = 2_000_000_000 + (Date.now() % 100_000);
	const eventDir = eventUploadDir(eventId);
	const galleryDir = resolve(eventDir, 'gallery');
	const filePath = resolve(galleryDir, 'old-gallery.webp');
	mkdirSync(galleryDir, { recursive: true });
	await Bun.write(filePath, 'test');

	try {
		expect(existsSync(filePath)).toBe(true);
		removeEventUploadDir(eventId);
		expect(existsSync(filePath)).toBe(false);
		expect(existsSync(eventDir)).toBe(false);
	} finally {
		removeEventUploadDir(eventId);
	}
});
