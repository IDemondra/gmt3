import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IUserRepository } from '../repositories/interfaces/IUserRepository.js';
import type { Utilisateur } from '../types/index.js';

const JWT_SECRET = Bun.env.JWT_SECRET || 'gmt3-secret-change-in-production';
const JWT_REFRESH_SECRET = Bun.env.JWT_REFRESH_SECRET || 'gmt3-refresh-secret-change-in-production';

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
		return this.userRepo.create({ nom: data.nom ?? null, nomUtilisateur: data.nomUtilisateur, motDePasse: hashed, email: data.email ?? null, role: data.role ?? 'editeur' });
	}

	async update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur | undefined> {
		if (data.motDePasse) {
			const salt = await bcrypt.genSalt(12);
			data.motDePasse = await bcrypt.hash(data.motDePasse, salt);
		}
		return this.userRepo.update(id, data);
	}

	async delete(id: number): Promise<boolean> {
		return this.userRepo.delete(id);
	}

	async authenticate(nomUtilisateur: string, motDePasse: string): Promise<{ user: Omit<Utilisateur, 'motDePasse'>; accessToken: string; refreshToken: string }> {
		const user = await this.userRepo.findByNomUtilisateur(nomUtilisateur);
		if (!user) {
			throw new Error('IDENTIFIANTS_INVALIDES');
		}
		const match = await bcrypt.compare(motDePasse, user.motDePasse);
		if (!match) {
			throw new Error('IDENTIFIANTS_INVALIDES');
		}
		const payload = { id: user.id, nomUtilisateur: user.nomUtilisateur, role: user.role };
		const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
		const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
		const { motDePasse: _, ...safeUser } = user;
		return { user: safeUser, accessToken, refreshToken };
	}

	async refreshToken(token: string): Promise<{ user: Omit<Utilisateur, 'motDePasse'>; accessToken: string } | null> {
		try {
			const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: number; nomUtilisateur: string; role: string };
			const user = await this.userRepo.findById(decoded.id);
			if (!user) return null;
			const accessToken = jwt.sign(
				{ id: decoded.id, nomUtilisateur: decoded.nomUtilisateur, role: decoded.role },
				JWT_SECRET,
				{ expiresIn: '15m' },
			);
			const { motDePasse: _, ...safeUser } = user;
			return { user: safeUser, accessToken };
		} catch {
			return null;
		}
	}
}
