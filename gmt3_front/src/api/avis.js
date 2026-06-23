const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function parseJsonSafe(res) {
	try { return await res.json(); } catch { return { error: 'ERREUR_SERVEUR' }; }
}

/** Public : déposer un avis. `data` est un FormData (evenementId, nom, note, commentaire, photo?). */
export async function createAvisApi(formData) {
	const res = await fetch(`${API_BASE}/avis`, { method: 'POST', body: formData, credentials: 'include' });
	const json = await parseJsonSafe(res);
	if (!res.ok) throw new Error(json.message || json.error || 'ERREUR_ENVOI');
	return json;
}

/** Admin : liste complète pour modération. */
export async function avisApi(token) {
	const res = await fetch(`${API_BASE}/avis`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}

/** Admin : approuver un avis. */
export async function approveAvisApi(token, id) {
	const res = await fetch(`${API_BASE}/avis/${id}/approuver`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_APPROBATION');
	return res.json();
}

/** Admin : supprimer un avis. */
export async function deleteAvisApi(token, id) {
	const res = await fetch(`${API_BASE}/avis/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_SUPPRESSION');
	return res.json();
}
