import { useState } from 'preact/hooks';

/**
 * Remplacement direct de <img> avec flou progressif à la Facebook : l'image
 * démarre floutée/zoomée puis se lève en fondu une fois réellement chargée.
 * Toutes les autres props (alt, loading, class, etc.) sont transmises telles quelles.
 */
export function BlurImg({ class: className = '', ...props }) {
	const [loaded, setLoaded] = useState(false);

	// Si l'image est déjà en cache, le navigateur peut avoir déclenché `load`
	// avant que Preact n'attache le handler (hydratation) — on vérifie `.complete`
	// via le ref callback pour ne pas rester bloqué flouté indéfiniment.
	const checkComplete = (el) => {
		if (el && el.complete) setLoaded(true);
	};

	return (
		<img
			{...props}
			ref={checkComplete}
			class={`transition-all duration-700 ${loaded ? 'blur-0 scale-100' : 'blur-lg scale-105'} ${className}`}
			onLoad={(e) => {
				setLoaded(true);
				props.onLoad?.(e);
			}}
		/>
	);
}
