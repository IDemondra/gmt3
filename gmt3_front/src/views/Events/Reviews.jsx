import { useEffect, useState } from 'preact/hooks';
import { BlurImg } from '../../components/ui/BlurImg.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
import { StarRating } from '../../components/ui/StarRating.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

export function EventReviews({ eventId }) {
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [preview, setPreview] = useState(null);

	useEffect(() => {
		const controller = new AbortController();
		fetch(`${API_BASE}/evenements/${eventId}`, { credentials: 'include', signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error('EVENT_NOT_FOUND');
				return response.json();
			})
			.then(setEvent)
			.catch((reason) => {
				if (reason.name !== 'AbortError') setError(true);
			})
			.finally(() => setLoading(false));
		return () => controller.abort();
	}, [eventId]);

	const reviews = Array.isArray(event?.avis) ? event.avis : [];

	return (
		<main class="flex-1 bg-background text-on-background">
			<section class="mx-auto w-full max-w-5xl px-margin-mobile pb-24 pt-32 md:px-margin-desktop">
				<a href={`/events/${eventId}`} class="inline-flex items-center gap-2 font-label-caps text-label-caps text-secondary transition-colors hover:text-primary">
					<span class="material-symbols-outlined text-[16px]">arrow_back</span>
					Retour à l’événement
				</a>

				{loading && <div class="py-24 text-center text-secondary">Chargement des avis...</div>}
				{!loading && error && (
					<div class="py-24 text-center">
						<h1 class="font-h2 text-3xl font-black uppercase">Événement introuvable</h1>
						<p class="mt-3 text-secondary">Impossible de charger cette liste d’avis.</p>
					</div>
				)}

				{!loading && !error && event && (
					<>
						<header class="mt-10 flex flex-col gap-6 border-b border-outline-variant/60 pb-8 md:flex-row md:items-end md:justify-between">
							<div>
								<p class="font-label-caps text-label-caps text-primary">Retours terrain</p>
								<h1 class="mt-3 font-h1 text-4xl font-black uppercase tracking-tight md:text-6xl">Avis de {event.titre}</h1>
							</div>
							{event.nombreAvis > 0 && (
								<div class="flex shrink-0 flex-col items-start gap-1 md:items-end">
									<div class="flex items-center gap-2">
										<span class="font-h2 text-3xl font-black">{event.noteMoyenne}</span>
										<StarRating value={event.noteMoyenne} size="text-[22px]" />
									</div>
									<span class="font-mono text-[10px] uppercase tracking-widest text-secondary">{event.nombreAvis} avis</span>
								</div>
							)}
						</header>

						{reviews.length === 0 ? (
							<div class="py-24 text-center">
								<span class="material-symbols-outlined text-5xl text-secondary/30">reviews</span>
								<p class="mt-3 text-secondary">Aucun avis publié pour le moment.</p>
							</div>
						) : (
							<div class="mt-10 grid gap-5 md:grid-cols-2">
								{reviews.map((review) => (
									<article key={review.id} class="rounded-2xl border border-outline-variant/60 bg-surface-container/50 p-6 shadow-sm">
										<div class="flex items-start justify-between gap-4">
											<div class="flex items-center gap-3">
												<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-black uppercase text-primary">{review.nom.charAt(0)}</div>
												<div>
													<p class="font-body-md font-bold leading-tight">{review.nom}</p>
													<StarRating value={review.note} size="text-[15px]" />
												</div>
											</div>
											<span class="font-mono text-[10px] text-secondary/70">{review.dateCreation}</span>
										</div>
										{review.commentaire && <p class="mt-4 leading-relaxed text-secondary">{review.commentaire}</p>}
										{review.photoUrl && (
											<button
												type="button"
												onClick={() => setPreview({ url: review.photoUrl, title: `Photo de ${review.nom}` })}
												aria-label={`Agrandir la photo de ${review.nom}`}
												class="group relative mt-4 block w-full cursor-zoom-in overflow-hidden rounded-xl"
											>
												<BlurImg src={`${BACKEND}${review.photoUrl}`} alt={`Photo de ${review.nom}`} class="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />
												<span class="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
													<span class="material-symbols-outlined text-3xl drop-shadow">zoom_in</span>
												</span>
											</button>
										)}
									</article>
								))}
							</div>
						)}
					</>
				)}
			</section>
			<ImagePreview image={preview} onClose={() => setPreview(null)} />
		</main>
	);
}
