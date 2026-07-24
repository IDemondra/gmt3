import { signal } from '@preact/signals';
import { login } from '../stores/auth.js';

export const formState = signal('login');
export const errorMsg = signal('');

export function useLogin(route) {
	const handleSubmit = async (e) => {
		e.preventDefault();

		const form = e.currentTarget;
		const nomUtilisateur = form.username.value.trim();
		const motDePasse = form.password.value;

		if (!nomUtilisateur || !motDePasse) {
			errorMsg.value = 'Veuillez remplir tous les champs.';
			return;
		}

		formState.value = 'loading';
		errorMsg.value = '';

		try {
			await login(nomUtilisateur, motDePasse);
			formState.value = 'login';
			route('/admin/dashboard', true);
		} catch (err) {
			errorMsg.value = err.message || 'Impossible de contacter le serveur.';
			formState.value = 'error';
		}
	};

	return { handleSubmit, formState, errorMsg };
}
