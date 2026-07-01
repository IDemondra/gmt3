const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

async function parseJsonSafe(res) {
	try {
		return await res.json();
	} catch {
		return { error: res.status === 413 ? 'FICHIER_TROP_LOURD' : 'ERREUR_SERVEUR' };
	}
}

/**
 * Fetch authentifié avec parsing JSON et fallback message/error cohérent —
 * utilisé par tous les modules api/* pour éviter de dupliquer le pattern
 * fetch + headers + gestion d'erreur.
 * @param {string} path chemin relatif à API_BASE (ex: '/evenements/1')
 * @param {{ token?: string|null; method?: string; body?: FormData; json?: unknown; defaultError?: string }} [options]
 */
export async function apiRequest(path, { token, method = 'GET', body, json, defaultError = 'ERREUR_SERVEUR' } = {}) {
	const headers = {};
	if (token) headers.Authorization = `Bearer ${token}`;

	let finalBody = body;
	if (json !== undefined) {
		headers['Content-Type'] = 'application/json';
		finalBody = JSON.stringify(json);
	}

	const res = await fetch(`${API_BASE}${path}`, { method, headers, body: finalBody, credentials: 'include' });
	if (!res.ok) {
		const e = await parseJsonSafe(res);
		throw new Error(e.message || e.error || defaultError);
	}
	return res.json();
}

/**
 * Upload FormData avec suivi de progression 0-100 — `fetch` ne remonte pas la
 * progression d'envoi, donc XMLHttpRequest est nécessaire ici.
 * @param {string} path
 * @param {{ token?: string|null; method?: string; body: FormData; defaultError?: string; onProgress?: (percent: number) => void }} options
 */
export function apiUpload(path, { token, method = 'POST', body, defaultError = 'ERREUR_SERVEUR', onProgress }) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open(method, `${API_BASE}${path}`);
		xhr.withCredentials = true;
		if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

		xhr.upload.onprogress = (e) => {
			if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
		};

		xhr.onload = () => {
			let data;
			try { data = JSON.parse(xhr.responseText); } catch { data = { error: xhr.status === 413 ? 'FICHIER_TROP_LOURD' : 'ERREUR_SERVEUR' }; }
			if (xhr.status >= 200 && xhr.status < 300) resolve(data);
			else reject(new Error(data.message || data.error || defaultError));
		};
		xhr.onerror = () => reject(new Error(defaultError));
		xhr.ontimeout = () => reject(new Error(defaultError));

		xhr.send(body);
	});
}
