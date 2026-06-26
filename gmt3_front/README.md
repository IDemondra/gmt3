# GMT+3 Madagascar - Tour Operator

## Project Overview
Modern front-end for **GMT+3 Madagascar**, a travel/tourism operator specializing in expeditions across Madagascar. Built with **Preact** + **Vite** + **Tailwind CSS v4**.

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
- Build passes with zero errors (vite build: 38 modules, 798ms, 6 prerendered pages)
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

### Métadonnées
- `og:site_name` aligné sur `GMT+3 Fianarantsoa` (cohérence de branding → Google affiche le `+`).
- Suppression de la balise `<meta keywords>` partout (ignorée par Google depuis 2009, signal de spam).
- Prop `jsonLd` ajouté à `BaseLayout` pour injecter du schema par page.

### Sitemaps & robots
- `sitemap-index.xml` (statique, via `@astrojs/sitemap`) — pages `/`, `/events`, `/archives` ; admin exclu.
- `sitemap-events.xml` (endpoint SSR `src/pages/sitemap-events.xml.ts`) — une `<loc>` par expédition publiée (`estPublie`), interroge l'API backend au runtime.
- `robots.txt` référence les deux sitemaps ; `Disallow: /admin`.

### Cohérence NAP (Name / Address / Phone)
Corrections d'incohérences entre `ContactSection.jsx`, footer et JSON-LD :
- Coordonnées GPS affichées corrigées (Antananarivo → Fianarantsoa).
- Email CTA aligné sur `hanitra@great-madagascar-tours.com`.
- Téléphone placeholder du bouton « Appeler » remplacé par `+261340312401`.
- Lien Facebook social → groupe officiel `groups/1567275954180870`.

### À déployer / configurer (hors code)
1. Merger + déployer en prod (Googlebot ne voit rien tant que ce n'est pas en ligne).
2. Soumettre `sitemap-index.xml` et `sitemap-events.xml` dans Google Search Console + « Demander l'indexation ».
3. Vérifier la redirection 301 `http → https` côté serveur/reverse-proxy.
4. Ajouter une image OG dédiée 1200×630 (`og-cover.jpg`) — actuellement le logo carré est utilisé.
5. Créer les pages footer mortes (Conditions, Confidentialité, Sécurité, Partenaires) et l'URL Instagram réelle.

## Getting Started
- `npm run dev` — Starts dev server at http://localhost:5173/
- `npm run build` — Builds for production, emits to `dist/`
- `npm run preview` — Previews production build locally
