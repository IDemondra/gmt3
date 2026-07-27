import type { IRepository } from './interfaces/IRepository.js';
import type { Evenement, NewEvenement } from '../types/index.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { evenements, reservations, photosEvenement } from '../models/schema.js';

export class EvenementRepository implements IRepository<Evenement, NewEvenement> {
    async findAll(): Promise<Evenement[]> {
        return db.select().from(evenements);
    }
    async findById(id: number): Promise<Evenement | undefined> {
        const rows = await db.select().from(evenements).where(eq(evenements.id, id)).limit(1);
        return rows[0];
    }
    async findByPublicCode(publicCode: string): Promise<Evenement | undefined> {
        const rows = await db.select().from(evenements).where(eq(evenements.publicCode, publicCode)).limit(1);
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
        // Suppression des lignes filles avant l'événement (FK), atomique.
        return db.transaction((tx) => {
            tx.delete(reservations).where(eq(reservations.evenementId, id)).run();
            tx.delete(photosEvenement).where(eq(photosEvenement.evenementId, id)).run();
            const rows = tx
                .delete(evenements)
                .where(eq(evenements.id, id))
                .returning({ id: evenements.id })
                .all();
            return rows.length > 0;
        });
    }
}
