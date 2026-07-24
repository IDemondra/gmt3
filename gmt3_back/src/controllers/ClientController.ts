import { ClientService } from '../services/ClientService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
import { ReservationRepository } from '../repositories/ReservationRepository.js';
import type { BunRequest } from '../types/http.js';
import { formatDateFields } from '../utils/date.js';
import { isString } from '../utils/validation.js';
import { errorResponse, idOrError, jsonOrError, notFound } from './helpers.js';

function formatClientDates<T extends { dateAjout?: string | null }>(client: T): T {
	return formatDateFields(client, ['dateAjout']);
}

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const reservationRepository = new ReservationRepository();

const CLIENT_FIELDS = new Set(['nom', 'contact']);
type ClientPayload = { nom?: string; contact?: string };

function parseClientPayload(input: Record<string, unknown>, partial: boolean): ClientPayload | Response {
	if (Object.keys(input).some((key) => !CLIENT_FIELDS.has(key))) return errorResponse('CHAMPS_INVALIDES');
	const nom = input.nom;
	const contact = input.contact;
	
    if (!partial && (!isString(nom, 2, 100) || !isString(contact, 10, 20))) return errorResponse('CHAMPS_OBLIGATOIRES_MANQUANTS', 'Le nom et le contact sont obligatoires');
	
    if (nom !== undefined && !isString(nom, 2, 100)) return errorResponse('CHAMPS_INVALIDES');
	
    if (contact !== undefined && !isString(contact, 10, 20)) return errorResponse('CHAMPS_INVALIDES');

	const normalized: ClientPayload = {
		...(nom !== undefined ? { nom: nom.trim() } : {}),
		...(contact !== undefined ? { contact: contact.replace(/\D/g, '') } : {}),
	};
	if (normalized.contact !== undefined && !/^\d{10}$/.test(normalized.contact)) return errorResponse('CHAMPS_INVALIDES');
	return normalized;
}

export const ClientController = {
    async getAll(req: BunRequest): Promise<Response> {
        const clients = await clientService.getAll();
        return Response.json({
            data: clients.map(formatClientDates),
            message: `${clients.length} client(s) trouvé(s)`
        });
    },

    async getById(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = idOrError(params);
        if (id instanceof Response) 
            return id;
        const client = await clientService.getById(id);
        if (!client) 
            return notFound('CLIENT_INTROUVABLE', 'Client non trouvé');
        return Response.json({ ...formatClientDates(client), message: 'Client chargé avec succès' });
    },

    async create(req: BunRequest): Promise<Response> {
		const input = await jsonOrError(req);
		if (input instanceof Response) return input;
		const body = parseClientPayload(input, false);
		if (body instanceof Response) return body;
		if (await clientRepository.findByContact(body.contact!)) {
			return Response.json({ error: 'CLIENT_DEJA_EXISTANT', message: 'Un client existe déjà avec ce numéro de téléphone' }, { status: 409 });
		}
		const client = await clientService.create({ nom: body.nom!, contact: body.contact!, dateAjout: new Date().toISOString() });
        return Response.json({ ...formatClientDates(client), message: 'Client créé avec succès' }, { status: 201 });
    },

    async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) 
            return id;

		const input = await jsonOrError(req);

		if (input instanceof Response) return input;
		const body = parseClientPayload(input, true);
		if (body instanceof Response) return body;
		if (body.contact) {
			const existing = await clientRepository.findByContact(body.contact);
			if (existing && existing.id !== id) return Response.json({ error: 'CLIENT_DEJA_EXISTANT', message: 'Un client existe déjà avec ce numéro de téléphone' }, { status: 409 });
		}
        const client = await clientService.update(id, body);
        if (!client) return notFound('CLIENT_INTROUVABLE', 'Client non trouvé');
        return Response.json({ ...formatClientDates(client), message: 'Client modifié avec succès' });
    },

    async delete(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = idOrError(params);
        if (id instanceof Response) 
            return id;

        const reservations = await reservationRepository.findByClientId(id);
        if (reservations.length > 0) {
            return Response.json({
                error: 'CLIENT_HAS_RESERVATIONS',
                message: `Ce client a ${reservations.length} réservation(s). Supprimez d'abord les réservations associées.`
            }, { status: 409 });
        }

        const ok = await clientService.delete(id);
        if (!ok) return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client non trouvé' }, { status: 404 });
        return Response.json({ success: true, message: 'Client supprimé avec succès' });
    },
};
