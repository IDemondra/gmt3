import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ── Utilisateurs ──
export const utilisateurs = sqliteTable('utilisateurs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom', { length: 100 }),
	nomUtilisateur: text('nom_utilisateur', { length: 50 }).notNull().unique(),
	motDePasse: text('mot_de_passe', { length: 255 }).notNull(),
	email: text('email', { length: 100 }),
	role: text('role', { enum: ['admin', 'editeur'] }).default('editeur').notNull(),
	dateCreation: text('date_creation').default(new Date().toISOString()),
});

// ── Clients ──
export const clients = sqliteTable('clients', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom', { length: 100 }).notNull(),
	contact: text('contact', { length: 100 }).notNull(),
	dateAjout: text('date_ajout').default(new Date().toISOString()),
});

// ── Événements ──
export const evenements = sqliteTable('evenements', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	titre: text('titre', { length: 150 }).notNull(),
	description: text('description'),
	dateEvenement: text('date_evenement').notNull(),
	heureDepart: text('heure_depart'),
	dateDepart: text('date_depart'),
	heureRetour: text('heure_retour'),
	dateRetour: text('date_retour'),
	lieu: text('lieu', { length: 150 }),
	prix: real('prix'),
	imagePrincipale: text('image_principale', { length: 255 }),
	estPublie: integer('est_publie', { mode: 'boolean' }).default(true).notNull(),
	dateCreation: text('date_creation').default(new Date().toISOString()),
});

// ── Photos Événement ──
export const photosEvenement = sqliteTable('photos_evenement', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	evenementId: integer('evenement_id').notNull().references(() => evenements.id, { onDelete: 'cascade' }),
	url: text('url', { length: 255 }).notNull(),
	ordre: integer('ordre').default(0),
	legende: text('legende', { length: 255 }),
});

// ── Refresh Tokens (rotation) ──
export const refreshTokens = sqliteTable('refresh_tokens', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	tokenHash: text('token_hash', { length: 64 }).notNull().unique(),
	utilisateurId: integer('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull(), // Unix timestamp (seconds)
});

// ── Réservations ──
export const reservations = sqliteTable('reservations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	clientId: integer('client_id').references(() => clients.id),
	evenementId: integer('evenement_id').references(() => evenements.id),
	nombrePlaces: integer('nombre_places').default(1).notNull(),
	dateReservation: text('date_reservation').default(new Date().toISOString()),
});
