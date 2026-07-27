import { db } from '../config/database.js';
import { avis, evenements, reservations } from '../models/schema.js';
import { count, eq, sql } from 'drizzle-orm';

export interface KpiData {
	totalEvents: number;
	totalReservations: number;
	limitedEvents: number;
	pendingReservations: number;
	pendingAvis: number;
}

	export class KpiRepository {
		async getKpis(): Promise<KpiData> {
			const totalEventsRow = await db
				.select({ value: count() })
				.from(evenements)
				.where(eq(evenements.estPublie, true));

			const totalReservationsRow = await db
				.select({ value: count() })
				.from(reservations);

			const limitedEventsRow = await db
				.select({ value: count(sql`DISTINCT ${reservations.evenementId}`) })
				.from(reservations);

			const pendingReservationsRow = await db
				.select({ value: count() })
				.from(reservations)
				.where(eq(reservations.statut, 'en_attente'));

			const pendingAvisRow = await db
				.select({ value: count() })
				.from(avis)
				.where(eq(avis.estApprouve, false));

			return {
				totalEvents: totalEventsRow[0]?.value ?? 0,
				totalReservations: totalReservationsRow[0]?.value ?? 0,
				limitedEvents: limitedEventsRow[0]?.value ?? 0,
				pendingReservations: pendingReservationsRow[0]?.value ?? 0,
				pendingAvis: pendingAvisRow[0]?.value ?? 0,
			};
		}
	}
