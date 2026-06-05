import type { IRepository } from './interfaces/IRepository.js';
import type { Reservation, NewReservation } from '../types/index.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { reservations } from '../models/schema.js';

export class ReservationRepository implements IRepository<Reservation, NewReservation> {
    async findAll(): Promise<Reservation[]> {
        return db.select().from(reservations);
    }
    async findById(id: number): Promise<Reservation | undefined> {
        const rows = await db.select().from(reservations).where(eq(reservations.id, id)).limit(1);
        return rows[0];
    }
    async create(data: NewReservation): Promise<Reservation> {
        const rows = await db.insert(reservations).values(data).returning();
        return rows[0]!;
    }
    async update(id: number, data: Partial<Reservation>): Promise<Reservation | undefined> {
        const rows = await db.update(reservations).set(data).where(eq(reservations.id, id)).returning();
        return rows[0];
    }
    async delete(id: number): Promise<boolean> {
        const rows = await db.delete(reservations).where(eq(reservations.id, id)).returning({ id: reservations.id });
        return rows.length > 0;
    }
}
