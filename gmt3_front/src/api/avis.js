import { apiRequest } from './http.js';

/** Public : déposer un avis. `data` est un FormData (evenementId, nom, note, commentaire, photo?). */
export async function createAvisApi(formData) {
	return apiRequest('/avis', { method: 'POST', body: formData, defaultError: 'ERREUR_ENVOI' });
}

/** Admin : liste complète pour modération. */
export async function avisApi(token) {
	return apiRequest('/avis', { token, defaultError: 'ERREUR_CHARGEMENT' });
}

/** Admin : approuver un avis. */
export async function approveAvisApi(token, id) {
	return apiRequest(`/avis/${id}/approuver`, { token, method: 'PUT', defaultError: 'ERREUR_APPROBATION' });
}

/** Admin : supprimer un avis. */
export async function deleteAvisApi(token, id) {
	return apiRequest(`/avis/${id}`, { token, method: 'DELETE', defaultError: 'ERREUR_SUPPRESSION' });
}
