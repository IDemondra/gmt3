import { describe, expect, test } from 'bun:test';
import { storeGalleryPhotos } from '../src/controllers/EvenementController.js';

function fakeFormData(files: File[]) {
	return { getAll: () => files };
}

describe('storeGalleryPhotos — validation explicite des photos', () => {
	test('rejette 400 quand une photo dépasse 5 Mo au lieu de l’ignorer', async () => {
		const big = new File([new Uint8Array(6 * 1024 * 1024)], 'TRES-GROSSE.jpg', { type: 'image/jpeg' });

		const result = await storeGalleryPhotos(1, fakeFormData([big]));

		expect(result).toBeInstanceOf(Response);
		expect((result as Response).status).toBe(400);
		const body = await (result as Response).json() as { error?: string; message?: string };
		expect(body.error).toBe('FICHIER_TROP_LOURD');
		expect(body.message).toContain('TRES-GROSSE.jpg');
		expect(body.message).toContain('5 Mo');
	});

	test('rejette 400 quand un fichier n’est pas une image', async () => {
		const garbage = new File([new Uint8Array([0x00, 0x01, 0x02, 0x03])], 'fichier.txt', { type: 'text/plain' });

		const result = await storeGalleryPhotos(1, fakeFormData([garbage]));

		expect(result).toBeInstanceOf(Response);
		expect((result as Response).status).toBe(400);
		const body = await (result as Response).json() as { error?: string; message?: string };
		expect(body.error).toBe('FICHIER_INVALIDE');
		expect(body.message).toContain('fichier.txt');
	});

	test('aucune photo → aucun rejet', async () => {
		const result = await storeGalleryPhotos(1, fakeFormData([]));
		expect(result).toEqual([]);
	});
});