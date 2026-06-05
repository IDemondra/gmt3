const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/**
 * @param {string} token
 */
export async function clientsApi(token) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/clients`, { headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}

/**
 * @param {string} token
 * @param {{ nom: string; contact: string }} data
 */
export async function createClientApi(token, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/clients`, { method: 'POST', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_CREATION'); }
	return res.json();
}

/**
 * @param {string} token
 * @param {number} id
 * @param {{ nom?: string; contact?: string }} data
 */
export async function updateClientApi(token, id, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/clients/${id}`, { method: 'PUT', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_MAJ'); }
	return res.json();
}

/**
 * @param {string} token
 * @param {number} id
 */
export async function deleteClientApi(token, id) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE', headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_SUPPRESSION');
	return res.json();
}
