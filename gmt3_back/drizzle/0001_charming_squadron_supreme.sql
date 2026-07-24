CREATE INDEX `avis_event_approved_date_idx` ON `avis` (`evenement_id`,`est_approuve`,`date_creation`);--> statement-breakpoint
CREATE INDEX `clients_contact_idx` ON `clients` (`contact`);--> statement-breakpoint
CREATE INDEX `evenements_publication_date_idx` ON `evenements` (`est_publie`,`date_depart`);--> statement-breakpoint
CREATE INDEX `journal_audit_user_date_idx` ON `journal_audit` (`utilisateur_id`,`date_creation`);--> statement-breakpoint
CREATE INDEX `photos_evenement_event_order_idx` ON `photos_evenement` (`evenement_id`,`ordre`);--> statement-breakpoint
CREATE INDEX `refresh_tokens_expiry_idx` ON `refresh_tokens` (`expires_at`);--> statement-breakpoint
CREATE INDEX `refresh_tokens_user_idx` ON `refresh_tokens` (`utilisateur_id`);--> statement-breakpoint
CREATE INDEX `reservations_event_status_idx` ON `reservations` (`evenement_id`,`statut`);--> statement-breakpoint
CREATE INDEX `reservations_client_idx` ON `reservations` (`client_id`);--> statement-breakpoint
CREATE INDEX `utilisateurs_role_idx` ON `utilisateurs` (`role`);