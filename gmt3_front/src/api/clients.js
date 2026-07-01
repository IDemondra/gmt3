import { apiRequest } from './http.js';

/**
 * @param {string} token
 */
export async function clientsApi(token) {
	return apiRequest('/clients', { token, defaultError: 'ERREUR_CHARGEMENT' });
}

/**
 * @param {string} token
 * @param {{ nom: string; contact: string }} data
 */
export async function createClientApi(token, data) {
	return apiRequest('/clients', { token, method: 'POST', json: data, defaultError: 'ERREUR_CREATION' });
}

/**
 * @param {string} token
 * @param {number} id
 * @param {{ nom?: string; contact?: string }} data
 */
export async function updateClientApi(token, id, data) {
	return apiRequest(`/clients/${id}`, { token, method: 'PUT', json: data, defaultError: 'ERREUR_MAJ' });
}

/**
 * @param {string} token
 * @param {number} id
 */
export async function deleteClientApi(token, id) {
	return apiRequest(`/clients/${id}`, { token, method: 'DELETE', defaultError: 'ERREUR_SUPPRESSION' });
}
