import { useState } from 'preact/hooks';

/**
 * Div `background-image` (pattern utilisé partout sur le site pour les cartes/hero)
 * avec flou progressif à la Facebook. Une <img> cachée détecte la fin du
 * chargement réel puisque `background-image` n'émet pas d'événement `load`.
 */
export function BlurBackgroundImage({ src, class: className = '', alt = '', decorative = true }) {
	const [loaded, setLoaded] = useState(false);
	if (!src) return null;

	// Si l'image est déjà en cache, le navigateur peut avoir déclenché `load`
	// avant que Preact n'attache le handler (hydratation) — on vérifie `.complete`
	// via le ref callback pour ne pas rester bloqué flouté indéfiniment.
	const checkComplete = (el) => {
		if (el && el.complete) setLoaded(true);
	};

	return (
		<>
			<img ref={checkComplete} src={src} alt={alt} aria-hidden={decorative ? 'true' : undefined} class="hidden" onLoad={() => setLoaded(true)} />
			<div
				class={`bg-cover bg-center transition-all duration-700 ${loaded ? 'blur-0 scale-100' : 'blur-lg scale-105'} ${className}`}
				style={`background-image: url('${src}');`}
			/>
		</>
	);
}
