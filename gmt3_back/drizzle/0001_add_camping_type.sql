INSERT INTO `types_evenement` (`code`, `nom`, `icone`, `libelle_rythme`, `actif`, `ordre`)
VALUES ('camping', 'Camping', 'camping', 'Rythme du camping', 1, 0)
ON CONFLICT (`code`) DO UPDATE SET
	`nom` = 'Camping',
	`icone` = 'camping',
	`libelle_rythme` = 'Rythme du camping',
	`actif` = 1;
