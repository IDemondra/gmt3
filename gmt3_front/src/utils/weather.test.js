import { describe, expect, test } from 'bun:test';
import {
	buildForecastTarget,
	describeWeatherCode,
	pickGeocodeResult,
	pickNextExpedition,
	parseEventDate,
	selectForecastDay,
	toIsoDate,
} from './weather.js';

const TODAY = new Date(2026, 9, 24); // 24/10/2026

describe('parseEventDate', () => {
	test('parse le format API DD/MM/YYYY', () => {
		const d = parseEventDate('27/07/2026');
		expect(d.getFullYear()).toBe(2026);
		expect(d.getMonth()).toBe(6);
		expect(d.getDate()).toBe(27);
	});

	test('parse le format ISO de la base', () => {
		const d = parseEventDate('2026-07-27');
		expect(toIsoDate(d)).toBe('2026-07-27');
	});

	test('rejette une date invalide', () => {
		expect(parseEventDate('demain')).toBeNull();
		expect(parseEventDate('')).toBeNull();
	});
});

describe('pickNextExpedition', () => {
	const events = [
		{ id: 1, titre: 'Ancienne', estPublie: true, dateEvenement: '01/07/2026', dateRetour: '02/07/2026' },
		{ id: 2, titre: 'Prochaine', estPublie: true, dateEvenement: '02/11/2026', dateRetour: '05/11/2026' },
		{ id: 3, titre: 'Plus tard', estPublie: true, dateEvenement: '20/11/2026', dateRetour: '22/11/2026' },
		{ id: 4, titre: 'Brouillon', estPublie: false, dateEvenement: '25/10/2026', dateRetour: '26/10/2026' },
	];

	test('retourne la première expédition publiée à venir', () => {
		expect(pickNextExpedition(events, TODAY)?.event.id).toBe(2);
	});

	test('ignore les expéditions terminées et les brouillons', () => {
		const onlyPast = [events[0], events[3]];
		expect(pickNextExpedition(onlyPast, TODAY)).toBeNull();
	});

	test('retourne null sans événement', () => {
		expect(pickNextExpedition([], TODAY)).toBeNull();
		expect(pickNextExpedition(null, TODAY)).toBeNull();
	});
});

describe('buildForecastTarget', () => {
	test('cible le jour J de la prochaine expédition', () => {
		const target = buildForecastTarget(
			{ titre: 'Visite', lieu: 'Ranomafana', dateEvenement: '02/11/2026', dateDepart: '02/11/2026' },
			TODAY,
		);
		expect(target.dateIso).toBe('2026-11-02');
		expect(target.dateFr).toBe('02/11/2026');
		expect(target.lieu).toBe('Ranomafana');
	});

	test('cible la date du jour pour une expédition en cours', () => {
		const target = buildForecastTarget(
			{ titre: 'En cours', lieu: 'Fianarantsoa', dateEvenement: '20/10/2026', dateRetour: '28/10/2026' },
			TODAY,
		);
		expect(target.dateIso).toBe('2026-10-24');
	});

	test('retourne null sans date exploitable', () => {
		expect(buildForecastTarget({ titre: 'Sans date' }, TODAY)).toBeNull();
	});
});

describe('describeWeatherCode', () => {
	test('traduit les codes WMO courants', () => {
		expect(describeWeatherCode(0).label).toBe('Ensoleillé');
		expect(describeWeatherCode(61).label).toBe('Pluie faible');
		expect(describeWeatherCode(95).icon).toBe('thunderstorm');
	});

	test('retombe sur un libellé générique', () => {
		expect(describeWeatherCode(999).label).toBe('Conditions variables');
		expect(describeWeatherCode(undefined).label).toBe('Conditions variables');
	});
});

describe('selectForecastDay', () => {
	const daily = {
		time: ['2026-10-24', '2026-10-25'],
		weather_code: [53, 0],
		temperature_2m_max: [25.6, 26.1],
		temperature_2m_min: [15.6, 16.2],
		precipitation_sum: [2.7, 0],
		precipitation_probability_max: [100, 7],
		wind_speed_10m_max: [19, 12],
	};

	test('extrait la journée demandée', () => {
		const day = selectForecastDay(daily, '2026-10-25');
		expect(day.tMax).toBe(26.1);
		expect(day.tMin).toBe(16.2);
		expect(day.precipitationProbability).toBe(7);
		expect(day.code).toBe(0);
	});

	test('retourne null hors de la fenêtre', () => {
		expect(selectForecastDay(daily, '2026-11-10')).toBeNull();
		expect(selectForecastDay(null, '2026-10-25')).toBeNull();
	});
});

describe('pickGeocodeResult', () => {
	const results = [
		{ name: 'Ranomafana', latitude: -24.56598, longitude: 46.95698, admin1: 'Anosy Region', feature_code: 'PPL' },
		{ name: 'Ranomafana National Park', latitude: -21.36788, longitude: 47.39025, admin1: 'Matsiatra Supérieur', feature_code: 'PRK' },
	];

	test('privilégie le site proche de l’agence et le parc naturel', () => {
		const picked = pickGeocodeResult(results, 'Ranomafana');
		expect(picked.name).toBe('Ranomafana National Park');
	});

	test('retourne null sans résultat exploitable', () => {
		expect(pickGeocodeResult([], 'Fianarantsoa')).toBeNull();
		expect(pickGeocodeResult(null, 'Fianarantsoa')).toBeNull();
	});
});
