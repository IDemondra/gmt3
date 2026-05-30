import type { BunRequest } from '../types/http.js';
import { UserService } from '../services/UserService.js';
import { UserRepository } from '../repositories/UserRepository.js';

const userService = new UserService(new UserRepository());

export const UserController = {
	async getAll(req: BunRequest): Promise<Response> {
		const users = await userService.getAll();
		return Response.json(users);
	},

	async getById(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		}
		const user = await userService.getById(id);
		if (!user) {
			return Response.json({ error: 'UTILISATEUR_INTROUVABLE' }, { status: 404 });
		}
		return Response.json(user);
	},

	async create(req: BunRequest): Promise<Response> {
		const body = await req.json() as {
			nom?: string;
			nomUtilisateur: string;
			motDePasse: string;
			email?: string;
			role?: 'admin' | 'editeur';
		};

		if (!body.nomUtilisateur || !body.motDePasse) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
		}

		try {
			const user = await userService.create(body);
			return Response.json(user, { status: 201 });
		} catch (e) {
			const message = e instanceof Error ? e.message : 'ERREUR_INTERNE';
			if (message === 'CE_NOM_UTILISATEUR_EXISTE_DEJA') {
				return Response.json({ error: message }, { status: 409 });
			}
			throw e;
		}
	},

	async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		}
		const body = await req.json() as Partial<{
			nom: string;
			nomUtilisateur: string;
			motDePasse: string;
			email: string;
			role: 'admin' | 'editeur';
		}>;

		const updated = await userService.update(id, body);
		if (!updated) {
			return Response.json({ error: 'UTILISATEUR_INTROUVABLE' }, { status: 404 });
		}
		return Response.json(updated);
	},

	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return Response.json({ error: 'ID_INVALIDE' }, { status: 400 });
		}
		const deleted = await userService.delete(id);
		if (!deleted) {
			return Response.json({ error: 'UTILISATEUR_INTROUVABLE' }, { status: 404 });
		}
		return Response.json({ success: true });
	},

	async login(req: BunRequest): Promise<Response> {
		const body = await req.json() as { nomUtilisateur: string; motDePasse: string };
		if (!body.nomUtilisateur || !body.motDePasse) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS' }, { status: 400 });
		}
		try {
			const { user, token } = await userService.authenticate(body.nomUtilisateur, body.motDePasse);
			return Response.json({ message: 'OK', user, token });
		} catch (e) {
			return Response.json({ error: 'IDENTIFIANTS_INVALIDES' }, { status: 401 });
		}
	},
};
