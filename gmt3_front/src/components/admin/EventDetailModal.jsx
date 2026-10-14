import { formatIsoDateFr } from '../../utils/dateFormatter.js';

const INLINE_MD = /(\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_)/g;
function InlineMd({ text }) {
	const occ = new Map();
	return String(text || '').split(INLINE_MD).map((part, idx) => {
		const c = occ.get(part) || 0;
		occ.set(part, c + 1);
		const key = `${idx}-${c}`;
		if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
		if (part.startsWith('__') && part.endsWith('__')) return <strong key={key}>{part.slice(2, -2)}</strong>;
		if (part.startsWith('~~') && part.endsWith('~~')) return <del key={key}>{part.slice(2, -2)}</del>;
		if (part.startsWith('*') && part.endsWith('*')) return <em key={key}>{part.slice(1, -1)}</em>;
		if (part.startsWith('_') && part.endsWith('_')) return <em key={key}>{part.slice(1, -1)}</em>;
		return <span key={key}>{part}</span>;
	});
}

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

function resolveUrl(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('/google-img/') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

function photoLabel(event, index) {
	return `${event.titre || event.title || 'Événement'} - photo ${index + 1}`;
}
function eventTitle(event) {
	return event?.titre || event?.title || 'Événement';
}

function publishedLabel(event) {
	return (event?.estPublie || event?.published) ? 'Publié' : 'Brouillon';
}

function photoCountLabel(count) {
	return count === 1 ? 'photo' : 'photos';
}


function EventDetailLoaded({ event, onPreviewImage }) {
	const photos = Array.isArray(event?.photosEvenement) ? event.photosEvenement : [];
	return (
		<div class="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
			<section class="space-y-6">
				<div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
					<div class="aspect-[16/9] bg-gray-50">
						{event.imagePrincipale ? (
							<img
								src={resolveUrl(event.imagePrincipale)}
								alt={eventTitle(event)}
								class="h-full w-full object-cover"
								loading="lazy"
								referrerPolicy="no-referrer"
							/>
						) : (
							<div class="flex h-full items-center justify-center">
								<span class="material-symbols-outlined text-6xl text-gray-300">image</span>
							</div>
						)}
					</div>
					<div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 px-6 py-4">
						<div class="flex flex-wrap items-center gap-2">
							<span class="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary uppercase">
								{publishedLabel(event)}
							</span>
							<span class="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-bold text-gray-500 uppercase">
								ID #{event.id}
							</span>
						</div>
						<p class="text-sm text-gray-500 font-medium">
							{formatIsoDateFr(event.dateCreation || event.dateEvenement || event.date)}
						</p>
					</div>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{[
						{ label: 'Lieu', value: event.lieu || '—' },
						{ label: 'Difficulté', value: event.difficulte || '—' },
						{ label: 'Prix', value: event.prix ? `${Number(event.prix).toLocaleString()} Ar` : '—' },
						{ label: 'Départ', value: `${formatIsoDateFr(event.dateDepart || event.dateEvenement || event.date)} ${event.heureDepart || ''}` },
						{ label: 'Retour', value: `${formatIsoDateFr(event.dateRetour)} ${event.heureRetour || ''}` },
					].map((item) => (
						<div key={item.label} class="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
							<p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</p>
							<p class="mt-2 text-sm font-semibold text-gray-900">{item.value}</p>
						</div>
					))}
				</div>

				<div class="rounded-xl border border-gray-100 bg-gray-50/30 p-6">
					<p class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Description</p>
					<div class="mt-3 text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none whitespace-pre-line">
						{event.description ? <InlineMd text={event.description} /> : '—'}
					</div>
				</div>
			</section>

			<section class="space-y-4">
				<div class="flex items-end justify-between gap-3">
					<div>
						<p class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Galerie</p>
						<h4 class="mt-2 text-lg font-bold text-gray-900">
							{photos.length} {photoCountLabel(photos.length)}
						</h4>
					</div>
					{photos.length > 0 && (
						<span class="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-bold text-gray-500 uppercase">
							Clique pour agrandir
						</span>
					)}
				</div>

				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
					{photos.length > 0 ? photos.map((photo, index) => (
						<button
							key={photo.id || photo.url}
							type="button"
							class="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-100 bg-gray-100 shadow-sm transition-all hover:shadow-md"
							onClick={() => onPreviewImage?.({ url: resolveUrl(photo.url), title: photoLabel(event, index) })}
						>
							<img
								src={resolveUrl(photo.url)}
								alt={photo.legende || `${eventTitle(event)} ${index + 1}`}
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
								referrerPolicy="no-referrer"
							/>
						</button>
					)) : (
						<div class="col-span-full rounded-lg border border-gray-100 bg-gray-50 p-6 text-center text-gray-500 text-sm">
							Aucune photo disponible.
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

function EventDetailBody({ loading, error, event, onPreviewImage }) {
	if (error) {
		return (
			<div class="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">
				<p class="text-sm font-semibold">{error}</p>
			</div>
		);
	}
	if (loading) {
		return (
			<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} class="h-28 animate-pulse rounded-lg bg-gray-100" />
				))}
			</div>
		);
	}
	if (!event) return null;
	return <EventDetailLoaded event={event} onPreviewImage={onPreviewImage} />;
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

	return (
		<div class="fixed inset-0 z-[120] flex items-center justify-center p-4">
			<button type="button" aria-label="Fermer la fenêtre" class="absolute inset-0 border-0 bg-gray-900/20 p-0 backdrop-blur-sm" onClick={onClose} />
			<div class="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-xl bg-white shadow-xl border border-gray-100">
				<div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-50 bg-white/95 px-8 py-6 backdrop-blur">
					<div>
						<p class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Détail de l’événement</p>
						<h3 class="mt-2 text-2xl font-extrabold text-gray-900 tracking-tight">
							{loading ? 'Chargement…' : event?.titre || event?.title || 'Événement'}
						</h3>
					</div>
					<div class="flex items-center gap-2">
						{onEdit && (
							<button
								type="button"
								onClick={onEdit}
								class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all"
							>
								<span class="material-symbols-outlined text-[18px]">edit</span>
								Modifier
							</button>
						)}
						<button
							type="button"
							onClick={onClose}
							class="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
							aria-label="Fermer"
						>
							<span class="material-symbols-outlined text-[20px]">close</span>
						</button>
					</div>
				</div>

				<div class="px-8 py-8">
					<EventDetailBody loading={loading} error={error} event={event} onPreviewImage={onPreviewImage} />
				</div>
			</div>
		</div>
	);
}
