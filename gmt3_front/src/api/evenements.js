import { apiRequest, apiUpload } from './http.js';

export async function evenementsApi(token) {
	return apiRequest('/evenements', { token, defaultError: 'ERREUR_CHARGEMENT' });
}

/**
 * @param {string|null} token
 * @param {number} id
 */
export async function evenementApi(token, id) {
	return apiRequest(`/evenements/${id}`, { token, defaultError: 'ERREUR_CHARGEMENT' });
}

/**
 * @param {string|null} token
 * @param {FormData} formData
 * @param {(percent: number) => void} [onProgress]
 */
export async function createEvenementApi(token, formData, onProgress) {
	return apiUpload('/evenements', { token, method: 'POST', body: formData, defaultError: 'ERREUR_CREATION', onProgress });
}

/**
 * @param {string|null} token
 * @param {number} id
 * @param {FormData} formData
 * @param {(percent: number) => void} [onProgress]
 */
export async function updateEvenementApi(token, id, formData, onProgress) {
	return apiUpload(`/evenements/${id}`, { token, method: 'PUT', body: formData, defaultError: 'ERREUR_MAJ', onProgress });
}

export async function deleteEvenementApi(token, id) {
	return apiRequest(`/evenements/${id}`, { token, method: 'DELETE', defaultError: 'ERREUR_SUPPRESSION' });
}

/**
 * Remplace toute la galerie photo d'un événement.
 * @param {string|null} token
 * @param {number} id
 * @param {FormData} formData FormData contenant les champs `photosEvenement`
 * @param {(percent: number) => void} [onProgress]
 */
export async function replacePhotosApi(token, id, formData, onProgress) {
	return apiUpload(`/evenements/${id}/photos`, { token, method: 'POST', body: formData, defaultError: 'ERREUR_UPLOAD', onProgress });
}
