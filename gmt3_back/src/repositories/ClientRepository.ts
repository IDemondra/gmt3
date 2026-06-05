import type { IClientRepository } from './interfaces/IClientRepository.js';
import type { Client, NewClient } from '../types/index.js';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { clients } from '../models/schema.js';

export class ClientRepository implements IClientRepository {
	async findAll(): Promise<Client[]> {
		return db.select().from(clients);
	}

	async findById(id: number): Promise<Client | undefined> {
		const rows = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
		return rows[0];
	}

	async create(data: NewClient): Promise<Client> {
		const rows = await db.insert(clients).values(data).returning();
		return rows[0]!;
	}

	async update(id: number, data: Partial<Client>): Promise<Client | undefined> {
		const rows = await db.update(clients).set(data).where(eq(clients.id, id)).returning();
		return rows[0];
	}

	async delete(id: number): Promise<boolean> {
		const rows = await db.delete(clients).where(eq(clients.id, id)).returning({ id: clients.id });
		return rows.length > 0;
	}
}
