import type { IRepository } from './interfaces/IRepository.js';
import type { PhotoEvenement, NewPhotoEvenement } from '../types/index.js';
import { asc, eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { photosEvenement } from '../models/schema.js';

export class PhotoEvenementRepository implements IRepository<PhotoEvenement, NewPhotoEvenement> {
    constructor(private readonly database: typeof db = db) {}

    async findAll(): Promise<PhotoEvenement[]> {
        return this.database.select().from(photosEvenement);
    }
    async findById(id: number): Promise<PhotoEvenement | undefined> {
        const rows = await this.database.select().from(photosEvenement).where(eq(photosEvenement.id, id)).limit(1);
        return rows[0];
    }
    async findByEvenementId(evenementId: number): Promise<PhotoEvenement[]> {
        return this.database.select().from(photosEvenement).where(eq(photosEvenement.evenementId, evenementId));
    }
    async findByEvenementIdOrdered(evenementId: number): Promise<PhotoEvenement[]> {
        return this.database.select().from(photosEvenement).where(eq(photosEvenement.evenementId, evenementId)).orderBy(asc(photosEvenement.ordre));
    }
    async create(data: NewPhotoEvenement): Promise<PhotoEvenement> {
        const rows = await this.database.insert(photosEvenement).values(data).returning();
        return rows[0]!;
    }
    async createMany(data: NewPhotoEvenement[]): Promise<PhotoEvenement[]> {
        if (data.length === 0) return [];
        return this.database.insert(photosEvenement).values(data).returning();
    }
    async update(id: number, data: Partial<PhotoEvenement>): Promise<PhotoEvenement | undefined> {
        const rows = await this.database.update(photosEvenement).set(data).where(eq(photosEvenement.id, id)).returning();
        return rows[0];
    }
    /**
     * Remplace toute la galerie d'un événement dans une transaction unique :
     * soit les nouvelles lignes remplacent les anciennes, soit rien ne change.
     */
    async replaceByEvenementId(evenementId: number, data: NewPhotoEvenement[]): Promise<PhotoEvenement[]> {
        return this.database.transaction((tx) => {
            tx.delete(photosEvenement).where(eq(photosEvenement.evenementId, evenementId)).run();
            if (data.length === 0) return [];
            return tx.insert(photosEvenement).values(data).returning().all();
        });
    }
    async deleteByEvenementId(evenementId: number): Promise<number> {
        const rows = await this.database.delete(photosEvenement).where(eq(photosEvenement.evenementId, evenementId)).returning({ id: photosEvenement.id });
        return rows.length;
    }
    async delete(id: number): Promise<boolean> {
        const rows = await this.database.delete(photosEvenement).where(eq(photosEvenement.id, id)).returning({ id: photosEvenement.id });
        return rows.length > 0;
    }
}
