/**
 * Format a date string or Date object to "dd/mm/yyyy".
 * Returns an empty string if the input is null/undefined/invalid.
 */
export function formatDateToDDMMYYYY(date: string | Date | null | undefined): string {
	if (!date) return '';
	const d = typeof date === 'string' ? new Date(date) : date;
	if (Number.isNaN(d.getTime())) return '';
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}
