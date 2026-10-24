/**
 * Appels réseau Open-Meteo (offre gratuite, sans clé API).
 *
 * Exécuté côté client uniquement : aucune donnée sensible, aucun secret exposé,
 * et le rendu serveur (SSR) reste rapide. Aucune météo n'est persistée :
 * le cache vit en mémoire (volatile) et expire après CACHE_TTL_MS.
 */

import {
	FALLBACK_LOCATION,
	FORECAST_HORIZON_DAYS,
	FORECAST_TIMEZONE,
	addDays,
	describeWeatherCode,
	getReferenceDay,
	parseEventDate,
	pickGeocodeResult,
	selectForecastDay,
	toFrDate,
} from './weather.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const DAILY_FIELDS = [
	'weather_code',
	'temperature_2m_max',
	'temperature_2m_min',
	'precipitation_sum',
	'precipitation_probability_max',
	'wind_speed_10m_max',
].join(',');
const REQUEST_TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_PLACE_NAME_LENGTH = 100;
const MAX_CACHE_ENTRIES = 50;

/** Cache volatile : mémoire uniquement, perdu au rechargement de la page. */
const memoryCache = new Map();

function readCache(key) {
	const entry = memoryCache.get(key);
	if (!entry) return null;
	if (entry.expires <= Date.now()) {
		memoryCache.delete(key);
		return null;
	}
	return entry.value;
}

function writeCache(key, value) {
	memoryCache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
	if (memoryCache.size > MAX_CACHE_ENTRIES) {
		const oldest = memoryCache.keys().next().value;
		if (oldest !== undefined) memoryCache.delete(oldest);
	}
}

/** Vide le cache météo (changement de jour, invalidation explicite). */
export function clearWeatherCache() {
	memoryCache.clear();
}

async function fetchJson(url) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
	try {
		const res = await fetch(url, { signal: controller.signal });
		if (!res.ok) throw new Error(`HTTP_${res.status}`);
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}

/** Coordonnées du lieu de l'expédition, avec repli sur Fianarantsoa. */
export async function resolveLocation(lieu) {
	const name = String(lieu || '').trim();
	if (!name || name.length > MAX_PLACE_NAME_LENGTH) return { ...FALLBACK_LOCATION, fallback: true };
	const cacheKey = `geo:${name.toLowerCase()}`;
	const cached = readCache(cacheKey);
	if (cached) return cached;
	try {
		const params = new URLSearchParams({
			name,
			count: '10',
			language: 'fr',
			countryCode: 'MG',
		});
		const json = await fetchJson(`${GEOCODING_URL}?${params.toString()}`);
		const best = pickGeocodeResult(json?.results, name);
		const value = best
			? { latitude: best.latitude, longitude: best.longitude, name: best.name || name, fallback: false }
			: { ...FALLBACK_LOCATION, fallback: true };
		writeCache(cacheKey, value);
		return value;
	} catch {
		return { ...FALLBACK_LOCATION, fallback: true };
	}
}

async function fetchDaily(latitude, longitude, isoDate) {
	const cacheKey = `forecast:${Number(latitude).toFixed(3)},${Number(longitude).toFixed(3)}:${isoDate}`;
	const cached = readCache(cacheKey);
	if (cached) return cached;
	const params = new URLSearchParams({
		latitude: String(latitude),
		longitude: String(longitude),
		daily: DAILY_FIELDS,
		timezone: FORECAST_TIMEZONE,
		start_date: isoDate,
		end_date: isoDate,
	});
	const json = await fetchJson(`${FORECAST_URL}?${params.toString()}`);
	const daily = json?.daily ?? null;
	if (daily) writeCache(cacheKey, daily);
	return daily;
}

/**
 * Prévision du jour J d'une expédition.
 * status : 'ok' | 'out_of_range' | 'unavailable'
 */
export async function getEventForecast(event, today = null) {
	const target = event?.dateIso;
	if (!target) return { status: 'unavailable' };
	const targetDate = parseEventDate(target);
	if (!targetDate) return { status: 'unavailable' };
	const start = getReferenceDay(today);
	const daysUntil = Math.round((targetDate.getTime() - start.getTime()) / 86400000);
	const base = {
		lieu: event.lieu || '',
		dateFr: event.dateFr || '',
		titre: event.titre || '',
		isFallback: event.isFallback === true,
	};
	if (daysUntil > FORECAST_HORIZON_DAYS) {
		const availableFrom = addDays(targetDate, -FORECAST_HORIZON_DAYS);
		return {
			...base,
			status: 'out_of_range',
			availableFromFr: toFrDate(availableFrom),
			horizonDays: FORECAST_HORIZON_DAYS,
		};
	}
	try {
		const location = event.isFallback
			? { ...FALLBACK_LOCATION, fallback: false }
			: await resolveLocation(event.lieu);
		const daily = await fetchDaily(location.latitude, location.longitude, target);
		if (!daily) return { ...base, status: 'unavailable' };
		const day = selectForecastDay(daily, target);
		if (!day) return { ...base, status: 'unavailable' };
		const description = describeWeatherCode(day.code);
		return {
			...base,
			status: 'ok',
			lieu: event.lieu || location.name,
			locationName: location.name,
			label: description.label,
			icon: description.icon,
			tMax: day.tMax,
			tMin: day.tMin,
			precipitationSum: day.precipitationSum,
			precipitationProbability: day.precipitationProbability,
			windMax: day.windMax,
			isFallbackLocation: location.fallback === true,
		};
	} catch {
		return { ...base, status: 'unavailable' };
	}
}
