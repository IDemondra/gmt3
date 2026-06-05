import type { IRepository } from '../repositories/interfaces/IRepository.js';
import type { Evenement, NewEvenement } from '../types/index.js';

export class EvenementService {
	constructor(private readonly evenementRepo: IRepository<Evenement, NewEvenement>) {}

	async getAll(): Promise<Evenement[]> {
		return this.evenementRepo.findAll();
	}

	async getById(id: number): Promise<Evenement | undefined> {
		return this.evenementRepo.findById(id);
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
