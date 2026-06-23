import { ReservationRepository } from '../repositories/ReservationRepository.js';
import { ReservationService } from '../services/ReservationService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Reservation } from '../types/index.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';

type ReservationBody = {
	clientId?: number;
	evenementId?: number;
	nombrePlaces?: number;
	dateReservation?: string;
	nom?: string;
	contact?: string;
};

function formatReservationDates<T extends { dateReservation?: string | null }>(reservation: T): T {
	return {
		...reservation,
		dateReservation: formatDateToDDMMYYYY(reservation.dateReservation),
	};
}

function toPositiveInteger(value: unknown): number | null {
	const numericValue = Number(value);
	return Number.isInteger(numericValue) && numericValue > 0 ? numericValue : null;
}

const reservationService = new ReservationService(new ReservationRepository());
const clientRepository = new ClientRepository();

export const ReservationController = {
	async getAll(req: BunRequest): Promise<Response> {
		const reservations = await reservationService.getAll();
		return Response.json({
			data: reservations.map(formatReservationDates),
			message: `${reservations.length} réservation(s) trouvée(s)`
		});
	},

	async getById(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const reservation = await reservationService.getById(id);
		if (!reservation) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });

		return Response.json(formatReservationDates(reservation));
	},

	async create(req: BunRequest): Promise<Response> {
		const body = await req.json() as ReservationBody;
		const evenementId = toPositiveInteger(body.evenementId);
		const nombrePlaces = body.nombrePlaces === undefined ? 1 : toPositiveInteger(body.nombrePlaces);

		if (!evenementId || !nombrePlaces) {
			return Response.json({
				error: 'CHAMPS_OBLIGATOIRES_MANQUANTS',
				message: 'Veuillez remplir tous les champs obligatoires'
			}, { status: 400 });
		}

		let clientId = toPositiveInteger(body.clientId);

		// Si clientId n'est pas fourni, créer ou récupérer un client avec nom et contact
		if (!clientId) {
			if (!body.nom || !body.contact) {
				return Response.json({
					error: 'CHAMPS_OBLIGATOIRES_MANQUANTS',
					message: 'Le nom et le contact sont obligatoires'
				}, { status: 400 });
			}
			const existingClient = await clientRepository.findByContact(body.contact);
			if (existingClient) {
				clientId = existingClient.id;
			} else {
				const newClient = await clientRepository.create({ nom: body.nom, contact: body.contact });
				clientId = newClient.id;
			}
		}

		const reservation = await reservationService.create({
			clientId,
			evenementId,
			nombrePlaces,
			dateReservation: body.dateReservation || new Date().toISOString(),
		});

		return Response.json({
			...formatReservationDates(reservation),
			message: 'Réservation confirmée avec succès !'
		}, { status: 201 });
	},

	async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const body = await req.json() as ReservationBody;
		const data: Partial<Reservation> = {};

		if (body.clientId !== undefined) {
			const clientId = toPositiveInteger(body.clientId);
			if (!clientId) return Response.json({ error: 'CLIENT_ID_INVALIDE' }, { status: 400 });
			data.clientId = clientId;
		}

		if (body.evenementId !== undefined) {
			const evenementId = toPositiveInteger(body.evenementId);
			if (!evenementId) return Response.json({ error: 'EVENEMENT_ID_INVALIDE' }, { status: 400 });
			data.evenementId = evenementId;
		}

		if (body.nombrePlaces !== undefined) {
			const nombrePlaces = toPositiveInteger(body.nombrePlaces);
			if (!nombrePlaces) return Response.json({ error: 'NOMBRE_PLACES_INVALIDE' }, { status: 400 });
			data.nombrePlaces = nombrePlaces;
		}

		if (body.dateReservation !== undefined) {
			data.dateReservation = body.dateReservation || new Date().toISOString();
		}

		const reservation = await reservationService.update(id, data);
		if (!reservation) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });

		return Response.json(formatReservationDates(reservation));
	},

	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });

		const ok = await reservationService.delete(id);
		if (!ok) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });

		return Response.json({ success: true });
	},
};
