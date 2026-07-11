import { apiRequest } from './http.js';

/**
 * @param {string} token
 * @returns {Promise<Array>}
 */
export async function reservationsApi(token) {
	return apiRequest('/reservations', { token, defaultError: 'ERREUR_CHARGEMENT' });
}

/**
 * @param {string} token
 * @param {{ clientId: number; evenementId: number; nombrePlaces: number; statut?: 'en_attente'|'confirmee'|'annulee' }} data
 * @returns {Promise<Object>}
 */
export async function createReservationApi(token, data) {
	return apiRequest('/reservations', { token, method: 'POST', json: data, defaultError: 'ERREUR_CREATION' });
}

/**
 * @param {string} token
 * @param {number} id
 * @param {{ clientId?: number; evenementId?: number; nombrePlaces?: number; statut?: 'en_attente'|'confirmee'|'annulee' }} data
 * @returns {Promise<Object>}
 */
export async function updateReservationApi(token, id, data) {
	return apiRequest(`/reservations/${id}`, { token, method: 'PUT', json: data, defaultError: 'ERREUR_MAJ' });
}

/**
 * @param {string} token
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteReservationApi(token, id) {
	return apiRequest(`/reservations/${id}`, { token, method: 'DELETE', defaultError: 'ERREUR_SUPPRESSION' });
}
