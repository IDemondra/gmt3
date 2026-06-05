const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/**
 * @param {string} token
 * @returns {Promise<Array>}
 */
export async function reservationsApi(token) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/reservations`, { headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}

/**
 * @param {string} token
 * @param {{ clientId: number; evenementId: number; nombrePlaces: number }} data
 * @returns {Promise<Object>}
 */
export async function createReservationApi(token, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/reservations`, { method: 'POST', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_CREATION'); }
	return res.json();
}

/**
 * @param {string} token
 * @param {number} id
 * @param {{ clientId?: number; evenementId?: number; nombrePlaces?: number }} data
 * @returns {Promise<Object>}
 */
export async function updateReservationApi(token, id, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/reservations/${id}`, { method: 'PUT', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_MAJ'); }
	return res.json();
}

/**
 * @param {string} token
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteReservationApi(token, id) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/reservations/${id}`, { method: 'DELETE', headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_SUPPRESSION');
	return res.json();
}
