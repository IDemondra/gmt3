import { apiRequest } from './http.js';

/**
 * @param {string} token
 */
export async function usersApi(token) {
	return apiRequest('/utilisateurs', { token, defaultError: 'ERREUR_CHARGEMENT' });
}

/**
 * @param {string} token
 * @param {{ nomUtilisateur: string; email: string; role: string; motDePasse: string; }} data
 */
export async function createUserApi(token, data) {
	try {
		return await apiRequest('/utilisateurs', { token, method: 'POST', json: data, defaultError: 'ERREUR_CREATION' });
	} catch (e) {
		throw new Error(e.message === 'CE_NOM_UTILISATEUR_EXISTE_DEJA' ? 'Ce nom d\'utilisateur existe déjà.' : 'ERREUR_CREATION');
	}
}

/**
 * @param {string} token
 * @param {number} id
 * @param {{ nomUtilisateur: string; email: string; role: string; }} data
 */
export async function updateUserApi(token, id, data) {
	return apiRequest(`/utilisateurs/${id}`, { token, method: 'PUT', json: data, defaultError: 'ERREUR_MAJ' });
}

/**
 * @param {string} token
 * @param {number} id
 */
export async function deleteUserApi(token, id) {
	return apiRequest(`/utilisateurs/${id}`, { token, method: 'DELETE', defaultError: 'ERREUR_SUPPRESSION' });
}
