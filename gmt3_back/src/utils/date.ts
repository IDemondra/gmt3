/**
 * Format a date string or Date object to "dd/mm/yyyy".
 * Returns an empty string if the input is null/undefined/invalid.
 */
export function formatDateToDDMMYYYY(date: string | Date | null | undefined): string {
	if (!date) return '';
	const d = typeof date === 'string' ? parseCalendarDate(date) : date;
	if (Number.isNaN(d.getTime())) return '';
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}

export function parseCalendarDate(value: string): Date {
	const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (dateOnly) return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
	return new Date(value);
}

export function formatDateFields<T extends Record<string, unknown>>(value: T, fields: readonly string[]): T {
	const result = { ...value } as Record<string, unknown>;
	for (const field of fields) {
		result[field] = formatDateToDDMMYYYY(value[field] as string | Date | null | undefined);
	}
	return result as T;
}
