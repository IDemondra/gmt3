# GMT+3 Back Office

Backend API pour GMT+3 Madagascar — construit avec **Bun**, **Drizzle ORM** et **SQLite**.

## Stack

- **Runtime** : Bun
- **ORM** : Drizzle ORM
- **Base de données** : SQLite
- **Hachage** : bcryptjs
- **JWT** : jsonwebtoken
- **Langage** : TypeScript

## Structure

```
src/
├── config/           # Connexion DB
├── controllers/      # Couche transport HTTP
├── middlewares/       # Auth, validation
├── models/           # Schémas Drizzle
├── repositories/     # Accès aux données (Repository Pattern)
│   └── interfaces/   # Contrats des repositories
├── routes/           # Définition des endpoints
├── services/         # Logique métier
├── types/            # Types partagés
├── app.ts            # Configuration app + router
├── seed.ts           # Peuplement initial (admin)
└── index.ts          # Point d'entrée
```

## Tables

- `utilisateurs` — Authentification & rôles (admin, editeur)
- `clients` — Gestion des clients
- `evenements` — Expéditions, circuits & destinations
- `photos_evenement` — Galerie liens événements
- `reservations` — Réservations client → événement

## API Endpoints

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | /api/utilisateurs | Non | Liste des utilisateurs |
| POST | /api/utilisateurs | Non | Créer un utilisateur |
| POST | /api/utilisateurs/login | Non | Connexion |
| POST | /api/utilisateurs/refresh | Non | Rafraîchir token |
| POST | /api/utilisateurs/logout | Non | Déconnexion |
| GET | /api/utilisateurs/:id | Non | Détail utilisateur |
| PUT | /api/utilisateurs/:id | Oui | Modifier utilisateur |
| DELETE | /api/utilisateurs/:id | Oui | Supprimer utilisateur |
| GET | /api/clients | Non | Liste des clients |
| POST | /api/clients | Non | Créer un client |
| GET | /api/clients/:id | Non | Détail client |
| PUT | /api/clients/:id | Oui | Modifier client |
| DELETE | /api/clients/:id | Oui | Supprimer client |
| GET | /api/evenements | Non | Liste des événements |
| POST | /api/evenements | Oui | Créer un événement |
| GET | /api/evenements/:id | Non | Détail événement |
| PUT | /api/evenements/:id | Oui | Modifier événement |
| DELETE | /api/evenements/:id | Oui | Supprimer événement |

## Authentification

- Login → `accessToken` (15 min) + cookie `refreshToken` (7 jours)
- Routes protégées : `Authorization: Bearer <accessToken>`
- Auto-refresh sur 401 via cookie

## Installation

```bash
bun install
```

## Développement

```bash
bun run --watch src/index.ts
```

## Base de données

```bash
# Générer une migration après modification du schéma
bun x drizzle-kit generate

# Appliquer les migrations
bun x drizzle-kit migrate

# Ouvrir le studio Drizzle (UI)
bun x drizzle-kit studio
```

## API

| Méthode | Endpoint                      | Description           |
|---------|-------------------------------|-----------------------|
| GET     | `/api/utilisateurs`           | Liste des utilisateurs|
| POST    | `/api/utilisateurs`           | Créer un utilisateur  |
| GET     | `/api/utilisateurs/:id`       | Détail utilisateur    |
| PUT     | `/api/utilisateurs/:id`       | Modifier utilisateur  |
| DELETE  | `/api/utilisateurs/:id`       | Supprimer utilisateur |
| POST    | `/api/utilisateurs/login`     | Authentification      |

## Modèles

- **utilisateurs** — Admins & éditeurs
- **clients** — Clients réservant des événements
- **evenements** — Événements touristiques
- **photos_evenement** — Photos liées à un événement
- **reservations** — Réservations clients ↔ événements
