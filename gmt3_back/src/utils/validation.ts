export async function readJsonObject(req: Request): Promise<Record<string, unknown> | null> {
	try {
		const value: unknown = await req.json();
		return value !== null && typeof value === 'object' && !Array.isArray(value)
			? value as Record<string, unknown>
			: null;
	} catch {
		return null;
	}
}

export function isString(value: unknown, minLength = 0, maxLength = Number.MAX_SAFE_INTEGER): value is string {
	return typeof value === 'string' && value.trim().length >= minLength && value.length <= maxLength;
}

export function readFormString(formData: { get(name: string): unknown }, name: string): string | undefined {
	const value = formData.get(name);
	return typeof value === 'string' ? value : undefined;
}

export function toPositiveInteger(value: unknown): number | null {
	const numericValue = Number(value);
	return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
}

export function parseId(value: unknown): number | null {
	const id = Number(value);
	return Number.isInteger(id) && id > 0 ? id : null;
}
