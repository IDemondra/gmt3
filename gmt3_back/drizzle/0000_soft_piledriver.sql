CREATE TABLE `avis` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evenement_id` integer NOT NULL,
	`nom` text(100) NOT NULL,
	`note` integer NOT NULL,
	`commentaire` text,
	`photo_url` text(255),
	`est_approuve` integer DEFAULT false NOT NULL,
	`date_creation` text,
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `avis_event_approved_date_idx` ON `avis` (`evenement_id`,`est_approuve`,`date_creation`);--> statement-breakpoint
CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(100) NOT NULL,
	`contact` text(100) NOT NULL,
	`date_ajout` text
);
--> statement-breakpoint
CREATE INDEX `clients_contact_idx` ON `clients` (`contact`);--> statement-breakpoint
CREATE TABLE `evenements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`public_code` text(10) NOT NULL,
	`type_evenement_id` integer DEFAULT 1 NOT NULL,
	`titre` text(150) NOT NULL,
	`description` text,
	`date_evenement` text NOT NULL,
	`heure_depart` text,
	`date_depart` text,
	`heure_retour` text,
	`date_retour` text,
	`lieu` text(150),
	`difficulte` text(50),
	`prix` real,
	`capacite_max` integer,
	`image_principale` text(255),
	`est_publie` integer DEFAULT true NOT NULL,
	`date_creation` text,
	FOREIGN KEY (`type_evenement_id`) REFERENCES `types_evenement`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `evenements_public_code_unique` ON `evenements` (`public_code`);--> statement-breakpoint
CREATE INDEX `evenements_publication_date_idx` ON `evenements` (`est_publie`,`date_depart`);--> statement-breakpoint
CREATE TABLE `journal_audit` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`utilisateur_id` integer,
	`action` text(20) NOT NULL,
	`ressource` text(255) NOT NULL,
	`adresse_ip` text(64),
	`date_creation` text NOT NULL,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `journal_audit_user_date_idx` ON `journal_audit` (`utilisateur_id`,`date_creation`);--> statement-breakpoint
CREATE TABLE `photos_evenement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evenement_id` integer NOT NULL,
	`url` text(255) NOT NULL,
	`ordre` integer DEFAULT 0,
	`legende` text(255),
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `photos_evenement_event_order_idx` ON `photos_evenement` (`evenement_id`,`ordre`);--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token_hash` text(64) NOT NULL,
	`utilisateur_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`rotated_at` integer,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_token_hash_unique` ON `refresh_tokens` (`token_hash`);--> statement-breakpoint
CREATE INDEX `refresh_tokens_expiry_idx` ON `refresh_tokens` (`expires_at`);--> statement-breakpoint
CREATE INDEX `refresh_tokens_user_idx` ON `refresh_tokens` (`utilisateur_id`);--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer,
	`evenement_id` integer,
	`nombre_places` integer DEFAULT 1 NOT NULL,
	`statut` text DEFAULT 'confirmee' NOT NULL,
	`montant` real,
	`date_reservation` text,
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reservations_event_status_idx` ON `reservations` (`evenement_id`,`statut`);--> statement-breakpoint
CREATE INDEX `reservations_client_idx` ON `reservations` (`client_id`);--> statement-breakpoint
CREATE TABLE `types_evenement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text(50) NOT NULL,
	`nom` text(100) NOT NULL,
	`icone` text(50) NOT NULL,
	`libelle_rythme` text(100) NOT NULL,
	`actif` integer DEFAULT true NOT NULL,
	`ordre` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `types_evenement_code_unique` ON `types_evenement` (`code`);--> statement-breakpoint
CREATE INDEX `types_evenement_active_order_idx` ON `types_evenement` (`actif`,`ordre`);--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(100),
	`nom_utilisateur` text(50) NOT NULL,
	`mot_de_passe` text(255) NOT NULL,
	`email` text(100),
	`role` text DEFAULT 'editeur' NOT NULL,
	`actif` integer DEFAULT true NOT NULL,
	`derniere_connexion` text,
	`date_creation` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_nom_utilisateur_unique` ON `utilisateurs` (`nom_utilisateur`);--> statement-breakpoint
CREATE INDEX `utilisateurs_role_idx` ON `utilisateurs` (`role`);