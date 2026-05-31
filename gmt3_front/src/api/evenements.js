const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function evenementsApi(token) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements`, { headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}

export async function createEvenementApi(token, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements`, { method: 'POST', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_CREATION'); }
	return res.json();
}

export async function updateEvenementApi(token, id, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements/${id}`, { method: 'PUT', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'ERREUR_MAJ'); }
	return res.json();
}

export async function deleteEvenementApi(token, id) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/evenements/${id}`, { method: 'DELETE', headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_SUPPRESSION');
	return res.json();
}
