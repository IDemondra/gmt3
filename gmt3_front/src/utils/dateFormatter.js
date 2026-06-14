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
		const [datePart, timePart] = isoString.split('T');
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
