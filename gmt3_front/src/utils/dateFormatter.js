const MOIS_FR = [
	'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
	'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function formatDateFr(dateString) {
	if (!dateString) return '';
	try {
		const [day, month, year] = dateString.split('/');
		const monthName = MOIS_FR[parseInt(month, 10) - 1];
		return `${parseInt(day, 10)} ${monthName} ${year}`;
	} catch {
		return dateString;
	}
}

/** Parse une date "DD/MM/YYYY" en objet Date (minuit local), ou null si invalide. */
export function parseFrDate(dateString) {
	if (!dateString) return null;
	const parts = String(dateString).split('/');
	if (parts.length !== 3) return null;
	const [day, month, year] = parts.map(Number);
	if (!day || !month || !year) return null;
	const d = new Date(year, month - 1, day);
	return Number.isNaN(d.getTime()) ? null : d;
}

/** Timestamp (ms) d'une date "DD/MM/YYYY", ou 0 si invalide. Pratique pour trier. */
export function frDateToTs(dateString) {
	const d = parseFrDate(dateString);
	return d ? d.getTime() : 0;
}

/** Retourne true si la date DD/MM/YYYY est aujourd'hui ou dans le futur. */
export function isDateInFuture(dateString) {
	const eventDate = parseFrDate(dateString);
	if (!eventDate) return false;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return eventDate >= today;
}

/**
 * Statut d'un événement selon la date du jour.
 * 'upcoming' (à venir), 'ongoing' (en cours), 'past' (terminé), 'unknown' (date invalide).
 */
export function getEventStatus(dateDepart, dateRetour, dateEvenement) {
	const start = parseFrDate(dateDepart || dateEvenement);
	if (!start) return 'unknown';
	const end = parseFrDate(dateRetour) || start;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (today < start) return 'upcoming';
	if (today > end) return 'past';
	return 'ongoing';
}

/** true si l'événement est à venir ou en cours (donc encore actif, non archivé). */
export function isEventActive(dateDepart, dateRetour, dateEvenement) {
	return getEventStatus(dateDepart, dateRetour, dateEvenement) !== 'past';
}

/** true si l'événement est terminé (archivable). */
export function isEventPast(dateDepart, dateRetour, dateEvenement) {
	return getEventStatus(dateDepart, dateRetour, dateEvenement) === 'past';
}

export function formatDateTimeWithHour(dateString, timeString) {
	if (!dateString) return '';
	const dateFr = formatDateFr(dateString);
	if (!timeString) return dateFr;
	return `${dateFr} à ${timeString}`;
}

/** Formats an ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS) to "20 Juin 2026". */
export function formatIsoDateFr(isoString) {
	if (!isoString) return '—';
	try {
		const [datePart] = isoString.split('T');
		const [y, m, d] = datePart.split('-');
		return formatDateFr(`${d}/${m}/${y}`);
	} catch {
		return isoString;
	}
}

/** Formats an ISO datetime string to "20 Juin 2026 à 18:09". */
export function formatIsoDateTimeFr(isoString) {
	if (!isoString) return '—';
	try {
		const [datePart, timePart] = isoString.split('T');
		const [y, m, d] = datePart.split('-');
		const time = timePart ? timePart.slice(0, 5) : null;
		return formatDateTimeWithHour(`${d}/${m}/${y}`, time);
	} catch {
		return isoString;
	}
}
