import type { Utilisateur } from '../../types/index.js';

export interface IUserRepository {
	findAll(): Promise<Utilisateur[]>;
	findById(id: number): Promise<Utilisateur | undefined>;
	findByNomUtilisateur(nomUtilisateur: string): Promise<Utilisateur | undefined>;
	create(data: Omit<Utilisateur, 'id' | 'dateCreation'>): Promise<Utilisateur>;
	update(id: number, data: Partial<Utilisateur>): Promise<Utilisateur | undefined>;
	delete(id: number): Promise<boolean>;
	countAdmins(): Promise<number>;
}
