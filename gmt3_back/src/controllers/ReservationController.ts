import { ReservationRepository } from '../repositories/ReservationRepository.js';
import { ReservationService } from '../services/ReservationService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
import { EvenementRepository } from '../repositories/EvenementRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Reservation } from '../types/index.js';
import { formatDateFields, parseCalendarDate } from '../utils/date.js';
import { isString, toPositiveInteger } from '../utils/validation.js';
import { idOrError, jsonOrError, notFound } from './helpers.js';

type ReservationBody = {
	clientId?: number;
	evenementId?: number;
	nombrePlaces?: number;
	dateReservation?: string;
	statut?: 'en_attente' | 'confirmee' | 'annulee';
	nom?: string;
	contact?: string;
};

function formatReservationDates<T extends { dateReservation?: string | null }>(reservation: T): T {
	return formatDateFields(reservation, ['dateReservation']);
}

const reservationService = new ReservationService(new ReservationRepository());
const clientRepository = new ClientRepository();
const evenementRepository = new EvenementRepository();

async function validateAvailability(evenementId: number, nombrePlaces: number, excludeReservationId?: number): Promise<string | null> {
	const evenement = await evenementRepository.findById(evenementId);
	if (!evenement) return 'EVENEMENT_INTROUVABLE';
	if (!evenement.estPublie || parseCalendarDate(evenement.dateDepart || evenement.dateEvenement) < new Date()) return 'EVENEMENT_INDISPONIBLE';
	if (evenement.capaciteMax !== null && evenement.capaciteMax !== undefined) {
		const reserved = await reservationService.getReservedPlaces(evenementId, excludeReservationId);
		if (reserved + nombrePlaces > evenement.capaciteMax) return 'CAPACITE_INSUFFISANTE';
	}
	return null;
}

function availabilityMessage(error: string): string {
	if (error === 'CAPACITE_INSUFFISANTE') return 'Capacité maximale atteinte pour cet événement';
	if (error === 'EVENEMENT_INDISPONIBLE') return 'Les inscriptions sont closes pour cet événement';
	return error;
}

export const ReservationController = {
	async getAll(req: BunRequest): Promise<Response> {
		const reservations = await reservationService.getAll();
		return Response.json({
			data: reservations.map(formatReservationDates),
			message: `${reservations.length} réservation(s) trouvée(s)`
		});
	},

	async getById(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const reservation = await reservationService.getById(id);
		if (!reservation) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });

		return Response.json(formatReservationDates(reservation));
	},

	async create(req: BunRequest): Promise<Response> {
		const input = await jsonOrError(req);
		if (input instanceof Response) return input;
		const body = input as ReservationBody;
		if (Object.keys(body).some((field) => !['clientId', 'evenementId', 'nombrePlaces', 'dateReservation', 'statut', 'nom', 'contact'].includes(field))) return Response.json({ error: 'CHAMPS_INVALIDES' }, { status: 400 });
		if (body.nom !== undefined && !isString(body.nom, 2, 100)) return Response.json({ error: 'NOM_INVALIDE' }, { status: 400 });
		if (body.contact !== undefined && !isString(body.contact, 10, 20)) return Response.json({ error: 'CONTACT_INVALIDE' }, { status: 400 });
		const evenementId = toPositiveInteger(body.evenementId);
		const nombrePlaces = body.nombrePlaces === undefined ? 1 : toPositiveInteger(body.nombrePlaces);

		if (!evenementId || !nombrePlaces) {
			return Response.json({
				error: 'CHAMPS_OBLIGATOIRES_MANQUANTS',
				message: 'Veuillez remplir tous les champs obligatoires'
			}, { status: 400 });
		}
		const availabilityError = await validateAvailability(evenementId, nombrePlaces);
		if (availabilityError) return Response.json({ error: availabilityError, message: availabilityMessage(availabilityError) }, { status: availabilityError === 'EVENEMENT_INTROUVABLE' ? 404 : 409 });

		let clientId = req.user ? toPositiveInteger(body.clientId) : null;
		if (clientId && !(await clientRepository.findById(clientId))) {
			return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client introuvable' }, { status: 404 });
		}

		// Si clientId n'est pas fourni, créer ou récupérer un client avec nom et contact
		if (!clientId) {
			const contact = body.contact?.replace(/\D/g, '');
			if (!body.nom || !contact) {
				return Response.json({
					error: 'CHAMPS_OBLIGATOIRES_MANQUANTS',
					message: 'Le nom et le contact sont obligatoires'
				}, { status: 400 });
			}
			const existingClient = await clientRepository.findByContact(contact);
			if (existingClient) {
				clientId = existingClient.id;
			} else {
				const newClient = await clientRepository.create({ nom: body.nom.trim(), contact });
				clientId = newClient.id;
			}
		}

		const reservation = await reservationService.create({
			clientId,
			evenementId,
			nombrePlaces,
			statut: req.user ? body.statut ?? 'confirmee' : 'en_attente',
			dateReservation: req.user ? body.dateReservation || new Date().toISOString() : new Date().toISOString(),
		});

		return Response.json({
			...formatReservationDates(reservation),
			message: 'Réservation confirmée avec succès !'
		}, { status: 201 });
	},

	async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const input = await jsonOrError(req);
		if (input instanceof Response) return input;
		const body = input as ReservationBody;
		const allowedFields = new Set(['nombrePlaces', 'statut']);
		if (Object.keys(body).some((field) => !allowedFields.has(field))) {
			return Response.json({ error: 'CLIENT_ET_EVENEMENT_NON_MODIFIABLES', 
				message: 'Client et événement ne sont pas modifiables' }, { status: 400 });
		}
		const data: Partial<Reservation> = {};

		if (body.nombrePlaces !== undefined) {
			const nombrePlaces = toPositiveInteger(body.nombrePlaces);
			if (!nombrePlaces) return Response.json({ error: 'NOMBRE_PLACES_INVALIDE' }, { status: 400 });
			data.nombrePlaces = nombrePlaces;
		}

		if (body.statut !== undefined && !['en_attente', 'confirmee', 'annulee'].includes(body.statut)) 
			return Response.json({ error: 'STATUT_INVALIDE' }, { status: 400 });

		if (body.statut !== undefined) data.statut = body.statut;

		const current = await reservationService.getById(id);
		if (!current) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });
		const targetEventId = current.evenementId;
		const targetPlaces = data.nombrePlaces ?? current.nombrePlaces;
		if (targetEventId && targetPlaces && data.statut !== 'annulee') {
			const availabilityError = await validateAvailability(targetEventId, targetPlaces, id);
			if (availabilityError) return Response.json({ error: availabilityError, message: availabilityMessage(availabilityError) }, { status: 409 });
		}
		const reservation = await reservationService.update(id, data);
		if (!reservation) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });

		return Response.json(formatReservationDates(reservation));
	},

	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;

		const ok = await reservationService.delete(id);
		if (!ok) return Response.json({ error: 'RESERVATION_INTROUVABLE' }, { status: 404 });

		return Response.json({ success: true });
	},
};
