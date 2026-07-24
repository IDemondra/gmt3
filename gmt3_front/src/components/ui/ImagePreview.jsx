import { useState } from 'preact/hooks';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

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
 *   image     : { url: string; title?: string } | null  — l'image à afficher
 *   onClose   : () => void                               — callback de fermeture
 *   onNext    : () => void                               — callback pour image suivante
 *   onPrev    : () => void                               — callback pour image précédente
 *   hasNext   : boolean                                  — si prochaine image existe
 *   hasPrev   : boolean                                  — si image précédente existe
 *
 * Usage:
 *   const [preview, setPreview] = useState(null);
 *   <ImagePreview image={preview} onClose={() => setPreview(null)} />
 *   <button onClick={() => setPreview({ url: '...', title: '...' })}>Voir</button>
 */
export function ImagePreview({ image, onClose, onNext, onPrev, hasNext = false, hasPrev = false }) {
	const [hasError, setHasError] = useState(false);
	const imageUrl = image ? resolveUrl(image.url) : '';

	if (!image) return null;

	return (
		<div
			class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-zoom-out"
			onClick={onClose}
		>
			<div class="relative max-w-3xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
				{hasPrev && (
					<button
						type="button"
						onClick={onPrev}
						aria-label="Image précédente"
						class="absolute left-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/45 bg-surface/90 text-on-background shadow-[0_18px_45px_rgba(0,0,0,0.35),0_4px_12px_rgba(255,255,255,0.18)_inset] ring-1 ring-black/10 backdrop-blur-md transition-all duration-200 hover:-translate-x-0.5 hover:scale-105 hover:bg-white hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_4px_14px_rgba(255,255,255,0.28)_inset] focus:outline-none focus:ring-2 focus:ring-primary-container/70 active:translate-x-0 active:scale-95"
					>
						<span class="material-symbols-outlined text-[20px]">chevron_left</span>
					</button>
				)}
				{hasNext && (
					<button
						type="button"
						onClick={onNext}
						aria-label="Image suivante"
						class="absolute right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/45 bg-surface/90 text-on-background shadow-[0_18px_45px_rgba(0,0,0,0.35),0_4px_12px_rgba(255,255,255,0.18)_inset] ring-1 ring-black/10 backdrop-blur-md transition-all duration-200 hover:translate-x-0.5 hover:scale-105 hover:bg-white hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_4px_14px_rgba(255,255,255,0.28)_inset] focus:outline-none focus:ring-2 focus:ring-primary-container/70 active:translate-x-0 active:scale-95"
					>
						<span class="material-symbols-outlined text-[20px]">chevron_right</span>
					</button>
				)}
				<button
					type="button"
					onClick={onClose}
					aria-label="Fermer l'aperçu"
					class="absolute -top-4 -right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/45 bg-surface/90 text-on-background shadow-[0_18px_45px_rgba(0,0,0,0.35),0_4px_12px_rgba(255,255,255,0.18)_inset] ring-1 ring-black/10 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-white hover:shadow-[0_24px_60px_rgba(0,0,0,0.45),0_4px_14px_rgba(255,255,255,0.28)_inset] focus:outline-none focus:ring-2 focus:ring-primary-container/70 active:translate-y-0 active:scale-95"
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
						onLoad={() => setHasError(false)}
						onError={() => setHasError(true)}
					/>
				)}
			</div>
		</div>
	);
}
