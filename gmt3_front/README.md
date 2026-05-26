# Lemur Adventures Preact Site

## Project Overview
Implemented the full HTML layout from `code.html` using a **Preact** + **Vite** + **Tailwind CSS** stack.
Key components:
- `Header` with responsive mobile menu (signals)
- `HeroSection`, `ActivitiesSection`, `ToursSection`, `AboutSection`, `ContactSection`
- Reusable UI components (`Button`, `Card`, `TourCard`)
- Tailwind configuration via `tailwind.config.cjs`

## Created / Modified Files
- `src/components/Header.jsx` (responsive navigation)
- `src/components/ui/Button.jsx` (styled button component)
- `src/components/ui/Card.jsx` (card wrapper)
- `src/components/ui/TourCard.jsx` (tour card UI)
- `src/pages/Home/components/*.jsx` (section components)
- `src/pages/Home/index.jsx` (imports sections)
- `tailwind.config.cjs` (Tailwind content paths)
- `src/index.css` (Tailwind directives and custom theme)
- `package.json` (added `@preact/signals`, `clsx`, `tailwindcss`)
- `vite.config.js` (unchanged, works with Vite 8)

## Summary of What Works
Running `bunx vite` starts the development server at **http://localhost:5174** with no build errors. All sections render correctly and are styled with Tailwind utilities.

## Remaining Bugs
- None detected.

## Next Step
Add routing for additional pages (e.g., profile, auth) and integrate real data fetching via `preact-router` and services.

<h2 align="center">
  <img height="256" width="256" src="./src/assets/preact.svg">
</h2>

<h3 align="center">Get started using Preact and Vite!</h3>

## Getting Started

-   `npm run dev` - Starts a dev server at http://localhost:5173/

-   `npm run build` - Builds for production, emitting to `dist/`. Prerenders all found routes in app to static HTML

-   `npm run preview` - Starts a server at http://localhost:4173/ to test production build locally
