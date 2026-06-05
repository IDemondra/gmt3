const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/**
 * @param {null} token
 */
export async function evenementsApi(token) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements`, { headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}

/**
 * @param {null} token
 * @param {number} id
 */
export async function evenementApi(token, id) {
	const headers = token ? { Authorization: `Bearer ${token}` } : {};
	const res = await fetch(`${API_BASE}/api/evenements/${id}`, { headers, credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_CHARGEMENT'); }
	return res.json();
}

export async function createEvenementApi(token, formData) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements`, { method: 'POST', headers, body: formData, credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_CREATION'); }
	return res.json();
}

/**
 * @param {null} token
 * @param {any} id
 * @param {{ titre: string; description: string; dateEvenement: Date; lieu: string; estPublie: boolean; }} data
 */
export async function updateEvenementApi(token, id, formData) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements/${id}`, { method: 'PUT', headers, body: formData, credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_MAJ'); }
	return res.json();
}

/**
 * @param {null} token
 * @param {any} id
 */
export async function deleteEvenementApi(token, id) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements/${id}`, { method: 'DELETE', headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_SUPPRESSION');
	return res.json();
}
