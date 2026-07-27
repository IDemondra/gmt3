# GMT+3 Madagascar - Tour Operator

## Project Overview
Modern front-end for **GMT+3 Madagascar**, a travel/tourism operator specializing in expeditions across Madagascar. Built with **Astro** + **Preact** + **Bun** + **Tailwind CSS v4**.

Design modernized using **UI-UX Pro Max** guidelines: Motion-Driven animations, Glassmorphism effects, Bento-inspired layouts, scroll reveals, micro-interactions. Red theme preserved (#ba0013, #e31e24).

## Created / Modified Files
- `src/components/ui/Reveal.jsx` — rewrite: inline transform/opacity via CSS custom properties, re-render on `isVisible` state change
- `src/components/ui/GalleryModal.jsx` — NEW: full-screen lightbox modal with prev/next navigation, keyboard support, backdrop blur, click-outside-to-close
- `src/pages/Home/components/GallerySection.jsx` — added lightbox: click image to open modal, grid spans rebalanced (8+4 / 4+4+4), auto-rows increased to 300px, gap to 6
- `src/hooks/useScrollReveal.js` — simplified to plain `useState` + `useEffect` (removed signal dependency)
- `vite.config.js` — added User-Agent header to image proxy
- `src/index.css` — restored `@import "tailwindcss"`, defined all theme tokens directly in `@theme` block (resolved `var()` → raw values), removed obsolete `:root` block
- `src/pages/Home/components/BannerSection.jsx` — wrapped in `<Reveal>` on outer wrapper
- `src/pages/Home/components/ContactSection.jsx` — wrapped each column in `<Reveal>` with staggered delay
- `src/pages/Home/components/Footer.jsx` — wrapped columns and copyright row in `<Reveal>`
- `src/pages/Home/components/DestinationsSection.jsx` — wrapped title and each card in `<Reveal>`
- `src/pages/Home/components/Header.jsx` — fixed `img()` wrapper on logo src

## Summary of What Works
- Astro SSR build passes with zero errors via Bun
- Full-page scroll-reveal animations on all sections
- Lightbox gallery with keyboard navigation (ArrowLeft/ArrowRight/Escape)
- Google CDN image proxy bypasses CORS/tracking restrictions
- Tailwind v4 theme tokens resolved correctly
- Login API endpoint works: `POST /api/utilisateurs/login`
- Seed script (`src/seed.ts`) creates admin account (admin / admin123)

## Remaining Bugs
- Google image CDN may still return 403 for some URLs depending on geographic region; use `vite.config.js` proxy with custom User-Agent as mitigation.

## Next Step
Integrate the backend API (`gmt3_back`) for dynamic tour/event data, implement search/filter on Events page, and add i18n support.

## SEO & Référencement

Travaux d'optimisation SEO réalisés sur le site (branche `seo/structured-data-cleanup`).

### Données structurées (JSON-LD)
- **`TravelAgency`** (global, `BaseLayout.astro`) — nom (`GMT+3 Fianarantsoa` + `alternateName`), adresse Anolaka Fianarantsoa, géo (-21.4536, 47.0858), téléphone, email, `sameAs` → groupe Facebook officiel.
- **`WebSite`** (global) — `name: "GMT+3 Fianarantsoa"` pour forcer l'affichage du nom de marque dans les SERP (au lieu du domaine brut) ; `creator` = Demondra (créateur du site) ; `publisher` lié au `TravelAgency`.
- **`TouristTrip`** (par expédition, `events/[id].astro`) — nom, dates ISO 8601, lieu, prix MGA, offre `InStock`. Éligibilité aux résultats enrichis.
- **`SearchAction`** (dans `WebSite`) — active la *sitelinks searchbox* ; pointe vers la page de recherche SSR `/recherche?q=`.
- **`FAQPage`** (`faq.astro`) — 8 Q/R synchronisées au contenu visible.
- **`Article`** (`GuideLayout.astro`) — sur chaque guide de la section Conseils.
- **`BreadcrumbList`** — sur `/events`, `/archives`, `/faq`, `/recherche`, `/events/[id]` et les pages Conseils.

### Pages de contenu & SEO
- **`/faq`** — page FAQ (schema `FAQPage` + `BreadcrumbList`).
- **`/recherche?q=`** — recherche SSR des expéditions publiées et à venir (`isDateInFuture`), en `noindex`, exclue du sitemap.
- **`/conseils`** + 3 guides cornerstone (`que-faire-a-fianarantsoa`, `randonnee-pays-betsileo`, `quand-partir-a-fianarantsoa`) via `GuideLayout.astro` (DRY).
- **`/llms.txt`** — fiche structurée de l'entité pour les moteurs IA (GEO).

### Métadonnées
- `og:site_name` aligné sur `GMT+3 Fianarantsoa` (cohérence de branding → Google affiche le `+`).
- Suppression de la balise `<meta keywords>` partout (ignorée par Google depuis 2009, signal de spam).
- Prop `jsonLd` ajouté à `BaseLayout` pour injecter du schema par page.

### Sitemaps & robots
- `sitemap-index.xml` (statique, via `@astrojs/sitemap`) — pages statiques (`/`, `/events`, `/archives`, `/faq`, `/conseils` + guides) ; `/admin` et `/recherche` exclus via `filter`.
- `sitemap-events.xml` (endpoint SSR `src/pages/sitemap-events.xml.ts`) — une `<loc>` par expédition publiée (`estPublie`), interroge l'API backend au runtime.
- `robots.txt` référence les deux sitemaps ; `Disallow: /admin` ; tous crawlers autorisés (`*`, IA incluses).

### Infrastructure (Traefik)
- Router front : `Host(gmt3-fianarantsoa.mg) || Host(www.gmt3-fianarantsoa.mg)`.
- Middleware `redirectregex` : **301/308 `www` → non-www** (cohérence canonical, évite le contenu dupliqué).

### Cohérence NAP (Name / Address / Phone)
Corrections d'incohérences entre `ContactSection.jsx`, footer et JSON-LD :
- Coordonnées GPS affichées corrigées (Antananarivo → Fianarantsoa).
- Email CTA aligné sur `hanitra@great-madagascar-tours.com`.
- Téléphone placeholder du bouton « Appeler » remplacé par `+261340312401`.
- Lien Facebook social → groupe officiel `groups/1567275954180870`.

### Checklist post-déploiement (Search Console — à faire une fois en ligne)
1. **Google Search Console → Sitemaps** : soumettre `sitemap-index.xml` **et** `sitemap-events.xml`.
2. **Inspection d'URL → « Demander l'indexation »** pour les pages prioritaires : `/`, `/conseils/que-faire-a-fianarantsoa`, `/conseils/randonnee-pays-betsileo`, `/faq`, `/events`.
3. **Test des résultats enrichis** (search.google.com/test/rich-results) : valider 0 erreur sur `TravelAgency`, `Article`, `FAQPage`, `TouristTrip`, `BreadcrumbList`.
4. **Bing Webmaster Tools** : soumettre le sitemap (Bing alimente ChatGPT/Copilot).

### Timeline d'indexation (réaliste)
| Délai | Effet attendu |
| --- | --- |
| 24–72 h | Pages indexées, `<title>` avec le `+`, nom de site « GMT+3 Fianarantsoa » |
| 1–2 semaines | Résultats enrichis (FAQ, fil d'Ariane), pages Conseils sur la longue traîne |
| 2–4 semaines | Premiers sitelinks possibles, citations LLM (si présence externe) |
| 1–3 mois | Montée en autorité, domination sur « Fianarantsoa / Betsileo » |

### Reste hors-code (non bloquant)
- **Google Business** actif + avis clients (local pack / Maps).
- **Backlinks** : annuaires tourisme Madagascar, TripAdvisor, partenaires hôtels.
- **Image OG dédiée** 1200×630 (actuellement le logo carré est utilisé par défaut).
- **Relire le contenu** FAQ + guides Conseils (exactitude factuelle).
- Pages footer mortes restantes (Conditions, Confidentialité, Partenaires) + URL Instagram réelle.

## Corrections & Refactors (session courante)

### Upload photo — bug production (timeout + duplication)
- **Cause racine** : `Bun.serve` utilisait l'`idleTimeout` par défaut (10s), insuffisant pour un upload multi-photos depuis mobile (réseau lent + conversion HEIC/sharp côté serveur) → connexion coupée avant la réponse JSON, d'où le toast "erreur serveur" générique. Fix : `idleTimeout: 300` (`gmt3_back/index.ts`).
- Le middleware de debug clonait et loggait le **corps entier** de chaque requête, y compris les uploads binaires multipart — surcharge mémoire inutile sur mobile. Fix : exclusion des requêtes `multipart/form-data` du logging (`gmt3_back/index.ts`).
- Backend : conversion image systématique en **WebP** (`gmt3_back/src/utils/imageOptimize.ts`), garde-fou taille totale de galerie (40 Mo, rejet 413 avant tout traitement HEIC/sharp coûteux) dans `EvenementController.ts`.
- Frontend : logique d'upload de galerie (limite, compression à l'ajout, previews, révocation blob) mutualisée dans `src/hooks/useGalleryUpload.js`, utilisée par `Photos.jsx` et `Dashboard.jsx` — corrige au passage un bug latent où supprimer une photo existante pouvait retirer la mauvaise nouvelle photo.
- Barre de progression d'upload réelle (0-100%, XHR) via `src/api/http.js` (`apiUpload`) et `src/components/ui/ProgressBar.jsx`.

### Couche API front — duplication éliminée
- `src/api/http.js` : `apiRequest`/`apiUpload` uniques (fetch + auth + parsing JSON + fallback message/error), utilisés par tous les modules `api/*` (`evenements.js`, `avis.js`, `kpis.js`, `clients.js`, `reservations.js`, `users.js`) au lieu de dupliquer le pattern fetch dans chaque fichier.
- Suppression du code mort `apiFetch` dans `auth.js` (fonction avec logique de refresh sur 401, jamais importée).
- `src/components/ui/Skeleton.jsx` : état de chargement uniforme, remplace les "Chargement..." ad-hoc dupliqués (`Photos.jsx`, `Avis.jsx`).

### Audit anti-slop (site public — Home, Events, Detail)
- Eyebrows en excès supprimés (max ~1 par 3 sections au lieu d'un label sur quasi chaque section).
- Tous les tirets cadratins (`—`) visibles retirés (textes, boutons, valeurs de repli).
- Fausses données décoratives supprimées (serials `MOD-01`, codes `L-24`/`S-01` inventés dans `ActivitiesSection.jsx`).
- `<br/>` forcés retirés sur les titres courts (Home + Events) qui coupaient artificiellement la ligne sans raison.
- Calques de transition morts/dangereux supprimés (fondus sombre-vers-transparent posés sur fond clair qui lessivaient le texte ou créaient une bande grise ; calque "Banner → Contact" obsolète dans `ContactSection.jsx`).
- `text-gradient` (dégradé rouge monochrome) recentré sur Hero/Activités/Testimonials au lieu d'être répété sur tous les titres de section.
- **Bug réel corrigé** : lightbox de `GallerySection.jsx` (Home) — `setLightbox()` mettait à jour un état jamais consommé, aucun aperçu ne s'ouvrait au clic malgré l'icône "zoom". Branché sur `ImagePreview`. Même correction sur la galerie "Preuves de Terrain" de `Events/index.jsx` (ouvrait un nouvel onglet au lieu d'un aperçu in-page).

## Getting Started
- `bun run dev` — Starts dev server at http://localhost:4321/
- `bun run check` — Checks Astro files and SSR frontmatter
- `bun run lint` — Lints frontend source
- `bun test` — Runs frontend tests
- `bun run build` — Builds for production, emits to `dist/`
- `bun run preview` — Previews production build locally
