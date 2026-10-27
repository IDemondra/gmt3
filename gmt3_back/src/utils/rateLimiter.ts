import { db } from '../config/database.js';
import { rateLimits } from '../models/schema.js';
import { eq, and, lt, gt } from 'drizzle-orm';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function checkRateLimit(
	identifier: string,
	endpoint: string,
	maxAttempts: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
	const now = Date.now();
	const windowStart = now - WINDOW_MS;

	// Clean expired entries
	await db.delete(rateLimits).where(lt(rateLimits.resetAt, now));

	// Find or create rate limit entry
	const [existing] = await db
		.select()
		.from(rateLimits)
		.where(and(eq(rateLimits.identifier, identifier), eq(rateLimits.endpoint, endpoint)))
		.limit(1);

	if (!existing) {
		const resetAt = now + WINDOW_MS;
		await db.insert(rateLimits).values({
			identifier,
			endpoint,
			count: 1,
			resetAt,
		});
		return { allowed: true, remaining: maxAttempts - 1, resetAt };
	}

	if (existing.count >= maxAttempts) {
		return { allowed: false, remaining: 0, resetAt: existing.resetAt };
	}

	await db
		.update(rateLimits)
		.set({ count: existing.count + 1 })
		.where(eq(rateLimits.id, existing.id));

	return { allowed: true, remaining: maxAttempts - existing.count - 1, resetAt: existing.resetAt };
}

export async function resetRateLimit(identifier: string, endpoint: string): Promise<void> {
	await db.delete(rateLimits).where(and(eq(rateLimits.identifier, identifier), eq(rateLimits.endpoint, endpoint)));
}