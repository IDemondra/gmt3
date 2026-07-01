import { useState } from 'preact/hooks';

/**
 * Remplacement direct de <img> avec flou progressif à la Facebook : l'image
 * démarre floutée/zoomée puis se lève en fondu une fois réellement chargée.
 * Toutes les autres props (alt, loading, class, etc.) sont transmises telles quelles.
 */
export function BlurImg({ class: className = '', ...props }) {
	const [loaded, setLoaded] = useState(false);
	return (
		<img
			{...props}
			class={`transition-all duration-700 ${loaded ? 'blur-0 scale-100' : 'blur-lg scale-105'} ${className}`}
			onLoad={(e) => {
				setLoaded(true);
				props.onLoad?.(e);
			}}
		/>
	);
}
