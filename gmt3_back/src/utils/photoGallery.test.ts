import { describe, expect, test } from 'bun:test';
import { buildGalleryUploadPlan } from './photoGallery.js';

function fakeFile(name: string, size = 10): File {
	return new File([new Uint8Array(size)], name, { type: 'image/jpeg' });
}

describe('buildGalleryUploadPlan', () => {
	test('numérote ordre à partir de 1 et préfixe le nom', () => {
		const plan = buildGalleryUploadPlan(7, [fakeFile('IMG_1.jpg'), fakeFile('IMG_2.jpg')]);
		expect(plan).toHaveLength(2);
		expect(plan[0]!.ordre).toBe(1);
		expect(plan[0]!.filename).toBe('01-IMG_1.jpg');
		expect(plan[0]!.url).toBe('/uploads/evenements/7/gallery/01-IMG_1.jpg');
	});

	test('plafonne à 10 photos', () => {
		const files = Array.from({ length: 15 }, (_, i) => fakeFile(`p${i}.jpg`));
		expect(buildGalleryUploadPlan(1, files)).toHaveLength(10);
	});

	test('ignore les fichiers vides', () => {
		const plan = buildGalleryUploadPlan(1, [fakeFile('ok.jpg'), fakeFile('vide.jpg', 0)]);
		expect(plan).toHaveLength(1);
	});

	test('assainit les caractères dangereux du nom', () => {
		const plan = buildGalleryUploadPlan(1, [fakeFile('../../etc/passwd.jpg')]);
		expect(plan[0]!.filename).toBe('01-passwd.jpg');
	});
});
