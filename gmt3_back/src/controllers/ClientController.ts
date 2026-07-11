import { ClientService } from '../services/ClientService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
import { ReservationRepository } from '../repositories/ReservationRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Client } from '../types/index.js';
import { formatDateFields } from '../utils/date.js';
import { parseId } from '../utils/validation.js';

function formatClientDates<T extends { dateAjout?: string | null }>(client: T): T {
	return formatDateFields(client, ['dateAjout']);
}

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);
const reservationRepository = new ReservationRepository();

function validClient(body: Partial<Client>): boolean {
	return (!('nom' in body) || typeof body.nom === 'string' && body.nom.trim().length >= 2 && body.nom.length <= 100)
		&& (!('contact' in body) || typeof body.contact === 'string' && /^\d{10}$/.test(body.contact));
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
        const id = parseId(params.id);
        if (!id) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
        const client = await clientService.getById(id);
        if (!client) return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client non trouvé' }, { status: 404 });
        return Response.json({ ...formatClientDates(client), message: 'Client chargé avec succès' });
    },

    async create(req: BunRequest): Promise<Response> {
        const body = await req.json() as { nom: string; contact: string };
		body.nom = body.nom?.trim();
		body.contact = body.contact?.replace(/\D/g, '');
        if (!body.nom || !body.contact || !validClient(body)) {
            return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS', message: 'Le nom et le contact sont obligatoires' }, { status: 400 });
        }
		if (await clientRepository.findByContact(body.contact)) {
			return Response.json({ error: 'CLIENT_DEJA_EXISTANT', message: 'Un client existe déjà avec ce numéro de téléphone' }, { status: 409 });
		}
        const client = await clientService.create({ ...body, dateAjout: new Date().toISOString() });
        return Response.json({ ...formatClientDates(client), message: 'Client créé avec succès' }, { status: 201 });
    },

    async update(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = parseId(params.id);
        if (!id) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
        const body = await req.json() as Partial<Client>;
		if (body.nom) body.nom = body.nom.trim();
		if (body.contact) body.contact = body.contact.replace(/\D/g, '');
		if (!validClient(body) || Object.keys(body).some((key) => !['nom', 'contact'].includes(key))) return Response.json({ error: 'CHAMPS_INVALIDES' }, { status: 400 });
		if (body.contact) {
			const existing = await clientRepository.findByContact(body.contact);
			if (existing && existing.id !== id) return Response.json({ error: 'CLIENT_DEJA_EXISTANT', message: 'Un client existe déjà avec ce numéro de téléphone' }, { status: 409 });
		}
        const client = await clientService.update(id, body);
        if (!client) return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client non trouvé' }, { status: 404 });
        return Response.json({ ...formatClientDates(client), message: 'Client modifié avec succès' });
    },

    async delete(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = parseId(params.id);
        if (!id) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });

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
