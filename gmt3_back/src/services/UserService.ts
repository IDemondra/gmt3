import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import { eq, lt } from 'drizzle-orm';
import { db } from '../config/database.js';
import { refreshTokens } from '../models/schema.js';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import type { Utilisateur } from '../types/index.js';
import '../config/env.js';

const JWT_SECRET = Bun.env.JWT_SECRET;
const JWT_REFRESH_SECRET = Bun.env.JWT_REFRESH_SECRET;
if (!JWT_SECRET || !JWT_REFRESH_SECRET) throw new Error('JWT_SECRET and JWT_REFRESH_SECRET env vars are required');
const _JWT_SECRET: string = JWT_SECRET;
const _JWT_REFRESH_SECRET: string = JWT_REFRESH_SECRET;

const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

function nowSeconds(): number {
	return Math.floor(Date.now() / 1000);
}

export class UserService {
	constructor(private readonly userRepo: IUserRepository) {}

	async getAll(): Promise<Utilisateur[]> {
		return this.userRepo.findAll();
	}

	async getById(id: number): Promise<Utilisateur | undefined> {
		return this.userRepo.findById(id);
	}

	async create(data: { nom?: string | null; nomUtilisateur: string; motDePasse: string; email?: string | null; role?: 'admin' | 'editeur' | null }): Promise<Utilisateur> {
		const existing = await this.userRepo.findByNomUtilisateur(data.nomUtilisateur);
		if (existing) {
			throw new Error('CE_NOM_UTILISATEUR_EXISTE_DEJA');
		}
		const salt = await bcrypt.genSalt(12);
		const hashed = await bcrypt.hash(data.motDePasse, salt);
		return this.userRepo.create({ nom: data.nom ?? null, nomUtilisateur: data.nomUtilisateur, motDePasse: hashed, email: data.email ?? null, role: data.role ?? 'editeur', actif: true, derniereConnexion: null });
	}

	async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur | undefined> {
		if (data.motDePasse) {
			const salt = await bcrypt.genSalt(12);
			data.motDePasse = await bcrypt.hash(data.motDePasse, salt);
		}
		return this.userRepo.update(id, data);
	}

	async countAdmins(): Promise<number> {
		return this.userRepo.countAdmins();
	}

	async delete(id: number): Promise<boolean> {
		return this.userRepo.delete(id);
	}

	async authenticate(nomUtilisateur: string, motDePasse: string): Promise<{ user: Omit<Utilisateur, 'motDePasse'>; accessToken: string; refreshToken: string }> {
		const user = await this.userRepo.findByNomUtilisateur(nomUtilisateur);
		if (!user) throw new Error('IDENTIFIANTS_INVALIDES');
		if (!user.actif) throw new Error('COMPTE_DESACTIVE');

		const match = await bcrypt.compare(motDePasse, user.motDePasse);
		if (!match) throw new Error('IDENTIFIANTS_INVALIDES');
		await this.userRepo.update(user.id, { derniereConnexion: new Date().toISOString() });

		const payload = { id: user.id, nomUtilisateur: user.nomUtilisateur, role: user.role };
		const accessToken = jwt.sign(payload, _JWT_SECRET, { expiresIn: '15m' });
		const refreshToken = jwt.sign(payload, _JWT_REFRESH_SECRET, { expiresIn: '7d' });

		// Purge expired tokens for this user then store new one
		await db.delete(refreshTokens).where(lt(refreshTokens.expiresAt, nowSeconds()));
		await db.insert(refreshTokens).values({
			tokenHash: hashToken(refreshToken),
			utilisateurId: user.id,
			expiresAt: nowSeconds() + REFRESH_TTL_SECONDS,
		});

		const { motDePasse: _, ...safeUser } = user;
		return { user: safeUser, accessToken, refreshToken };
	}

	async refreshToken(token: string): Promise<{ user: Omit<Utilisateur, 'motDePasse'>; accessToken: string; newRefreshToken: string } | null> {
		try {
			const decoded = jwt.verify(token, _JWT_REFRESH_SECRET) as { id: number; nomUtilisateur: string; role: string };

			// Verify token exists in DB (rotation check)
			const hash = hashToken(token);
			const [stored] = await db.select().from(refreshTokens).where(eq(refreshTokens.tokenHash, hash)).limit(1);
			if (!stored || stored.expiresAt < nowSeconds()) return null;

			// Invalidate old token immediately
			await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, hash));

			const user = await this.userRepo.findById(decoded.id);
			if (!user || !user.actif) return null;

			// Issue new tokens
			const payload = { id: user.id, nomUtilisateur: user.nomUtilisateur, role: user.role };
			const accessToken = jwt.sign(payload, _JWT_SECRET, { expiresIn: '15m' });
			const newRefreshToken = jwt.sign(payload, _JWT_REFRESH_SECRET, { expiresIn: '7d' });

			await db.insert(refreshTokens).values({
				tokenHash: hashToken(newRefreshToken),
				utilisateurId: decoded.id,
				expiresAt: nowSeconds() + REFRESH_TTL_SECONDS,
			});

			const { motDePasse: _, ...safeUser } = user;
			return { user: safeUser, accessToken, newRefreshToken };
		} catch {
			return null;
		}
	}

	async revokeRefreshToken(token: string): Promise<void> {
		await db.delete(refreshTokens).where(eq(refreshTokens.tokenHash, hashToken(token)));
	}
}
