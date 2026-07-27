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
INSERT INTO `types_evenement` (`code`, `nom`, `icone`, `libelle_rythme`, `ordre`) VALUES
	('randonnee', 'Randonnée', 'hiking', 'Rythme de randonnée', 1),
	('randonnee_touristique', 'Randonnée touristique', 'travel_explore', 'Rythme de randonnée touristique', 2),
	('voyage', 'Voyage / circuit', 'luggage', 'Rythme du voyage', 3),
	('pique_nique', 'Pique-nique', 'outdoor_grill', 'Rythme du pique-nique', 4),
	('visite_culturelle', 'Visite culturelle', 'museum', 'Rythme de la visite', 5),
	('aventure', 'Aventure / plein air', 'explore', 'Rythme de l’aventure', 6),
	('autre', 'Autre', 'category', 'Rythme de l’événement', 7);--> statement-breakpoint
ALTER TABLE `evenements` ADD `type_evenement_id` integer DEFAULT 1 NOT NULL REFERENCES types_evenement(id);
