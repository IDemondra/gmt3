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
└── index.ts          # Point d'entrée
```

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
