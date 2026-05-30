import { ClientService } from '../services/ClientService.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
import type { BunRequest } from '../types/http.js';
import type { Client } from '../types/index.js';

const clientService = new ClientService(new ClientRepository());

export const ClientController = {
    async getAll(req: BunRequest): Promise<Response> {
        const clients = await clientService.getAll();
        return Response.json(clients);
    },

    async getById(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = Number(params.id);
        if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
        const client = await clientService.getById(id);
        if (!client) return Response.json({ error: 'CLIENT_INTROUVABLE' }, { status: 404 });
        return Response.json(client);
    },

    async create(req: BunRequest): Promise<Response> {
        const body = await req.json() as { nom: string; contact: string };
        if (!body.nom || !body.contact) {
            return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
        }
        const client = await clientService.create(body);
        return Response.json(client, { status: 201 });
    },

    async update(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = Number(params.id);
        if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
        const body = await req.json() as Partial<Client>;
        const client = await clientService.update(id, body);
        if (!client) return Response.json({ error: 'CLIENT_INTROUVABLE' }, { status: 404 });
        return Response.json(client);
    },

    async delete(req: BunRequest, params: { id: string }): Promise<Response> {
        const id = Number(params.id);
        if (Number.isNaN(id)) return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
        const ok = await clientService.delete(id);
        if (!ok) return Response.json({ error: 'CLIENT_INTROUVABLE' }, { status: 404 });
        return Response.json({ success: true });
    },
};
