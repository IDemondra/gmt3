/**
 * Helpers météo — Open-Meteo (offre gratuite, sans clé API).
 *
 * Module pur (aucun accès réseau) : parsing, sélection de l'expédition,
 * libellés WMO. Les appels réseau sont isolés dans `weatherApi.js`.
 */

const FALLBACK_LOCATION = { latitude: -21.45267, longitude: 47.08569, name: 'Fianarantsoa' };
const NEARBY_REGIONS = ['matsiatra supérieur', 'vatovavy', 'ihorombe', "amoron'i mania"];

/** Horizon du palier gratuit : J-15 au maximum. */
export const FORECAST_HORIZON_DAYS = 15;

/** Fuseau de Madagascar : sert de référence pour la date du jour affichée. */
export const FORECAST_TIMEZONE = 'Indian/Antananarivo';

const WEATHER_CODES = {
	0: { label: 'Ensoleillé', icon: 'sunny' },
	1: { label: 'Peu nuageux', icon: 'partly_cloudy_day' },
	2: { label: 'Partiellement nuageux', icon: 'partly_cloudy_day' },
	3: { label: 'Couvert', icon: 'cloud' },
	45: { label: 'Brouillard', icon: 'foggy' },
	48: { label: 'Brouillard givrant', icon: 'foggy' },
	51: { label: 'Bruine faible', icon: 'grain' },
	53: { label: 'Bruine', icon: 'grain' },
	55: { label: 'Bruine dense', icon: 'grain' },
	56: { label: 'Bruine verglaçante', icon: 'rainy' },
	57: { label: 'Bruine verglaçante dense', icon: 'rainy' },
	61: { label: 'Pluie faible', icon: 'rainy' },
	63: { label: 'Pluie modérée', icon: 'rainy' },
	65: { label: 'Pluie forte', icon: 'rainy' },
	66: { label: 'Pluie verglaçante', icon: 'rainy' },
	67: { label: 'Pluie verglaçante forte', icon: 'rainy' },
	71: { label: 'Neige faible', icon: 'snowing' },
	73: { label: 'Neige', icon: 'snowing' },
	75: { label: 'Neige forte', icon: 'snowing' },
	77: { label: 'Grains de neige', icon: 'snowing' },
	80: { label: 'Averses légères', icon: 'rainy' },
	81: { label: 'Averses', icon: 'rainy' },
	82: { label: 'Averses violentes', icon: 'rainy' },
	85: { label: 'Averses de neige', icon: 'snowing' },
	86: { label: 'Averses de neige fortes', icon: 'snowing' },
	95: { label: 'Orage', icon: 'thunderstorm' },
	96: { label: 'Orage avec grêle', icon: 'thunderstorm' },
	99: { label: 'Orage avec grêle forte', icon: 'thunderstorm' },
};

export function describeWeatherCode(code) {
	return WEATHER_CODES[Number(code)] ?? { label: 'Conditions variables', icon: 'partly_cloudy_day' };
}

/** Parse une date "DD/MM/YYYY" (format API) ou "YYYY-MM-DD" (format DB). */
export function parseEventDate(value) {
	if (!value) return null;
	const raw = String(value).trim();
	const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
	if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
	const fr = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw);
	if (fr) return new Date(Number(fr[3]), Number(fr[2]) - 1, Number(fr[1]));
	return null;
}

