import { signal } from '@preact/signals';
import { loginApi, refreshApi, logoutApi } from '../api/auth.js';

export const accessToken = signal(null);
export const currentUser = signal(null);
export const authLoading = signal(true);

/**
 * @param {string} nomUtilisateur
 * @param {string} motDePasse
 */
export async function login(nomUtilisateur, motDePasse) {
	const data = await loginApi(nomUtilisateur, motDePasse);
	accessToken.value = data.accessToken;
	currentUser.value = data.user;
}

export async function tryAutoRefresh() {
	try {
		const data = await refreshApi();
		accessToken.value = data.accessToken;
		currentUser.value = data.user;
	} catch {
		// No valid refresh token
	} finally {
		authLoading.value = false;
	}
}

export async function logout() {
	accessToken.value = null;
	currentUser.value = null;
	try { await logoutApi(); } catch { /* ignore */ }
}

/**
 * Returns { handleLogout, confirmLogout } for use in admin pages.
 * @param {() => void} routeToLogin — e.g. `() => route('/admin', true)`
 */
export function useLogout(routeToLogin) {
	const confirmLogout = async () => {
		await logout();
		routeToLogin();
	};
	return { handleLogout: confirmLogout, confirmLogout };
}

