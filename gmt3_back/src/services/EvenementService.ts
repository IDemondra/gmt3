import type { Evenement, NewEvenement } from '../types/index.js';
import type { EvenementRepository } from '../repositories/EvenementRepository.js';

export class EvenementService {
	constructor(private readonly evenementRepo: EvenementRepository) {}

	async getAll(): Promise<Evenement[]> {
		return this.evenementRepo.findAll();
	}

	async getById(id: number): Promise<Evenement | undefined> {
		return this.evenementRepo.findById(id);
	}

	async getByPublicCode(publicCode: string): Promise<Evenement | undefined> {
		return this.evenementRepo.findByPublicCode(publicCode);
	}

	async create(data: NewEvenement): Promise<Evenement> {
		return this.evenementRepo.create(data);
	}

	async update(id: number, data: Partial<Evenement>): Promise<Evenement | undefined> {
		return this.evenementRepo.update(id, data);
	}

	async delete(id: number): Promise<boolean> {
		return this.evenementRepo.delete(id);
	}
}
