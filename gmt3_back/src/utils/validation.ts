export function toPositiveInteger(value: unknown): number | null {
	const numericValue = Number(value);
	return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
}

export function parseId(value: unknown): number | null {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}
