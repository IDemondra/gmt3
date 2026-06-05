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

	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const motDePasse = await bcrypt.hash('admin123', salt);

	if (existing) {
		await db
			.update(utilisateurs)
			.set({ motDePasse })
			.where(eq(utilisateurs.nomUtilisateur, 'admin'));
		console.log('[SEED] Mot de passe admin réinitialisé -> admin123');
	} else {
		await db.insert(utilisateurs).values({
			nom: 'Admin',
			nomUtilisateur: 'admin',
			motDePasse,
			email: 'admin@gmt3.mg',
			role: 'admin',
			dateCreation: new Date().toISOString(),
		});
		console.log('[SEED] Admin créé (admin / admin123)');
	}

	process.exit(0);
}

seed().catch((err) => {
	console.error('[SEED] Erreur:', err);
	process.exit(1);
});
