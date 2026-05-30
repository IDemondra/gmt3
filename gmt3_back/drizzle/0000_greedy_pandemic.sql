CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(100) NOT NULL,
	`contact` text(100) NOT NULL,
	`date_ajout` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `evenements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titre` text(150) NOT NULL,
	`description` text,
	`date_evenement` text NOT NULL,
	`lieu` text(150),
	`image_principale` text(255),
	`est_publie` integer DEFAULT true NOT NULL,
	`date_creation` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `photos_evenement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`evenement_id` integer NOT NULL,
	`url` text(255) NOT NULL,
	`ordre` integer DEFAULT 0,
	`legende` text(255),
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer,
	`evenement_id` integer,
	`date_reservation` text DEFAULT 'CURRENT_TIMESTAMP',
	FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`evenement_id`) REFERENCES `evenements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nom` text(100),
	`nom_utilisateur` text(50) NOT NULL,
	`mot_de_passe` text(255) NOT NULL,
	`email` text(100),
	`role` text DEFAULT 'editeur' NOT NULL,
	`date_creation` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_nom_utilisateur_unique` ON `utilisateurs` (`nom_utilisateur`);