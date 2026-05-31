const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function usersApi(token) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/utilisateurs`, { headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_CHARGEMENT');
	return res.json();
}

export async function createUserApi(token, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/utilisateurs`, { method: 'POST', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) {
		const err = await res.json();
		throw new Error(err.error === 'CE_NOM_UTILISATEUR_EXISTE_DEJA' ? 'Ce nom d\'utilisateur existe déjà.' : 'ERREUR_CREATION');
	}
	return res.json();
}

export async function updateUserApi(token, id, data) {
	const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/utilisateurs/${id}`, { method: 'PUT', headers, body: JSON.stringify(data), credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_MAJ');
	return res.json();
}

export async function deleteUserApi(token, id) {
	const headers = { Authorization: `Bearer ${token}` };
	const res = await fetch(`${API_BASE}/api/utilisateurs/${id}`, { method: 'DELETE', headers, credentials: 'include' });
	if (!res.ok) throw new Error('ERREUR_SUPPRESSION');
	return res.json();
}
