import type { BunRequest } from '../types/http.js';
import { UserService } from '../services/UserService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import type { Utilisateur } from '../types/index.js';
import { formatDateFields } from '../utils/date.js';
import { isString } from '../utils/validation.js';
import { idOrError, jsonOrError, notFound } from './helpers.js';

const userService = new UserService(new UserRepository());

const IS_PRODUCTION = Bun.env.NODE_ENV === 'production';
const secureFlag = IS_PRODUCTION ? '; Secure' : '';
const SET_COOKIE_OPTS = `HttpOnly${secureFlag}; SameSite=Strict; Path=/api; Max-Age=604800`;
const SET_COOKIE_OPTS_LOGOUT = `HttpOnly${secureFlag}; SameSite=Strict; Path=/api; Max-Age=0`;

function formatUserDates<T extends { dateCreation?: string | null }>(user: T): T {
	return formatDateFields(user, ['dateCreation']);
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
		const id = idOrError(params);
		if (id instanceof Response) return id;
		const user = await userService.getById(id);
		if (!user) {
			return notFound('UTILISATEUR_INTROUVABLE', 'Utilisateur non trouvé');
		}
		return Response.json({ ...toSafeUser(formatUserDates(user)), message: 'Utilisateur chargé avec succès' });
	},

	async create(req: BunRequest): Promise<Response> {
		const input = await jsonOrError(req);
		if (input instanceof Response) return input;
		const body = input as {
			nom?: string;
			nomUtilisateur: string;
			motDePasse: string;
			email?: string;
			role?: 'admin' | 'editeur';
		};

		if (!isString(body.nomUtilisateur, 1, 50) || !isString(body.motDePasse, 12, 255) || (body.nom !== undefined && !isString(body.nom, 0, 100)) || (body.email !== undefined && (!isString(body.email, 1, 100) || !/^\S+@\S+\.\S+$/.test(body.email))) || (body.role !== undefined && !['admin', 'editeur'].includes(body.role))) {
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
		const id = idOrError(params);
		if (id instanceof Response) return id;
		const input = await jsonOrError(req);
		if (input instanceof Response) return input;
		const body = input as Partial<{
			nom: string;
			nomUtilisateur: string;
			motDePasse: string;
			email: string;
			role: 'admin' | 'editeur';
		}>;

		const existing = await userService.getById(id);
		if (!existing) return notFound('UTILISATEUR_INTROUVABLE', 'Utilisateur non trouvé');
		const data = {
			nomUtilisateur: body.nomUtilisateur?.trim(),
			email: body.email?.trim(),
			motDePasse: body.motDePasse,
			role: body.role,
		};
		if ((data.nomUtilisateur !== undefined && !isString(data.nomUtilisateur, 1, 50)) || (data.email !== undefined && data.email && (!isString(data.email, 1, 100) || !/^\S+@\S+\.\S+$/.test(data.email))) || (data.motDePasse !== undefined && !isString(data.motDePasse, 12, 255)) || (data.role !== undefined && !['admin', 'editeur'].includes(data.role))) {
			return Response.json({ error: 'CHAMPS_INVALIDES' }, { status: 400 });
		}
		if (existing.role === 'admin' && data.role === 'editeur' && await userService.countAdmins() <= 1) {
			return Response.json({ error: 'DERNIER_ADMIN', message: 'Le dernier administrateur ne peut pas être rétrogradé' }, { status: 409 });
		}
		const updated = await userService.update(id, Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)));
		if (!updated) {
			return notFound('UTILISATEUR_INTROUVABLE', 'Utilisateur non trouvé');
		}
		return Response.json({ ...toSafeUser(formatUserDates(updated)), message: 'Utilisateur modifié avec succès' });
	},

	async delete(req: BunRequest, params: { id: string }): Promise<Response> {
		const id = idOrError(params);
		if (id instanceof Response) return id;
		const existing = await userService.getById(id);
		if (!existing) return Response.json({ error: 'UTILISATEUR_INTROUVABLE', message: 'Utilisateur non trouvé' }, { status: 404 });
		if (req.user?.id === id) return Response.json({ error: 'AUTO_SUPPRESSION_INTERDITE' }, { status: 409 });
		if (existing.role === 'admin' && await userService.countAdmins() <= 1) return Response.json({ error: 'DERNIER_ADMIN' }, { status: 409 });
		const deleted = await userService.delete(id);
		if (!deleted) {
			return notFound('UTILISATEUR_INTROUVABLE', 'Utilisateur non trouvé');
		}
		return Response.json({ success: true, message: 'Utilisateur supprimé avec succès' });
	},

	async login(req: BunRequest): Promise<Response> {
		const input = await jsonOrError(req);
		if (input instanceof Response) return input;
		const body = input as { nomUtilisateur?: unknown; motDePasse?: unknown };
		if (!body || !isString(body.nomUtilisateur, 1, 50) || !isString(body.motDePasse, 1, 255)) {
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
