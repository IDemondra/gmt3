import { describe, expect, test } from 'bun:test';
import { buildGalleryUploadPlan } from '../src/utils/photoGallery.js';

describe('buildGalleryUploadPlan', () => {
	test('keeps input order and caps the gallery to ten photos', () => {
		const files = Array.from({ length: 12 }, (_, index) => new File(['x'], `photo-${index + 1}.jpg`, { type: 'image/jpeg' }));

		const plan = buildGalleryUploadPlan(42, files);

		expect(plan).toHaveLength(10);
		expect(plan[0]?.filename).toBe('01-photo-1.jpg');
		expect(plan[9]?.filename).toBe('10-photo-10.jpg');
		expect(plan[0]?.url).toBe('/uploads/evenements/42/gallery/01-photo-1.jpg');
		expect(plan[0]?.ordre).toBe(1);
	});
});
