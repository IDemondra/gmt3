import { db } from '../config/database.js';
import { evenements, reservations } from '../models/schema.js';
import { count, eq, sql } from 'drizzle-orm';

export interface KpiData {
	totalEvents: number;
	totalReservations: number;
	limitedEvents: number;
}

export class KpiRepository {
	async getKpis(): Promise<KpiData> {
		const [{ value: totalEvents }] = await db
			.select({ value: count() })
			.from(evenements)
			.where(eq(evenements.estPublie, true));

		const [{ value: totalReservations }] = await db
			.select({ value: count() })
			.from(reservations);

		const [{ value: limitedEvents }] = await db
			.select({ value: count(sql`DISTINCT ${reservations.evenementId}`) })
			.from(reservations);

		return {
			totalEvents: totalEvents ?? 0,
			totalReservations: totalReservations ?? 0,
			limitedEvents: limitedEvents ?? 0,
		};
	}
}
