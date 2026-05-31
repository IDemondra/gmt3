# Contexte

## Created / Modified Files
- `gmt3_front/src/components/admin/EventRow.jsx`
- `gmt3_front/src/components/ui/ImagePreview.jsx`
- `gmt3_front/src/pages/Admin/Dashboard.jsx`
- `README.md`

## Summary of What Works
- Le champ `Publier immédiatement` du formulaire admin est maintenant présenté comme un switch accessible tout en conservant l'envoi `estPublie`.
- Le bouton de fermeture de l'aperçu image garde la même structure, avec une ombre flottante plus lisible et un état focus accessible.
- L'aperçu plein écran des images admin n'utilise plus le mode CORS forcé qui bloquait les images servies par le backend local.
- Le clic dans l'image preview ne ferme plus immédiatement la modale par propagation.
- Un message explicite apparaît si l'image preview ne peut pas être chargée.
- Les champs date du formulaire admin utilisent maintenant la date du jour par défaut lors de la création.
- Les champs heure du formulaire admin utilisent maintenant l'heure courante par défaut lors de la création.
- La date envoyée au backend pour `dateEvenement` reprend la date de départ si aucun champ dédié n'est présent.
- Les valeurs HTML restent aux formats attendus `yyyy-mm-dd` et `HH:mm`.

## Remaining Bugs
- Aucun bug fonctionnel identifié sur cette passe.

## Next Step
- Valider la création d'un événement depuis l'interface admin dans le navigateur.
