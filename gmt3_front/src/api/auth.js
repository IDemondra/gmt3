const API_BASE = 'http://localhost:3000';

export async function loginApi(nomUtilisateur, motDePasse) {
	const res = await fetch(`${API_BASE}/api/utilisateurs/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ nomUtilisateur, motDePasse }),
	});

	const data = await res.json();

	if (!res.ok) {
		const message = data.error === 'IDENTIFIANTS_INVALIDES'
			? 'Identifiants incorrects.'
			: 'Erreur de connexion.';
		throw new Error(message);
	}

	return data;
}
