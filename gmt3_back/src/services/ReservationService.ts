import type { IRepository } from '../repositories/interfaces/IRepository.js';
import type { NewReservation, Reservation } from '../types/index.js';

export class ReservationService {
	constructor(private readonly reservationRepo: IRepository<Reservation, NewReservation>) {}

	async getAll(): Promise<Reservation[]> {
		return this.reservationRepo.findAll();
	}

	async getById(id: number): Promise<Reservation | undefined> {
		return this.reservationRepo.findById(id);
	}

	async create(data: NewReservation): Promise<Reservation> {
		return this.reservationRepo.create(data);
	}

	async update(id: number, data: Partial<Reservation>): Promise<Reservation | undefined> {
		return this.reservationRepo.update(id, data);
	}

	async delete(id: number): Promise<boolean> {
		return this.reservationRepo.delete(id);
	}
}
