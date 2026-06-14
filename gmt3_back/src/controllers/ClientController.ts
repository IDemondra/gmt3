import { ClientService } from '../services/ClientService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Client } from '../types/index.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';

function formatClientDates<T extends { dateAjout?: string | null }>(client: T): T {
	return {
		...client,
		dateAjout: formatDateToDDMMYYYY(client.dateAjout),
	};
}

const clientService = new ClientService(new ClientRepository());

export const ClientController = {
    async getAll(req: BunRequest): Promise<Response> {
        const clients = await clientService.getAll();
        return Response.json({
            data: clients.map(formatClientDates),
            message: `${clients.length} client(s) trouvé(s)`
        });
    },

    async getById(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = Number(params.id);
        if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
        const client = await clientService.getById(id);
        if (!client) return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client non trouvé' }, { status: 404 });
        return Response.json({ ...formatClientDates(client), message: 'Client chargé avec succès' });
    },

    async create(req: BunRequest): Promise<Response> {
        const body = await req.json() as { nom: string; contact: string };
        if (!body.nom || !body.contact) {
            return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS', message: 'Le nom et le contact sont obligatoires' }, { status: 400 });
        }
        const client = await clientService.create({ ...body, dateAjout: new Date().toISOString() });
        return Response.json({ ...formatClientDates(client), message: 'Client créé avec succès' }, { status: 201 });
    },

    async update(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = Number(params.id);
        if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
        const body = await req.json() as Partial<Client>;
        const client = await clientService.update(id, body);
        if (!client) return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client non trouvé' }, { status: 404 });
        return Response.json({ ...formatClientDates(client), message: 'Client modifié avec succès' });
    },

    async delete(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = Number(params.id);
        if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
        const ok = await clientService.delete(id);
        if (!ok) return Response.json({ error: 'CLIENT_INTROUVABLE', message: 'Client non trouvé' }, { status: 404 });
        return Response.json({ success: true, message: 'Client supprimé avec succès' });
    },
};
