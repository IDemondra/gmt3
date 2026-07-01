const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

/** @param {string} nomUtilisateur @param {string} motDePasse */
export async function loginApi(nomUtilisateur, motDePasse) {
	const res = await fetch(`${API_BASE}/utilisateurs/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nomUtilisateur, motDePasse }),
		credentials: 'include',
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.error === 'IDENTIFIANTS_INVALIDES' ? 'Identifiants incorrects.' : 'Erreur de connexion.');
	return data;
}

export async function refreshApi() {
	const res = await fetch(`${API_BASE}/utilisateurs/refresh`, {
		method: 'POST',
		credentials: 'include',
	});
	if (!res.ok) throw new Error('REFRESH_FAILED');
	return res.json();
}

export async function logoutApi() {
	await fetch(`${API_BASE}/utilisateurs/logout`, {
		method: 'POST',
		credentials: 'include',
	});
}
