import type { IRepository } from './interfaces/IRepository.js';
import type { Avis, NewAvis } from '../types/index.js';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { avis } from '../models/schema.js';

export class AvisRepository implements IRepository<Avis, NewAvis> {
	async findAll(): Promise<Avis[]> {
		return db.select().from(avis).orderBy(desc(avis.dateCreation));
	}

	async findById(id: number): Promise<Avis | undefined> {
		const rows = await db.select().from(avis).where(eq(avis.id, id)).limit(1);
		return rows[0];
	}

	/** Avis approuvés d'un événement (affichage public). */
	async findApprovedByEvenementId(evenementId: number): Promise<Avis[]> {
		return db
			.select()
			.from(avis)
			.where(and(eq(avis.evenementId, evenementId), eq(avis.estApprouve, true)))
			.orderBy(desc(avis.dateCreation));
	}

	/** Tous les avis approuvés (alimente Preuves de Terrain). */
	async findAllApproved(): Promise<Avis[]> {
		return db.select().from(avis).where(eq(avis.estApprouve, true)).orderBy(desc(avis.dateCreation));
	}

	async create(data: NewAvis): Promise<Avis> {
		const rows = await db.insert(avis).values(data).returning();
		return rows[0]!;
	}

	async update(id: number, data: Partial<Avis>): Promise<Avis | undefined> {
		const rows = await db.update(avis).set(data).where(eq(avis.id, id)).returning();
		return rows[0];
	}

	async delete(id: number): Promise<boolean> {
		const rows = await db.delete(avis).where(eq(avis.id, id)).returning({ id: avis.id });
		return rows.length > 0;
	}
}
