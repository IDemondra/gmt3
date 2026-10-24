import { afterEach, describe, expect, test } from 'bun:test';
import { clearWeatherCache, getEventForecast } from './weatherApi.js';

const ORIGINAL_FETCH = globalThis.fetch;

function mockFetch(handler) {
	globalThis.fetch = async (url, options) => handler(String(url), options);
}

function jsonResponse(payload) {
	return {
		ok: true,
		status: 200,
		json: async () => payload,
	};
}

const FALLBACK_EVENT = {
	titre: 'Météo à Fianarantsoa',
	lieu: 'Fianarantsoa',
	dateFr: '24/10/2026',
	dateIso: '2026-10-24',
	isFallback: true,
};

const DAILY = {
	time: ['2026-10-24'],
	weather_code: [53],
	temperature_2m_max: [25.6],
	temperature_2m_min: [15.6],
	precipitation_sum: [2.7],
	precipitation_probability_max: [100],
	wind_speed_10m_max: [19],
};

afterEach(() => {
	globalThis.fetch = ORIGINAL_FETCH;
	clearWeatherCache();
});

describe('getEventForecast — données volatiles', () => {
	test('lit la prévision en direct chez Open-Meteo', async () => {
		mockFetch((url) => {
			if (url.includes('api.open-meteo.com')) return jsonResponse({ daily: DAILY });
			throw new Error(`URL inattendue : ${url}`);
		});
		const result = await getEventForecast(FALLBACK_EVENT, new Date(2026, 9, 24));
		expect(result.status).toBe('ok');
		expect(result.tMax).toBe(25.6);
		expect(result.label).toBe('Bruine');
		expect(result.isFallback).toBe(true);
	});

	test('n’interroge jamais un fichier local de secours', async () => {
		const urls = [];
		mockFetch((url) => {
			urls.push(url);
			if (url.includes('api.open-meteo.com')) return jsonResponse({ daily: DAILY });
			throw new Error(`URL inattendue : ${url}`);
		});
		await getEventForecast(FALLBACK_EVENT, new Date(2026, 9, 24));
		expect(urls.some((url) => url.includes('/data/'))).toBe(false);
	});

	test('indique l’indisponibilité quand Open-Meteo est injoignable', async () => {
		mockFetch((url) => {
			if (url.includes('api.open-meteo.com')) throw new Error('network');
			throw new Error(`URL inattendue : ${url}`);
		});
		const result = await getEventForecast(FALLBACK_EVENT, new Date(2026, 9, 24));
		expect(result.status).toBe('unavailable');
	});

	test('sert le cache mémoire puis le purge après invalidation', async () => {
		let calls = 0;
		mockFetch((url) => {
			if (url.includes('api.open-meteo.com')) {
				calls += 1;
				return jsonResponse({ daily: DAILY });
			}
			throw new Error(`URL inattendue : ${url}`);
		});
		await getEventForecast(FALLBACK_EVENT, new Date(2026, 9, 24));
		await getEventForecast(FALLBACK_EVENT, new Date(2026, 9, 24));
		expect(calls).toBe(1);
		clearWeatherCache();
		await getEventForecast(FALLBACK_EVENT, new Date(2026, 9, 24));
		expect(calls).toBe(2);
	});

	test('signale l’horizon indisponible au-delà de J-15', async () => {
		mockFetch(() => {
			throw new Error('URL inattendue');
		});
		const result = await getEventForecast(
			{ titre: 'Future', lieu: 'Ranomafana', dateFr: '30/11/2026', dateIso: '2026-11-30' },
			new Date(2026, 9, 24),
		);
		expect(result.status).toBe('out_of_range');
		expect(result.availableFromFr).toBe('15/11/2026');
	});
});
