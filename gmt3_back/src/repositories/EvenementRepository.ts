import type { IRepository } from './interfaces/IRepository.js';
import type { Evenement, NewEvenement } from '../types/index.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { evenements } from '../models/schema.js';

export class EvenementRepository implements IRepository<Evenement, NewEvenement> {
    async findAll(): Promise<Evenement[]> {
        return db.select().from(evenements);
    }
    async findById(id: number): Promise<Evenement | undefined> {
        const rows = await db.select().from(evenements).where(eq(evenements.id, id)).limit(1);
        return rows[0];
    }
    async create(data: NewEvenement): Promise<Evenement> {
        const rows = await db.insert(evenements).values(data).returning();
        return rows[0]!;
    }
    async update(id: number, data: Partial<Evenement>): Promise<Evenement | undefined> {
        const rows = await db.update(evenements).set(data).where(eq(evenements.id, id)).returning();
        return rows[0];
    }
    async delete(id: number): Promise<boolean> {
        const rows = await db.delete(evenements).where(eq(evenements.id, id)).returning({ id: evenements.id });
        return rows.length > 0;
    }
}
