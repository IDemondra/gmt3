import { index, sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ── Utilisateurs ──
export const utilisateurs = sqliteTable('utilisateurs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom', { length: 100 }),
	nomUtilisateur: text('nom_utilisateur', { length: 50 }).notNull().unique(),
	motDePasse: text('mot_de_passe', { length: 255 }).notNull(),
	email: text('email', { length: 100 }),
	role: text('role', { enum: ['admin', 'editeur'] }).default('editeur').notNull(),
	actif: integer('actif', { mode: 'boolean' }).default(true).notNull(),
	derniereConnexion: text('derniere_connexion'),
	dateCreation: text('date_creation').$defaultFn(() => new Date().toISOString()),
}, (table) => [index('utilisateurs_role_idx').on(table.role)]);

// ── Clients ──
export const clients = sqliteTable('clients', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	nom: text('nom', { length: 100 }).notNull(),
	contact: text('contact', { length: 100 }).notNull(),
	dateAjout: text('date_ajout').$defaultFn(() => new Date().toISOString()),
}, (table) => [index('clients_contact_idx').on(table.contact)]);

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
	difficulte: text('difficulte', { length: 50 }),
	prix: real('prix'),
	capaciteMax: integer('capacite_max'),
	imagePrincipale: text('image_principale', { length: 255 }),
	estPublie: integer('est_publie', { mode: 'boolean' }).default(true).notNull(),
	dateCreation: text('date_creation').$defaultFn(() => new Date().toISOString()),
}, (table) => [index('evenements_publication_date_idx').on(table.estPublie, table.dateDepart)]);

// ── Photos Événement ──
export const photosEvenement = sqliteTable('photos_evenement', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	evenementId: integer('evenement_id').notNull().references(() => evenements.id, { onDelete: 'cascade' }),
	url: text('url', { length: 255 }).notNull(),
	ordre: integer('ordre').default(0),
	legende: text('legende', { length: 255 }),
}, (table) => [index('photos_evenement_event_order_idx').on(table.evenementId, table.ordre)]);

// ── Avis / Témoignages ──
export const avis = sqliteTable('avis', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	evenementId: integer('evenement_id').notNull().references(() => evenements.id, { onDelete: 'cascade' }),
	nom: text('nom', { length: 100 }).notNull(),
	note: integer('note').notNull(),
	commentaire: text('commentaire'),
	photoUrl: text('photo_url', { length: 255 }),
	estApprouve: integer('est_approuve', { mode: 'boolean' }).default(false).notNull(),
	dateCreation: text('date_creation').$defaultFn(() => new Date().toISOString()),
}, (table) => [index('avis_event_approved_date_idx').on(table.evenementId, table.estApprouve, table.dateCreation)]);

// ── Refresh Tokens (rotation) ──
export const refreshTokens = sqliteTable('refresh_tokens', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	tokenHash: text('token_hash', { length: 64 }).notNull().unique(),
	utilisateurId: integer('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull(), // Unix timestamp (seconds)
	rotatedAt: integer('rotated_at'), // Unix timestamp; courte fenêtre anti-course de rotation
}, (table) => [index('refresh_tokens_expiry_idx').on(table.expiresAt), index('refresh_tokens_user_idx').on(table.utilisateurId)]);

// ── Réservations ──
export const reservations = sqliteTable('reservations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	clientId: integer('client_id').references(() => clients.id),
	evenementId: integer('evenement_id').references(() => evenements.id),
	nombrePlaces: integer('nombre_places').default(1).notNull(),
	statut: text('statut', { enum: ['en_attente', 'confirmee', 'annulee'] }).default('confirmee').notNull(),
	montant: real('montant'),
	dateReservation: text('date_reservation').$defaultFn(() => new Date().toISOString()),
}, (table) => [index('reservations_event_status_idx').on(table.evenementId, table.statut), index('reservations_client_idx').on(table.clientId)]);

export const journalAudit = sqliteTable('journal_audit', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	utilisateurId: integer('utilisateur_id').references(() => utilisateurs.id, { onDelete: 'set null' }),
	action: text('action', { length: 20 }).notNull(),
	ressource: text('ressource', { length: 255 }).notNull(),
	adresseIp: text('adresse_ip', { length: 64 }),
	dateCreation: text('date_creation').notNull(),
}, (table) => [index('journal_audit_user_date_idx').on(table.utilisateurId, table.dateCreation)]);
