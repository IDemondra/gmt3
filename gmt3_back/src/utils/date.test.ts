import { describe, expect, test } from 'bun:test';
import { formatDateToDDMMYYYY } from './date.js';

describe('formatDateToDDMMYYYY', () => {
	test('formate une chaîne ISO', () => {
		expect(formatDateToDDMMYYYY('2026-04-18T08:11:59.000Z')).toMatch(/^\d{2}\/\d{2}\/2026$/);
	});

	test('préserve une date calendrier sans décalage horaire', () => {
		expect(formatDateToDDMMYYYY('2026-07-11')).toBe('11/07/2026');
	});

	test('formate un objet Date', () => {
		expect(formatDateToDDMMYYYY(new Date(2026, 5, 22))).toBe('22/06/2026');
	});

	test('pad jour et mois sur 2 chiffres', () => {
		expect(formatDateToDDMMYYYY(new Date(2026, 0, 5))).toBe('05/01/2026');
	});

	test('retourne chaîne vide pour null/undefined', () => {
		expect(formatDateToDDMMYYYY(null)).toBe('');
		expect(formatDateToDDMMYYYY(undefined)).toBe('');
	});

	test('retourne chaîne vide pour date invalide', () => {
		expect(formatDateToDDMMYYYY('pas-une-date')).toBe('');
	});
});
