import type { IRepository } from './interfaces/IRepository.js';
import type { PhotoEvenement, NewPhotoEvenement } from '../types/index.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { photosEvenement } from '../models/schema.js';

export class PhotoEvenementRepository implements IRepository<PhotoEvenement, NewPhotoEvenement> {
    async findAll(): Promise<PhotoEvenement[]> {
        return db.select().from(photosEvenement);
    }
    async findById(id: number): Promise<PhotoEvenement | undefined> {
        const rows = await db.select().from(photosEvenement).where(eq(photosEvenement.id, id)).limit(1);
        return rows[0];
    }
    async findByEvenementId(evenementId: number): Promise<PhotoEvenement[]> {
        return db.select().from(photosEvenement).where(eq(photosEvenement.evenementId, evenementId));
    }
    async create(data: NewPhotoEvenement): Promise<PhotoEvenement> {
        const rows = await db.insert(photosEvenement).values(data).returning();
        return rows[0]!;
    }
    async update(id: number, data: Partial<PhotoEvenement>): Promise<PhotoEvenement | undefined> {
        const rows = await db.update(photosEvenement).set(data).where(eq(photosEvenement.id, id)).returning();
        return rows[0];
    }
    async delete(id: number): Promise<boolean> {
        const rows = await db.delete(photosEvenement).where(eq(photosEvenement.id, id)).returning({ id: photosEvenement.id });
        return rows.length > 0;
    }
}
