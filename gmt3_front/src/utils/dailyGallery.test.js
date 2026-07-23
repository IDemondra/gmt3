import { describe, expect, test } from 'bun:test';
import { buildDailyGallery, getLocalDayKey } from './dailyGallery.js';

const events = [
	{
		id: 1,
		photosEvenement: [{ url: '/event-1-a.jpg' }, { url: '/event-1-b.jpg' }],
	},
	{
		id: 2,
		photosEvenement: [{ url: '/event-2-a.jpg' }, { url: '/event-2-b.jpg' }],
	},
];

describe('buildDailyGallery', () => {
	test('garde même sélection pendant journée', () => {
		const first = buildDailyGallery(events, 4, '2026-07-23');
		const second = buildDailyGallery(events, 4, '2026-07-23');

		expect(second).toEqual(first);
	});

	test('mélange événements passés dans sélection', () => {
		const result = buildDailyGallery(events, 4, '2026-07-23');

		expect(new Set(result.map(({ event }) => event.id))).toEqual(new Set([1, 2]));
		expect(result).toHaveLength(4);
	});

	test('change sélection entre deux jours', () => {
		const first = buildDailyGallery(events, 4, '2026-07-23');
		const second = buildDailyGallery(events, 4, '2026-07-24');

		expect(second).not.toEqual(first);
	});

	test('ne modifie pas données source et ignore doublons invalides', () => {
		const source = [
			{ id: 3, photosEvenement: [{ url: '/same.jpg' }, { url: '' }, { url: '/same.jpg' }] },
		];

		expect(buildDailyGallery(source, 5, '2026-07-23')).toHaveLength(1);
		expect(source).toEqual([
			{ id: 3, photosEvenement: [{ url: '/same.jpg' }, { url: '' }, { url: '/same.jpg' }] },
		]);
	});
});

describe('getLocalDayKey', () => {
	test('utilise date locale avec format stable', () => {
		expect(getLocalDayKey(new Date(2026, 6, 23))).toBe('2026-07-23');
	});
});
