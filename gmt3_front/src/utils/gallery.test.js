import { describe, expect, test } from 'bun:test';
import { buildPreviewGallery } from './gallery.js';

describe('buildPreviewGallery', () => {
	test('keeps the main image first and removes duplicates', () => {
		const result = buildPreviewGallery('/main.jpg', ['/a.jpg', '/main.jpg', '/b.jpg']);

		expect(result).toEqual(['/main.jpg', '/a.jpg', '/b.jpg']);
	});

	test('limits the preview gallery to ten images', () => {
		const gallery = Array.from({ length: 12 }, (_, index) => `/photo-${index + 1}.jpg`);

		const result = buildPreviewGallery('/main.jpg', gallery);

		expect(result).toHaveLength(10);
		expect(result[0]).toBe('/main.jpg');
		expect(result[9]).toBe('/photo-9.jpg');
	});
});
