import type { IRepository } from './interfaces/IRepository.js';
import type { Reservation, NewReservation } from '../types/index.js';
import { and, eq, ne, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { evenements, reservations } from '../models/schema.js';
import { parseCalendarDate } from '../utils/date.js';

export class ReservationRepository implements IRepository<Reservation, NewReservation> {
    constructor(private readonly database: typeof db = db) {}

    async findAll(): Promise<Reservation[]> {
        return this.database.select().from(reservations);
    }
    async findById(id: number): Promise<Reservation | undefined> {
        const rows = await this.database.select().from(reservations).where(eq(reservations.id, id)).limit(1);
        return rows[0];
    }
    async findByClientId(clientId: number): Promise<Reservation[]> {
        return this.database.select().from(reservations).where(eq(reservations.clientId, clientId));
    }
    async getReservedPlaces(evenementId: number, excludeReservationId?: number): Promise<number> {
        const conditions = [eq(reservations.evenementId, evenementId), ne(reservations.statut, 'annulee')];
        if (excludeReservationId) conditions.push(ne(reservations.id, excludeReservationId));
        const rows = await this.database
            .select({ value: sql<number>`coalesce(sum(${reservations.nombrePlaces}), 0)` })
            .from(reservations)
            .where(and(...conditions));
        return Number(rows[0]?.value ?? 0);
    }
    async create(data: NewReservation): Promise<Reservation> {
        const rows = await this.database.insert(reservations).values(data).returning();
        return rows[0]!;
    }
    async update(id: number, data: Partial<Reservation>): Promise<Reservation | undefined> {
        const rows = await this.database.update(reservations).set(data).where(eq(reservations.id, id)).returning();
        return rows[0];
    }
    async delete(id: number): Promise<boolean> {
        const rows = await this.database.delete(reservations).where(eq(reservations.id, id)).returning({ id: reservations.id });
        return rows.length > 0;
    }

    async reservePlaces(
        evenementId: number,
        nombrePlaces: number,
        data: NewReservation,
        excludeReservationId?: number,
    ): Promise<Reservation> {
        return this.database.transaction((tx) => {
            const event = tx
                .select()
                .from(evenements)
                .where(eq(evenements.id, evenementId))
                .get();

            if (!event) throw new Error('EVENEMENT_INTROUVABLE');
            if (
                !event.estPublie ||
                parseCalendarDate(event.dateDepart || event.dateEvenement) < new Date()
            ) {
                throw new Error('EVENEMENT_INDISPONIBLE');
            }

            if (event.capaciteMax != null) {
                const conditions = [
                    eq(reservations.evenementId, evenementId),
                    ne(reservations.statut, 'annulee'),
                ];
                if (excludeReservationId) {
                    conditions.push(ne(reservations.id, excludeReservationId));
                }

                const reserved = tx
                    .select({ value: sql<number>`coalesce(sum(${reservations.nombrePlaces}), 0)` })
                    .from(reservations)
                    .where(and(...conditions))
                    .get();

                const reservedPlaces = Number(reserved?.value ?? 0);
                if (reservedPlaces + nombrePlaces > event.capaciteMax) {
                    throw new Error('CAPACITE_INSUFFISANTE');
                }
            }

            const rows = tx.insert(reservations).values(data).returning().all();
            return rows[0]!;
        }, { behavior: 'immediate' });
    }
}
