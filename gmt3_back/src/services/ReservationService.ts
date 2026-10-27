import type { ReservationRepository } from '../repositories/ReservationRepository.js';
import type { NewReservation, Reservation } from '../types/index.js';

export class ReservationService {
	constructor(private readonly reservationRepo: ReservationRepository) {}

	async getAll(): Promise<Reservation[]> {
		return this.reservationRepo.findAll();
	}

	async getById(id: number): Promise<Reservation | undefined> {
		return this.reservationRepo.findById(id);
	}

	async getReservedPlaces(evenementId: number, excludeReservationId?: number): Promise<number> {
		return this.reservationRepo.getReservedPlaces(evenementId, excludeReservationId);
	}

	async reservePlaces(
		evenementId: number,
		nombrePlaces: number,
		data: NewReservation,
		excludeReservationId?: number,
	): Promise<Reservation> {
		return this.reservationRepo.reservePlaces(evenementId, nombrePlaces, data, excludeReservationId);
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
