import { useEffect, useState } from 'preact/hooks';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { Footer } from '../../components/Footer.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
import { StarRating } from '../../components/ui/StarRating.jsx';
import { isDateInFuture, formatDateFr } from '../../utils/dateFormatter.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND = API_BASE.replace(/\/api$/, '');

function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

export function Archives() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [preview, setPreview] = useState(null);
	const [flatPhotos, setFlatPhotos] = useState([]);
	const [previewIndex, setPreviewIndex] = useState(0);

	useEffect(() => {
		fetch(`${API_BASE}/evenements`, { credentials: 'include' })
			.then((r) => r.json())
			.then((response) => {
				const past = (Array.isArray(response.data) ? response.data : [])
					.filter((e) => e.estPublie && !isDateInFuture(e.dateDepart || e.dateEvenement) && (e.photosEvenement || []).length > 0);
				setEvents(past);
				// Index plat pour navigation lightbox
				const flat = [];
				for (const evt of past) {
					for (const photo of evt.photosEvenement) {
						flat.push({ url: resolveImg(photo.url), title: evt.titre });
					}
				}
				setFlatPhotos(flat);
			})
			.catch(() => setEvents([]))
			.finally(() => setLoading(false));
	}, []);

	const openPhoto = (url, title) => {
		const idx = flatPhotos.findIndex((p) => p.url === url);
		setPreviewIndex(idx < 0 ? 0 : idx);
		setPreview({ url, title });
	};

	const totalPhotos = flatPhotos.length;

	return (
		<>
			<main class="flex-grow flex flex-col pb-section-gap bg-on-secondary-fixed">
				{/* ── Hero ── */}
				<section class="relative overflow-hidden pt-32 pb-20 md:pt-36 md:pb-24">
					<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
						style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 30px 30px;" />
					<div class="absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-primary/12 blur-2xl pointer-events-none" />

					<div class="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
						<Reveal animation="fadeUp" duration={760}>
							<span class="inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] text-primary tracking-[0.2em] font-bold uppercase">
								[ System_Archives / Full_Access ]
							</span>
						</Reveal>
						<Reveal animation="arc" delay={60} duration={820}>
							<h1 class="mt-6 font-h2 text-h2 md:text-6xl text-white font-black uppercase tracking-tighter leading-none">
								Archives <br /><span class="text-primary">Complètes</span>
							</h1>
						</Reveal>
						<Reveal animation="fadeUp" delay={120} duration={760}>
							<p class="mt-8 max-w-xl font-body-lg text-white/50 leading-relaxed">
								L'intégralité de notre historique terrain. {!loading && `${events.length} expédition(s), ${totalPhotos} clichés bruts.`}
							</p>
						</Reveal>
						<Reveal animation="fadeUp" delay={180} duration={760}>
							<a href="/#gallery" class="mt-8 inline-flex items-center gap-2 font-button text-[10px] tracking-widest font-black uppercase text-white/60 hover:text-primary transition-colors">
								<span class="material-symbols-outlined text-sm">arrow_back</span>
								Retour à l'accueil
							</a>
						</Reveal>
					</div>
				</section>

				{/* ── Loading ── */}
				{loading && (
					<div class="flex items-center justify-center py-24 gap-3">
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:0ms" />
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:150ms" />
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:300ms" />
					</div>
				)}

				{/* ── Empty ── */}
				{!loading && events.length === 0 && (
					<div class="py-24 text-center px-margin-mobile">
						<div class="inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 mb-6">
							<span class="material-symbols-outlined text-3xl text-primary">image_not_supported</span>
						</div>
						<p class="font-h3 text-xl text-white/40 uppercase tracking-tight">Aucune archive pour le moment</p>
						<p class="mt-2 font-mono text-[10px] text-white/20 tracking-widest uppercase">Les expéditions passées apparaîtront ici</p>
					</div>
				)}

				{/* ── Galeries par événement ── */}
				{!loading && events.length > 0 && (
					<section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full space-y-20">
						{events.map((evt) => {
							const photos = (evt.photosEvenement || []).map((p) => resolveImg(p.url));
							return (
								<div key={evt.id} class="border-t border-white/10 pt-12">
									<div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
										<div>
											<div class="flex flex-wrap items-center gap-3">
												<h2 class="font-h2 text-3xl md:text-4xl text-white font-black uppercase tracking-tighter">{evt.titre}</h2>
												{evt.nombreAvis > 0 && (
													<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1">
														<StarRating value={evt.noteMoyenne} size="text-[13px]" />
														<span class="font-mono text-[10px] text-amber-200/80">{evt.noteMoyenne} ({evt.nombreAvis})</span>
													</span>
												)}
											</div>
											<div class="mt-3 flex flex-wrap items-center gap-4 font-mono text-[10px] text-white/40 tracking-widest uppercase">
												<span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">event</span>{formatDateFr(evt.dateDepart || evt.dateEvenement)}</span>
												{evt.lieu && <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">location_on</span>{evt.lieu}</span>}
												<span>{photos.length} clichés</span>
											</div>
										</div>
										<div class="flex items-center gap-4 shrink-0">
											<a href={`/events/${evt.id}#avis`} class="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-button text-[10px] tracking-widest font-black uppercase text-white hover:brightness-110 transition-all">
												<span class="material-symbols-outlined text-sm">rate_review</span> Laisser un avis
											</a>
											<a href={`/events/${evt.id}`} class="inline-flex items-center gap-2 font-button text-[10px] tracking-widest font-black uppercase text-primary hover:text-white transition-colors">
												Fiche mission <span class="material-symbols-outlined text-sm">north_east</span>
											</a>
										</div>
									</div>

									<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
										{photos.map((photo, idx) => (
											<Reveal key={`${evt.id}-${idx}`} animation="fadeUp" delay={idx * 30} duration={600}>
												<button
													type="button"
													onClick={() => openPhoto(photo, evt.titre)}
													class="group relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-stone-900 shadow-lg transition-all duration-300 hover:border-primary/40 cursor-pointer"
												>
													<img
														src={photo}
														alt={`${evt.titre} ${idx + 1}`}
														class="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
														loading="lazy"
														referrerPolicy="no-referrer"
													/>
													<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
														<span class="material-symbols-outlined text-white text-xl">zoom_in</span>
													</div>
												</button>
											</Reveal>
										))}
									</div>
								</div>
							);
						})}
					</section>
				)}
			</main>
			<Footer />
			<ImagePreview
				image={preview}
				onClose={() => setPreview(null)}
				onNext={() => {
					const next = (previewIndex + 1) % flatPhotos.length;
					setPreviewIndex(next);
					setPreview(flatPhotos[next]);
				}}
				onPrev={() => {
					const prev = (previewIndex - 1 + flatPhotos.length) % flatPhotos.length;
					setPreviewIndex(prev);
					setPreview(flatPhotos[prev]);
				}}
				hasNext={flatPhotos.length > 1}
				hasPrev={flatPhotos.length > 1}
			/>
		</>
	);
}
