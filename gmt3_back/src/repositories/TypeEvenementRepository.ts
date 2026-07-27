import { asc, eq, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { typesEvenement } from '../models/schema.js';
import type { TypeEvenement } from '../types/index.js';

export class TypeEvenementRepository {
	async findActive(): Promise<TypeEvenement[]> {
		return db.select().from(typesEvenement).where(eq(typesEvenement.actif, true)).orderBy(asc(typesEvenement.ordre), asc(typesEvenement.nom));
	}

	async findById(id: number): Promise<TypeEvenement | undefined> {
		const rows = await db.select().from(typesEvenement).where(eq(typesEvenement.id, id)).limit(1);
		return rows[0];
	}

	async findByCode(code: string): Promise<TypeEvenement | undefined> {
		const rows = await db.select().from(typesEvenement).where(eq(typesEvenement.code, code)).limit(1);
		return rows[0];
	}

	async create(data: { code: string; nom: string; icone: string; libelleRythme: string; ordre: number }): Promise<TypeEvenement> {
		const rows = await db.insert(typesEvenement).values(data).returning();
		return rows[0]!;
	}

	async nextOrder(): Promise<number> {
		const rows = await db.select({ value: sql<number>`coalesce(max(${typesEvenement.ordre}), 0) + 1` }).from(typesEvenement);
		return Number(rows[0]?.value ?? 1);
	}
}
