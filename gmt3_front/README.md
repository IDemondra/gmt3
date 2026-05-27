# GMT+3 Madagascar - Tour Operator

## Project Overview
Modern front-end for **GMT+3 Madagascar**, a travel/tourism operator specializing in expeditions across Madagascar. Built with **Preact** + **Vite** + **Tailwind CSS v4**.

Design modernized using **UI-UX Pro Max** guidelines: Motion-Driven animations, Glassmorphism effects, Bento-inspired layouts, scroll reveals, micro-interactions. Red theme preserved (#ba0013, #e31e24).

## Created / Modified Files
- `index.html` — preconnect hints, better font loading with more weights, meta description
- `src/index.css` — enhanced theme tokens, glass effects, keyframe animations, scrollbar styling, reduced-motion support, `scroll-behavior: smooth`
- `src/components/Header.jsx` — glassmorphism effect on scroll, scroll-aware shadow, DRY nav links, ghost "BOOK NOW" button in desktop nav, aria-labels
- `src/components/Footer.jsx` — modern dark footer with social icon buttons, better spacing, updated links, copyright section
- `src/components/ui/Button.jsx` — enhanced variants (ghost added), rounded-xl, hover scale effects
- `src/components/ui/Card.jsx` — rounded-2xl, hover translate-y, shadow-xl with primary tint
- `src/components/ui/TourCard.jsx` — refactored with calendar icon, gradient overlays, better hover transitions
- `src/components/ui/Reveal.jsx` — added `scaleDown` animation variant, smoother cubic-bezier timing, duration 800ms
- `src/components/ui/ActivityIcon.jsx` — rounded-2xl icons, hover scale and shadow effects
- `src/pages/Home/index.jsx` — added ContactSection import and integration
- `src/pages/Home/components/HeroSection.jsx` — radial gradient overlay, text-gradient accent, staggered fadeInUp animations, secondary CTA, scroll indicator
- `src/pages/Home/components/ActivitiesSection.jsx` — section-divider, rounded-2xl icons with shadow, hover translate-y
- `src/pages/Home/components/DestinationsSection.jsx` — rounded-2xl cards, scale-110 on hover, section-divider, improved gradient overlays
- `src/pages/Home/components/AboutSection.jsx` — rounded-xl images with gradient overlays, enriched list items with descriptions, section-divider
- `src/pages/Home/components/OffersSection.jsx` — gradient backgrounds, rounded-2xl, hover translate-y, icon scale on hover
- `src/pages/Home/components/GallerySection.jsx` — gradient hover overlay (not solid), rounded-xl, shadow-xl, lazy loading
- `src/pages/Home/components/BannerSection.jsx` — radial gradient overlay, rounded-xl CTA with hover scale
- `src/pages/Home/components/ContactSection.jsx` — glassmorphism cards, backdrop-blur, border effects, icon animations
- `src/pages/Events/index.jsx` — DRY event data, hero header with radial gradient, modern filter bar with rounded-xl, polished pagination
- `src/pages/_404.jsx` — redesigned with explore icon, travel-themed copy, primary-colored CTA

## Summary of What Works
- Build passes with zero errors (vite build: 35 modules, 799ms)
- All 3 pages prerender successfully: `/`, `/404`, `/events`
- Responsive on all breakpoints
- Scroll-triggered reveal animations
- Glassmorphism header with scroll-aware styling
- Accessible focus states and reduced-motion support
- Custom scrollbar styling

## Remaining Bugs
- None detected.

## Next Step
Integrate the backend API (`gmt3_back`) for dynamic tour data, implement search/filter functionality on the Events page, and add internationalization (i18n) support.

## Getting Started
- `npm run dev` — Starts dev server at http://localhost:5173/
- `npm run build` — Builds for production, emits to `dist/`
- `npm run preview` — Previews production build locally
