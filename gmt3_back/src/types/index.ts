import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
	utilisateurs,
	clients,
	evenements,
	photosEvenement,
	reservations,
	avis,
} from '../models/schema.js';

// ── Infered types from Drizzle schema ──
export type Utilisateur = InferSelectModel<typeof utilisateurs>;
export type NewUtilisateur = InferInsertModel<typeof utilisateurs>;

export type Client = InferSelectModel<typeof clients>;
export type NewClient = InferInsertModel<typeof clients>;

export type Evenement = InferSelectModel<typeof evenements>;
export type NewEvenement = InferInsertModel<typeof evenements>;

export type PhotoEvenement = InferSelectModel<typeof photosEvenement>;
export type NewPhotoEvenement = InferInsertModel<typeof photosEvenement>;

export type Reservation = InferSelectModel<typeof reservations>;
export type NewReservation = InferInsertModel<typeof reservations>;

export type Avis = InferSelectModel<typeof avis>;
export type NewAvis = InferInsertModel<typeof avis>;
