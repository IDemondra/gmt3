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
