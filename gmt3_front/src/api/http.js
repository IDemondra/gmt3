import { refreshAccessToken } from '../stores/auth.js';

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
 * @param {{ token?: string|null; method?: string; body?: FormData; json?: unknown; defaultError?: string; _retried?: boolean }} [options]
 */
export async function apiRequest(path, { token, method = 'GET', body, json, defaultError = 'ERREUR_SERVEUR', _retried = false } = {}) {
	const headers = {};
	if (token) headers.Authorization = `Bearer ${token}`;

	let finalBody = body;
	if (json !== undefined) {
		headers['Content-Type'] = 'application/json';
		finalBody = JSON.stringify(json);
	}

	const res = await fetch(`${API_BASE}${path}`, { method, headers, body: finalBody, credentials: 'include' });
	if (res.status === 401 && token && !_retried) {
		const newToken = await refreshAccessToken();
		return apiRequest(path, { token: newToken, method, body, json, defaultError, _retried: true });
	}
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
 * @param {{ token?: string|null; method?: string; body: FormData; defaultError?: string; onProgress?: (percent: number) => void; onProcessing?: () => void }} options
 */
export function apiUpload(path, { token, method = 'POST', body, defaultError = 'ERREUR_SERVEUR', onProgress, onProcessing }) {
	const send = (currentToken, retried = false) => new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		let processingNotified = false;
		xhr.open(method, `${API_BASE}${path}`);
		xhr.withCredentials = true;
		if (currentToken) xhr.setRequestHeader('Authorization', `Bearer ${currentToken}`);

		xhr.upload.onprogress = (e) => {
			if (!e.lengthComputable) return;
			const percent = Math.round((e.loaded / e.total) * 100);
			if (percent >= 100) {
				if (!processingNotified) {
					processingNotified = true;
					onProcessing?.();
				}
				onProgress?.(99);
				return;
			}
			onProgress?.(percent);
		};

		xhr.onload = async () => {
			let data;
			try { data = JSON.parse(xhr.responseText); } catch { data = { error: xhr.status === 413 ? 'FICHIER_TROP_LOURD' : 'ERREUR_SERVEUR' }; }
			if (xhr.status >= 200 && xhr.status < 300) {
				onProgress?.(100);
				resolve(data);
			} else if (xhr.status === 401 && currentToken && !retried) {
				try {
					resolve(await send(await refreshAccessToken(), true));
				} catch (error) {
					reject(error);
				}
			} else {
				reject(new Error(data.message || data.error || defaultError));
			}
		};
		xhr.onerror = () => reject(new Error(defaultError));
		xhr.ontimeout = () => reject(new Error(defaultError));

		xhr.send(body);
	});
	return send(token);
}
