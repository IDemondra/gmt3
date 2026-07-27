import { apiRequest } from './http.js';

/**
 * @param {string} token
 * @returns {Promise<{ totalEvents: number; totalReservations: number; limitedEvents: number; pendingReservations: number; pendingAvis: number }>}
 */
export async function kpisApi(token) {
	return apiRequest('/kpis', { token, defaultError: 'ERREUR_CHARGEMENT' });
}
