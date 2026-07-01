import { useState } from 'preact/hooks';

/**
 * Div `background-image` (pattern utilisé partout sur le site pour les cartes/hero)
 * avec flou progressif à la Facebook. Une <img> cachée détecte la fin du
 * chargement réel puisque `background-image` n'émet pas d'événement `load`.
 */
export function BlurBackgroundImage({ src, class: className = '' }) {
	const [loaded, setLoaded] = useState(false);
	if (!src) return null;

	return (
		<>
			<img src={src} alt="" aria-hidden="true" class="hidden" onLoad={() => setLoaded(true)} />
			<div
				class={`bg-cover bg-center transition-all duration-700 ${loaded ? 'blur-0 scale-100' : 'blur-lg scale-105'} ${className}`}
				style={`background-image: url('${src}');`}
			/>
		</>
	);
}
