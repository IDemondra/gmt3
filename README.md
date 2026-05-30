# Contexte

## Created / Modified Files
- `gmt3_front/src/components/Header.jsx`
- `gmt3_front/src/components/ui/Card.jsx`
- `gmt3_front/src/components/ui/TourCard.jsx`
- `gmt3_front/src/components/ui/Reveal.jsx`
- `gmt3_front/src/data/upcomingEvents.js`
- `gmt3_front/src/hooks/useScrollReveal.js`
- `gmt3_front/src/index.css`
- `gmt3_front/src/pages/Home/components/HeroSection.jsx`
- `gmt3_front/src/pages/Home/components/ActivitiesSection.jsx`
- `gmt3_front/src/pages/Home/components/AboutSection.jsx`
- `gmt3_front/src/pages/Home/components/DestinationsSection.jsx`
- `gmt3_front/src/pages/Home/components/GallerySection.jsx`
- `gmt3_front/src/pages/Home/index.jsx`
- `gmt3_front/src/pages/Events/Detail.jsx`
- `gmt3_front/src/pages/Events/index.jsx`
- `gmt3_front/src/index.jsx`
- `gmt3_front/src/utils/images.js`
- `README.md`
- `gmt3_front/src/pages/Home/components/GallerySection.jsx` — gallery refaite en grandes model cards inspirées de la section guides

## What Works
- Le titre `UPCOMING EVENTS` a été remplacé par `PROCHAINES EVENNEMENTS`.
- La page utilise désormais la carte premium réutilisable du site pour les événements.
- Chaque carte `EN SAVOIR PLUS` ouvre une page détail dédiée par événement.
- Les filtres et la pagination ont été retirés pour aligner la page sur le design de la section `Prochaines Evennements`.
- Les pages détail événement sont prerendered automatiquement.
- La build de production passe avec le prerendering activé.
- Le système de scroll reveal est plus cinématique, plus immersif et appliqué aux principales sections.
- Le hero d’accueil utilise maintenant la même logique d’animation scroll que le reste du site.
- Le rythme des animations a été raccourci pour un rendu plus fluide et plus réactif.
- Les animations de scroll ont été allégées pour supprimer l’effet lourd et améliorer la fluidité au scroll.
- Les plus gros coûts de rendu viennent désormais des surfaces blur/shadow, qui ont été réduites sur les composants principaux.
- Les animations sont maintenant appliquées surtout aux cartes et aux tuiles, pas aux sections entières.
- Les durées d’animation des cartes ont été rallongées.
- Le bloc `Destinations Phares` a été restauré sans wrapper d’animation de section.
- La galerie Home utilise désormais des cartes larges et hautes, inspirées du layout des model cards, pour mettre l’image au premier plan.

## Remaining Bugs
- Aucun bug fonctionnel identifié sur cette passe.

## Next Step
- Vérifier le rendu responsive de la page `Events` dans le navigateur.
