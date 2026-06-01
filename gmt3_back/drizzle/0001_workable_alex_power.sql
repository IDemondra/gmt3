PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(100) NOT NULL,
	`contact` text(100) NOT NULL,
	`date_ajout` text DEFAULT '2026-06-01T01:44:04.963Z'
);
--> statement-breakpoint
INSERT INTO `__new_clients`("id", "nom", "contact", "date_ajout") SELECT "id", "nom", "contact", "date_ajout" FROM `clients`;--> statement-breakpoint
DROP TABLE `clients`;--> statement-breakpoint
ALTER TABLE `__new_clients` RENAME TO `clients`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_evenements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text(150) NOT NULL,
	`description` text,
	`date_evenement` text NOT NULL,
	`heure_depart` text,
	`date_depart` text,
	`heure_retour` text,
	`date_retour` text,
	`lieu` text(150),
	`prix` real,
	`image_principale` text(255),
	`est_publie` integer DEFAULT true NOT NULL,
	`date_creation` text DEFAULT '2026-06-01T01:44:04.964Z'
);
--> statement-breakpoint
INSERT INTO `__new_evenements`("id", "titre", "description", "date_evenement", "heure_depart", "date_depart", "heure_retour", "date_retour", "lieu", "prix", "image_principale", "est_publie", "date_creation") SELECT "id", "titre", "description", "date_evenement", "heure_depart", "date_depart", "heure_retour", "date_retour", "lieu", "prix", "image_principale", "est_publie", "date_creation" FROM `evenements`;--> statement-breakpoint
DROP TABLE `evenements`;--> statement-breakpoint
ALTER TABLE `__new_evenements` RENAME TO `evenements`;--> statement-breakpoint
CREATE TABLE `__new_reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer,
	`evenement_id` integer,
	`nombre_places` integer DEFAULT 1 NOT NULL,
	`date_reservation` text DEFAULT '2026-06-01T01:44:04.964Z',
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reservations`("id", "client_id", "evenement_id", "nombre_places", "date_reservation") SELECT "id", "client_id", "evenement_id", "nombre_places", "date_reservation" FROM `reservations`;--> statement-breakpoint
DROP TABLE `reservations`;--> statement-breakpoint
ALTER TABLE `__new_reservations` RENAME TO `reservations`;--> statement-breakpoint
CREATE TABLE `__new_utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(100),
	`nom_utilisateur` text(50) NOT NULL,
	`mot_de_passe` text(255) NOT NULL,
	`email` text(100),
	`role` text DEFAULT 'editeur' NOT NULL,
	`date_creation` text DEFAULT '2026-06-01T01:44:04.962Z'
);
--> statement-breakpoint
INSERT INTO `__new_utilisateurs`("id", "nom", "nom_utilisateur", "mot_de_passe", "email", "role", "date_creation") SELECT "id", "nom", "nom_utilisateur", "mot_de_passe", "email", "role", "date_creation" FROM `utilisateurs`;--> statement-breakpoint
DROP TABLE `utilisateurs`;--> statement-breakpoint
ALTER TABLE `__new_utilisateurs` RENAME TO `utilisateurs`;--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_nom_utilisateur_unique` ON `utilisateurs` (`nom_utilisateur`);