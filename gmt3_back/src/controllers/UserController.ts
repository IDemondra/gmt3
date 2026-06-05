import type { BunRequest } from '../types/http.js';
import { UserService } from '../services/UserService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import type { Utilisateur } from '../types/index.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';

const userService = new UserService(new UserRepository());

const SET_COOKIE_OPTS = 'HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=604800';

function formatUserDates<T extends { dateCreation?: string | null }>(user: T): T {
	return {
		...user,
		dateCreation: formatDateToDDMMYYYY(user.dateCreation),
	};
}

export const UserController = {
	async getAll(req: BunRequest): Promise<Response> {
		const users = await userService.getAll();
		return Response.json(users.map(formatUserDates));
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
		return Response.json(formatUserDates(user));
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
			return Response.json(formatUserDates(user), { status: 201 });
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
		return Response.json(formatUserDates(updated));
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
			const { user, accessToken, refreshToken } = await userService.authenticate(body.nomUtilisateur, body.motDePasse);
			return new Response(JSON.stringify({ message: 'OK', user: formatUserDates(user), accessToken }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Set-Cookie': `refreshToken=${refreshToken}; ${SET_COOKIE_OPTS}`,
				},
			});
		} catch (e) {
			return Response.json({ error: 'IDENTIFIANTS_INVALIDES' }, { status: 401 });
		}
	},

	async refresh(req: BunRequest): Promise<Response> {
		const cookie = req.headers.get('Cookie') || '';
		const match = cookie.match(/refreshToken=([^;]+)/);
		const token = match ? decodeURIComponent(match[1]!) : null;
		if (!token) {
			return Response.json({ error: 'NON_AUTORISE' }, { status: 401 });
		}
		const result = await userService.refreshToken(token);
		if (!result) {
			return Response.json({ error: 'TOKEN_INVALIDE_OU_EXPIRE' }, { status: 401 });
		}
		return Response.json({ message: 'OK', user: formatUserDates(result.user), accessToken: result.accessToken });
	},

	async logout(_req: BunRequest): Promise<Response> {
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0',
			},
		});
	},
};
