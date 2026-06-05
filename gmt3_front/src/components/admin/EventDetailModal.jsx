const BACKEND = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function resolveUrl(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('/google-img/') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

function formatDate(value) {
	if (!value || typeof value !== 'string') return '—';
	if (!value.includes('-')) return value;
	return value.split('-').reverse().join('/');
}

/**
 * @param {{
 *   open: boolean;
 *   loading?: boolean;
 *   error?: string | null;
 *   event: any;
 *   onClose: () => void;
 *   onPreviewImage?: (image: { url: string; title: string }) => void;
 *   onEdit?: () => void;
 * }} props
 */
export function EventDetailModal({ open, loading = false, error = null, event, onClose, onPreviewImage, onEdit }) {
	if (!open) return null;

	const photos = Array.isArray(event?.photosEvenement) ? event.photosEvenement : [];

	return (
		<div class="fixed inset-0 z-[120] flex items-center justify-center p-4">
			<div class="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />
			<div class="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border border-outline-variant/30 bg-surface shadow-2xl">
				<div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-outline-variant/20 bg-surface/95 px-6 py-5 backdrop-blur">
					<div>
						<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Détail de l’événement</p>
						<h3 class="mt-2 font-h3 text-h3 font-black uppercase tracking-tight text-on-background">
							{loading ? 'Chargement…' : event?.titre || event?.title || 'Événement'}
						</h3>
					</div>
					<div class="flex items-center gap-2">
						{onEdit && (
							<button
								type="button"
								onClick={onEdit}
								class="inline-flex items-center gap-2 rounded-xl border border-outline-variant/30 px-4 py-2 font-button text-button text-primary transition-all hover:bg-primary/5"
							>
								<span class="material-symbols-outlined text-[18px]">edit</span>
								Modifier
							</button>
						)}
						<button
							type="button"
							onClick={onClose}
							class="grid h-10 w-10 place-items-center rounded-xl border border-outline-variant/30 text-secondary transition-all hover:bg-surface-container hover:text-on-background"
							aria-label="Fermer"
						>
							<span class="material-symbols-outlined text-[20px]">close</span>
						</button>
					</div>
				</div>

				<div class="px-6 py-6">
					{error ? (
						<div class="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
							<p class="font-body-md text-body-md font-semibold">{error}</p>
						</div>
					) : loading ? (
						<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
							{Array.from({ length: 4 }).map((_, index) => (
								<div key={index} class="h-28 animate-pulse rounded-2xl bg-surface-container" />
							))}
						</div>
					) : event ? (
						<div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
							<section class="space-y-6">
								<div class="overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container shadow-sm">
									<div class="aspect-[16/9] bg-black/5">
										{event.imagePrincipale ? (
											<img
												src={resolveUrl(event.imagePrincipale)}
												alt={event.titre || event.title || ''}
												class="h-full w-full object-cover"
												loading="lazy"
												referrerPolicy="no-referrer"
											/>
										) : (
											<div class="flex h-full items-center justify-center">
												<span class="material-symbols-outlined text-6xl text-secondary/40">image</span>
											</div>
										)}
									</div>
									<div class="flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/20 px-5 py-4">
										<div class="flex flex-wrap items-center gap-2">
											<span class="rounded-full bg-primary-container px-3 py-1.5 font-label-caps text-label-caps text-on-primary">
												{event.estPublie || event.published ? 'Publié' : 'Brouillon'}
											</span>
											<span class="rounded-full border border-outline-variant/30 px-3 py-1.5 font-label-caps text-label-caps text-secondary">
												ID #{event.id}
											</span>
										</div>
										<p class="font-body-md text-body-md text-secondary">
											{formatDate(event.dateCreation || event.dateEvenement || event.date)}
										</p>
									</div>
								</div>

								<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									<div class="rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-4">
										<p class="font-label-caps text-label-caps text-secondary">Lieu</p>
										<p class="mt-2 font-body-md text-body-md font-semibold text-on-background">{event.lieu || '—'}</p>
									</div>
									<div class="rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-4">
										<p class="font-label-caps text-label-caps text-secondary">Prix</p>
										<p class="mt-2 font-body-md text-body-md font-semibold text-on-background">{event.prix ? `${Number(event.prix).toLocaleString()} Ar` : '—'}</p>
									</div>
									<div class="rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-4">
										<p class="font-label-caps text-label-caps text-secondary">Départ</p>
										<p class="mt-2 font-body-md text-body-md font-semibold text-on-background">
											{formatDate(event.dateDepart || event.dateEvenement || event.date)}
											{event.heureDepart ? ` ${event.heureDepart}` : ''}
										</p>
									</div>
									<div class="rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-4">
										<p class="font-label-caps text-label-caps text-secondary">Retour</p>
										<p class="mt-2 font-body-md text-body-md font-semibold text-on-background">
											{formatDate(event.dateRetour)}
											{event.heureRetour ? ` ${event.heureRetour}` : ''}
										</p>
									</div>
								</div>

								<div class="rounded-3xl border border-outline-variant/30 bg-surface-container/30 p-5">
									<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Description</p>
									<p class="mt-3 font-body-md text-body-md leading-relaxed text-on-background/85">
										{event.description || '—'}
									</p>
								</div>
							</section>

							<section class="space-y-4">
								<div class="flex items-end justify-between gap-3">
									<div>
										<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Galerie</p>
										<h4 class="mt-2 font-h3 text-h3 font-black uppercase tracking-tight text-on-background">
											{photos.length} photo{photos.length > 1 ? 's' : ''}
										</h4>
									</div>
									{photos.length > 0 && (
										<span class="rounded-full border border-outline-variant/30 px-3 py-1.5 font-label-caps text-label-caps text-secondary">
											Clique pour agrandir
										</span>
									)}
								</div>

								<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
									{photos.length > 0 ? photos.map((photo, index) => (
										<button
											key={photo.id || `${photo.url}-${index}`}
											type="button"
											class="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
											onClick={() => onPreviewImage?.({ url: resolveUrl(photo.url), title: `${event.titre || event.title || 'Événement'} - photo ${index + 1}` })}
										>
											<img
												src={resolveUrl(photo.url)}
												alt={photo.legende || `${event.titre || event.title || 'Événement'} ${index + 1}`}
												class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading="lazy"
												referrerPolicy="no-referrer"
											/>
											<div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
											{photo.ordre != null && (
												<div class="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[11px] font-semibold text-white">
													{photo.ordre}
												</div>
											)}
										</button>
									)) : (
										<div class="col-span-full rounded-2xl border border-outline-variant/30 bg-surface-container/40 p-6 text-center text-secondary">
											Aucune photo de galerie disponible.
										</div>
									)}
								</div>
							</section>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
