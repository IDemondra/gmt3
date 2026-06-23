import type { BunRequest } from '../types/http.js';
import { UserService } from '../services/UserService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import type { Utilisateur } from '../types/index.js';
import { formatDateToDDMMYYYY } from '../utils/date.js';

const userService = new UserService(new UserRepository());

const IS_PRODUCTION = Bun.env.NODE_ENV === 'production';
const secureFlag = IS_PRODUCTION ? '; Secure' : '';
const SET_COOKIE_OPTS = `HttpOnly${secureFlag}; SameSite=Strict; Path=/api; Max-Age=604800`;
const SET_COOKIE_OPTS_LOGOUT = `HttpOnly${secureFlag}; SameSite=Strict; Path=/api; Max-Age=0`;

function formatUserDates<T extends { dateCreation?: string | null }>(user: T): T {
	return {
		...user,
		dateCreation: formatDateToDDMMYYYY(user.dateCreation),
	};
}

/** Retire le hash du mot de passe avant de renvoyer un utilisateur au client. */
function toSafeUser<T extends { motDePasse?: string }>(user: T): Omit<T, 'motDePasse'> {
	const { motDePasse: _omit, ...safe } = user;
	return safe;
}

export const UserController = {
	async getAll(req: BunRequest): Promise<Response> {
		const users = await userService.getAll();
		return Response.json({
			data: users.map((u) => toSafeUser(formatUserDates(u))),
			message: `${users.length} utilisateur(s) trouvé(s)`
		});
	},

	async getById(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
		}
		const user = await userService.getById(id);
		if (!user) {
			return Response.json({ error: 'UTILISATEUR_INTROUVABLE', message: 'Utilisateur non trouvé' }, { status: 404 });
		}
		return Response.json({ ...toSafeUser(formatUserDates(user)), message: 'Utilisateur chargé avec succès' });
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
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS', message: 'Le nom d\'utilisateur et le mot de passe sont obligatoires' }, { status: 400 });
		}

		try {
			const user = await userService.create(body);
			return Response.json({ ...toSafeUser(formatUserDates(user)), message: 'Utilisateur créé avec succès' }, { status: 201 });
		} catch (e) {
			const message = e instanceof Error ? e.message : 'ERREUR_INTERNE';
			if (message === 'CE_NOM_UTILISATEUR_EXISTE_DEJA') {
				return Response.json({ error: message, message: 'Ce nom d\'utilisateur existe déjà' }, { status: 409 });
			}
			throw e;
		}
	},

	async update(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
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
			return Response.json({ error: 'UTILISATEUR_INTROUVABLE', message: 'Utilisateur non trouvé' }, { status: 404 });
		}
		return Response.json({ ...toSafeUser(formatUserDates(updated)), message: 'Utilisateur modifié avec succès' });
	},

	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = Number(params.id);
		if (Number.isNaN(id)) {
			return Response.json({ error: 'ID_INVALIDE', message: 'ID invalide' }, { status: 400 });
		}
		const deleted = await userService.delete(id);
		if (!deleted) {
			return Response.json({ error: 'UTILISATEUR_INTROUVABLE', message: 'Utilisateur non trouvé' }, { status: 404 });
		}
		return Response.json({ success: true, message: 'Utilisateur supprimé avec succès' });
	},

	async login(req: BunRequest): Promise<Response> {
		const body = await req.json() as { nomUtilisateur: string; motDePasse: string };
		if (!body.nomUtilisateur || !body.motDePasse) {
			return Response.json({ error: 'CHAMPS_OBLIGATOIRES_MANQUANTS', message: 'Le nom d\'utilisateur et le mot de passe sont obligatoires' }, { status: 400 });
		}
		try {
			const { user, accessToken, refreshToken } = await userService.authenticate(body.nomUtilisateur, body.motDePasse);
			return new Response(JSON.stringify({ message: 'Connexion réussie', user: formatUserDates(user), accessToken }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					'Set-Cookie': `refreshToken=${refreshToken}; ${SET_COOKIE_OPTS}`,
				},
			});
		} catch (e) {
			return Response.json({ error: 'IDENTIFIANTS_INVALIDES', message: 'Identifiants invalides' }, { status: 401 });
		}
	},

	async refresh(req: BunRequest): Promise<Response> {
		const cookie = req.headers.get('Cookie') || '';
		const match = cookie.match(/refreshToken=([^;]+)/);
		const token = match ? decodeURIComponent(match[1]!) : null;
		if (!token) {
			return Response.json({ error: 'NON_AUTORISE', message: 'Non autorisé' }, { status: 401 });
		}
		const result = await userService.refreshToken(token);
		if (!result) {
			return Response.json({ error: 'TOKEN_INVALIDE_OU_EXPIRE', message: 'Token invalide ou expiré' }, { status: 401 });
		}
		return new Response(JSON.stringify({ message: 'Token rafraîchi avec succès', user: formatUserDates(result.user), accessToken: result.accessToken }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Set-Cookie': `refreshToken=${result.newRefreshToken}; ${SET_COOKIE_OPTS}`,
			},
		});
	},

	async logout(req: BunRequest): Promise<Response> {
		const cookie = req.headers.get('Cookie') || '';
		const match = cookie.match(/refreshToken=([^;]+)/);
		const token = match ? decodeURIComponent(match[1]!) : null;
		if (token) await userService.revokeRefreshToken(token);
		return new Response(JSON.stringify({ success: true, message: 'Déconnexion réussie' }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Set-Cookie': `refreshToken=; ${SET_COOKIE_OPTS_LOGOUT}`,
			},
		});
	},
};
