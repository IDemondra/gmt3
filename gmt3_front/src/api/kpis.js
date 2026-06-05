const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/**
 * @param {string} token
 * @returns {Promise<{ totalEvents: number; totalReservations: number; limitedEvents: number }>}
 */
export async function kpisApi(token) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/kpis`, { headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}
