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
