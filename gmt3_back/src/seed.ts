import { eq } from 'drizzle-orm';
import { db } from './config/database.js';
import { utilisateurs } from './models/schema.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function seed() {
	const [existing] = await db
		.select()
		.from(utilisateurs)
		.where(eq(utilisateurs.nomUtilisateur, 'admin'))
		.limit(1);

	const IS_PRODUCTION = Bun.env.NODE_ENV === 'production';

	if (existing) {
		// En production, ne JAMAIS réinitialiser un mot de passe existant (porte dérobée).
		if (IS_PRODUCTION) {
			console.log('[SEED] Admin déjà présent — aucune modification (production)');
		} else {
			const salt = await bcrypt.genSalt(SALT_ROUNDS);
			const motDePasse = await bcrypt.hash('admin123', salt);
			await db
				.update(utilisateurs)
				.set({ motDePasse })
				.where(eq(utilisateurs.nomUtilisateur, 'admin'));
			console.log('[SEED] Mot de passe admin réinitialisé -> admin123 (dev)');
		}
	} else {
		// À la création, exiger un mot de passe explicite en prod via ADMIN_PASSWORD.
		const initialPassword = Bun.env.ADMIN_PASSWORD || (IS_PRODUCTION ? null : 'admin123');
		if (!initialPassword) {
			console.error('[SEED] ADMIN_PASSWORD requis en production pour créer l\'admin.');
			process.exit(1);
		}
		const salt = await bcrypt.genSalt(SALT_ROUNDS);
		const motDePasse = await bcrypt.hash(initialPassword, salt);
		await db.insert(utilisateurs).values({
			nom: 'Admin',
			nomUtilisateur: 'admin',
			motDePasse,
			email: 'admin@gmt3.mg',
			role: 'admin',
			dateCreation: new Date().toISOString(),
		});
		console.log(`[SEED] Admin créé (admin / ${IS_PRODUCTION ? '••• via ADMIN_PASSWORD' : initialPassword})`);
	}

	process.exit(0);
}

seed().catch((err) => {
	console.error('[SEED] Erreur:', err);
	process.exit(1);
});