export function toIsoDate(date) {
	const pad = (n) => String(n).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function toFrDate(date) {
	const pad = (n) => String(n).padStart(2, '0');
	return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function addDays(date, days) {
	const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	copy.setDate(copy.getDate() + days);
	return copy;
}

/** Distance approximative en km entre deux points (formule de Haversine). */
export function distanceKm(lat1, lon1, lat2, lon2) {
	const toRad = (deg) => (deg * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
	return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Choix du bon résultat de géocodage : le lieu libre peut désigner plusieurs
 * localités. On privilégie l'égalité de nom, puis la proximité de l'agence
 * (Fianarantsoa) et les régions voisines, puis les parcs naturels.
 */
export function pickGeocodeResult(results, lieu) {
	if (!Array.isArray(results) || results.length === 0) return null;
	const wanted = String(lieu || '').trim().toLowerCase();
	const scored = results
		.filter((r) => r && Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
		.map((r) => {
			const name = String(r.name || '').trim().toLowerCase();
			const admin1 = String(r.admin1 || '').trim().toLowerCase();
			let score = 0;
			if (wanted && name === wanted) score += 100;
			else if (wanted && name && (name.startsWith(wanted) || wanted.startsWith(name))) score += 60;
			if (NEARBY_REGIONS.includes(admin1)) score += 30;
			if (String(r.feature_code || '') === 'PRK') score += 25;
			score -= Math.min(distanceKm(FALLBACK_LOCATION.latitude, FALLBACK_LOCATION.longitude, r.latitude, r.longitude) / 50, 40);
			return { result: r, score };
		})
		.sort((a, b) => b.score - a.score);
	return scored.length > 0 ? scored[0].result : null;
}

/** Extrait la journée ciblée d'une réponse `daily` Open-Meteo, ou null si absente. */
export function selectForecastDay(daily, isoDate) {
	const times = Array.isArray(daily?.time) ? daily.time : [];
	const index = times.indexOf(isoDate);
	if (index === -1) return null;
	const pick = (values) => (Array.isArray(values) ? values[index] : null);
	const tMax = pick(daily.temperature_2m_max);
	const tMin = pick(daily.temperature_2m_min);
	if (typeof tMax !== 'number' && typeof tMin !== 'number') return null;
	return {
		code: pick(daily.weather_code),
		tMax: typeof tMax === 'number' ? tMax : null,
		tMin: typeof tMin === 'number' ? tMin : null,
		precipitationSum: pick(daily.precipitation_sum),
		precipitationProbability: pick(daily.precipitation_probability_max),
		windMax: pick(daily.wind_speed_10m_max),
	};
}

/**
 * Prochaine expédition publiée : à venir en priorité, sinon en cours.
 * Retourne null si aucune expédition publiée n'est active.
 */
export function pickNextExpedition(events, today = null) {
	const start = getReferenceDay(today);
	const candidates = (Array.isArray(events) ? events : [])
		.filter((e) => e && e.estPublie)
		.map((e) => {
			const date = parseEventDate(e.dateEvenement || e.dateDepart);
			if (!date) return null;
			const end = parseEventDate(e.dateRetour) || date;
			if (end < start) return null;
			return { event: e, date, end, rank: date >= start ? 0 : 1 };
		})
		.filter(Boolean)
		.sort((a, b) => a.rank - b.rank || a.date.getTime() - b.date.getTime());
	return candidates[0] ?? null;
}

/**
 * Date du jour à Madagascar (UTC+3). La date affichée doit correspondre à
 * celle de l'API (fuseau `Indian/Antananarivo`), pas à celle du navigateur.
 */
export function todayInForecastTimezone(now = new Date()) {
	try {
		const parts = new Intl.DateTimeFormat('en-CA', {
			timeZone: FORECAST_TIMEZONE,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).formatToParts(now);
		const value = (type) => parts.find((p) => p.type === type)?.value;
		return new Date(Number(value('year')), Number(value('month')) - 1, Number(value('day')));
	} catch {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}
}

/**
 * Jour de référence : date Madagascar si `today` est absent, sinon jour local
 * de la date fournie (comportement déterministe des tests).
 */
export function getReferenceDay(today) {
	if (!today) return todayInForecastTimezone();
	return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

/**
 * Construit la cible météo (jour J) d'une expédition.
 * Pour une expédition en cours, la cible devient la date du jour.
 */
export function buildForecastTarget(event, today = null) {
	const date = parseEventDate(event?.dateEvenement || event?.dateDepart);
	if (!date) return null;
	const start = getReferenceDay(today);
	const target = date < start ? start : date;
	return {
		titre: event?.titre || 'Prochaine expédition',
		lieu: event?.lieu || '',
		dateFr: toFrDate(target),
		dateIso: toIsoDate(target),
	};
}

/**
 * Cible de repli : aucune expédition à venir => météo du jour à Fianarantsoa.
 * `isFallback` indique qu'il ne s'agit pas d'une expédition.
 */
export function buildDefaultForecastTarget(now = null) {
	const today = getReferenceDay(now);
	return {
		titre: 'Météo à Fianarantsoa',
		lieu: FALLBACK_LOCATION.name,
		dateFr: toFrDate(today),
		dateIso: toIsoDate(today),
		isFallback: true,
	};
}

export { FALLBACK_LOCATION };
