ALTER TABLE `evenements` ADD `public_code` text(10) NOT NULL DEFAULT '';--> statement-breakpoint
UPDATE `evenements` SET `public_code` = lower(substr(hex(randomblob(8)), 1, 10)) WHERE `public_code` = '';--> statement-breakpoint
CREATE UNIQUE INDEX `evenements_public_code_unique` ON `evenements` (`public_code`);
