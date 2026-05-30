import { signal } from '@preact/signals';

export const formState = signal('login'); // 'login' | 'loading' | 'error'
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
			const { loginApi } = await import('../api/auth.js');
			const data = await loginApi(nomUtilisateur, motDePasse);
			localStorage.setItem('admin_token', data.token);
			localStorage.setItem('admin_user', JSON.stringify(data.user));
			formState.value = 'login';
			route('/admin/dashboard', true);
		} catch (err) {
			errorMsg.value = err.message || 'Impossible de contacter le serveur.';
			formState.value = 'error';
		}
	};

	return { handleSubmit, formState, errorMsg };
}
