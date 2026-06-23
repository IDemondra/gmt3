import type { Avis, NewAvis } from '../types/index.js';
import type { AvisRepository } from '../repositories/AvisRepository.js';

export class AvisService {
	constructor(private readonly avisRepo: AvisRepository) {}

	async getAll(): Promise<Avis[]> {
		return this.avisRepo.findAll();
	}

	async getApprovedByEvenement(evenementId: number): Promise<Avis[]> {
		return this.avisRepo.findApprovedByEvenementId(evenementId);
	}

	async getAllApproved(): Promise<Avis[]> {
		return this.avisRepo.findAllApproved();
	}

	async create(data: NewAvis): Promise<Avis> {
		return this.avisRepo.create(data);
	}

	async approve(id: number): Promise<Avis | undefined> {
		return this.avisRepo.update(id, { estApprouve: true });
	}

	async delete(id: number): Promise<boolean> {
		return this.avisRepo.delete(id);
	}
}
