const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

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

/**
 * Fetch avec Authorization Bearer + auto-refresh sur 401.
 * @param {string} url
 * @param {RequestInit & { token?: string }} [options]
 */
export async function apiFetch(url, options = {}) {
	const { token, ...rest } = options;
	const headers = { ...rest.headers };
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const res = await fetch(url, { ...rest, headers, credentials: 'include' });

	if (res.status === 401 && token) {
		try {
			const data = await refreshApi();
			// @ts-ignore
			headers['Authorization'] = `Bearer ${data.accessToken}`;
			const retry = await fetch(url, { ...rest, headers, credentials: 'include' });
			return { response: retry, token: data.accessToken };
		} catch {
			return { response: res, token: null };
		}
	}

	return { response: res, token };
}
