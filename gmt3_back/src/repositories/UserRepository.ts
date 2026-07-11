import { eq, sql } from 'drizzle-orm';
import { db } from '../config/database.js';
import { utilisateurs } from '../models/schema.js';
import type { IUserRepository } from './interfaces/IUserRepository.js';
import type { Utilisateur } from '../types/index.js';

export class UserRepository implements IUserRepository {
	async findAll(): Promise<Utilisateur[]> {
		return db.select().from(utilisateurs);
	}

	async findById(id: number): Promise<Utilisateur | undefined> {
		const rows = await db.select().from(utilisateurs).where(eq(utilisateurs.id, id)).limit(1);
		return rows[0];
	}

	async findByNomUtilisateur(nomUtilisateur: string): Promise<Utilisateur | undefined> {
		const rows = await db.select().from(utilisateurs).where(eq(utilisateurs.nomUtilisateur, nomUtilisateur)).limit(1);
		return rows[0];
	}

	async create(data: Omit<Utilisateur, 'id' | 'dateCreation'>): Promise<Utilisateur> {
		const rows = await db.insert(utilisateurs).values(data).returning();
		return rows[0]!;
	}

	async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur | undefined> {
		const rows = await db.update(utilisateurs).set(data).where(eq(utilisateurs.id, id)).returning();
		return rows[0];
	}

	async delete(id: number): Promise<boolean> {
		const rows = await db.delete(utilisateurs).where(eq(utilisateurs.id, id)).returning({ id: utilisateurs.id });
		return rows.length > 0;
	}

	async countAdmins(): Promise<number> {
		const rows = await db.select({ value: sql<number>`count(*)` }).from(utilisateurs).where(eq(utilisateurs.role, 'admin'));
		return Number(rows[0]?.value ?? 0);
	}
}
