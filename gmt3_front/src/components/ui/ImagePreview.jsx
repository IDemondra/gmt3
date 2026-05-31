import { useEffect, useState } from 'preact/hooks';

const BACKEND = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/** Resolve relative upload paths to the backend * */
function resolveUrl(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('/google-img/') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

/**
 * ImagePreview — composant réutilisable d'aperçu plein écran.
 *
 * Props:
 *   image  : { url: string; title?: string } | null  — l'image à afficher
 *   onClose: () => void                               — callback de fermeture
 *
 * Usage:
 *   const [preview, setPreview] = useState(null);
 *   <ImagePreview image={preview} onClose={() => setPreview(null)} />
 *   <button onClick={() => setPreview({ url: '...', title: '...' })}>Voir</button>
 */
export function ImagePreview({ image, onClose }) {
	const [hasError, setHasError] = useState(false);
	const imageUrl = image ? resolveUrl(image.url) : '';

	useEffect(() => {
		setHasError(false);
	}, [imageUrl]);

	if (!image) return null;

	return (
		<div
			class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-zoom-out"
			onClick={onClose}
		>
			<div class="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					onClick={onClose}
					class="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-surface shadow-lg border border-outline-variant/30 hover:bg-surface-container transition-all"
				>
					<span class="material-symbols-outlined text-[20px]">close</span>
				</button>
				{hasError ? (
					<div class="max-w-full rounded-2xl bg-surface p-6 text-center shadow-2xl border border-outline-variant/30">
						<p class="font-body-md text-body-md text-on-background font-semibold">Image indisponible</p>
						<p class="mt-2 text-sm text-secondary break-all">{imageUrl}</p>
					</div>
				) : (
					<img
						src={imageUrl}
						alt={image.title || ''}
						class="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
						referrerPolicy="no-referrer"
						onError={() => setHasError(true)}
					/>
				)}
			</div>
		</div>
	);
}
