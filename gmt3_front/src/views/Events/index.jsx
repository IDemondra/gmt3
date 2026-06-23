import { useEffect, useState } from 'preact/hooks';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { TourCard } from '../../components/ui/TourCard.jsx';
import { Footer } from '../../components/Footer.jsx';
import { formatDateFr, isDateInFuture } from '../../utils/dateFormatter.js';
import { parseMarkdownInline } from '../../utils/markdown.js';
import { StarRating } from '../../components/ui/StarRating.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND = API_BASE.replace(/\/api$/, '');

function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

export function Events() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE}/evenements`, { credentials: 'include' })
			.then((r) => r.json())
			.then((response) => {
				const published = (Array.isArray(response.data) ? response.data : [])
					.filter((e) => e.estPublie);
				setEvents(published);
			})
			.catch((err) => {
				console.error('Events fetch error:', err);
				setEvents([]);
			})
			.finally(() => setLoading(false));
	}, []);

	const futureEvents = events.filter((e) => isDateInFuture(e.dateDepart || e.dateEvenement));
	const pastEventsWithPhotos = events
		.filter((e) => !isDateInFuture(e.dateDepart || e.dateEvenement) && (e.photosEvenement || []).length > 0);

	const transformEvent = (event) => ({
		id: event.id,
		title: event.titre,
		description: parseMarkdownInline(event.description),
		image: event.imagePrincipale ? resolveImg(event.imagePrincipale) : '',
		date: event.dateDepart || event.dateEvenement || '—',
		badge: 'EXPEDITION',
		slug: event.id,
		href: `/events/${event.id}`
	});

	return (
		<>
		<main class="flex-grow flex flex-col pb-section-gap">
			{/* ── Hero ── */}
			<section class="relative overflow-hidden bg-on-secondary-fixed pt-32 pb-24 md:pt-36 md:pb-28">
				{/* Dot grid */}
				<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
					style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 30px 30px;" />

				{/* Ambient glows */}
				<div class="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
				<div class="absolute bottom-[-5rem] right-[-4rem] h-80 w-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

				{/* Scan lines */}
				<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
				<div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />


				{/* Decorative vertical line */}
				<div class="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none hidden lg:block" />

				{/* Big decorative icon */}
				<div class="absolute right-10 bottom-0 opacity-[0.03] pointer-events-none hidden xl:block">
					<span class="material-symbols-outlined text-white" style="font-size: 300px; line-height:1;">calendar_month</span>
				</div>

				<div class="relative z-10 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
					<div class="grid lg:grid-cols-[1fr_auto] items-end gap-10">
						<div>
							<Reveal animation="fadeUp" duration={760}>
								<div class="flex items-center gap-3 mb-6">
									<div class="h-px w-10 bg-primary/50" />
									<span class="font-label-caps text-[10px] tracking-[0.3em] text-primary font-bold uppercase">Calendrier Terrain</span>
								</div>
							</Reveal>
							<Reveal animation="arc" delay={60} duration={820}>
								<h1 class="font-h2 text-h2 md:text-6xl text-white font-black uppercase tracking-tighter leading-none mb-6">
									Prochaines <br /><span class="text-primary">Expéditions</span>
								</h1>
							</Reveal>
							<Reveal animation="fadeUp" delay={120} duration={760}>
								<p class="font-body-lg text-white/50 max-w-xl leading-relaxed">
									Dates fermes, groupes restreints, logistique sans faille. Choisissez votre mission et réservez votre place.
								</p>
							</Reveal>
						</div>

						<Reveal animation="fadeLeft" delay={200} duration={700}>
							<div class="hidden lg:flex flex-col items-end gap-3 border-l border-white/10 pl-10">
								<div class="flex flex-col items-end gap-1">
									<span class="font-mono text-[9px] text-white/20 tracking-widest uppercase">{!loading ? futureEvents.length : "..."} missions disponibles</span>
									<span class="font-mono text-[9px] text-primary tracking-widest font-bold uppercase">Réservation ouverte</span>
								</div>
								<a
									href="/#contact"
									class="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-full font-button text-[10px] tracking-widest font-black uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
								>
									DEMANDER UN DEVIS
									<span class="material-symbols-outlined text-sm">north_east</span>
								</a>
							</div>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ── Grid Events ── */}
			<section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mt-12">
				{loading && (
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter xl:gap-8">
						<div class="py-24 text-center col-span-1 md:col-span-2 xl:col-span-3">
							<div class="inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 mb-6">
								<span class="material-symbols-outlined text-3xl text-primary">hourglass_empty</span>
							</div>
							<p class="font-h3 text-xl text-on-background/40 uppercase tracking-tight">Chargement des expéditions...</p>
						</div>
					</div>
				)}

				{!loading && futureEvents.length === 0 && (
					<div class="py-24 text-center">
						<div class="inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 mb-6">
							<span class="material-symbols-outlined text-3xl text-primary">event_busy</span>
						</div>
						<p class="font-h3 text-xl text-on-background/40 uppercase tracking-tight">Aucune expédition planifiée</p>
						<p class="mt-2 font-mono text-[10px] text-on-background/20 tracking-widest uppercase">Revenez bientôt — nouvelles missions en cours</p>
					</div>
				)}

				{!loading && futureEvents.length > 0 && (
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter xl:gap-8">
						{futureEvents.map((event, i) => {
							const card = transformEvent(event);
							return (
								<Reveal key={card.id} animation={i % 2 === 0 ? 'driftLeft' : 'driftRight'} delay={i * 80} duration={820}>
									<TourCard {...card} />
								</Reveal>
							);
						})}
					</div>
				)}
			</section>

			{/* ── Preuves de Terrain ── */}
			{!loading && pastEventsWithPhotos.length > 0 && (
				<section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mt-24 pt-16 border-t border-white/10">
					<Reveal animation="fadeUp" duration={760}>
						<div class="flex items-center gap-3 mb-6">
							<div class="h-px w-10 bg-primary/50" />
							<span class="font-label-caps text-[10px] tracking-[0.3em] text-primary font-bold uppercase">Galerie Terrain</span>
						</div>
					</Reveal>
					<Reveal animation="arc" delay={60} duration={820}>
						<h2 class="font-h2 text-h2 md:text-6xl text-white font-black uppercase tracking-tighter leading-none mb-6">
							Preuves de <br /><span class="text-primary">Terrain</span>
						</h2>
					</Reveal>
					<Reveal animation="fadeUp" delay={120} duration={760}>
						<p class="font-body-lg text-white/50 max-w-xl leading-relaxed mb-12">
							Moments capturés lors de nos expéditions passées. L'authenticité de nos missions, sans filtre.
						</p>
					</Reveal>

					<div class="space-y-16">
						{pastEventsWithPhotos.map((event) => {
							const photos = (event.photosEvenement || []).map((p) => resolveImg(p.url));
							return (
								<div key={event.id} class="space-y-4">
									<div class="flex flex-wrap items-center gap-3 mb-4">
										<h3 class="font-h3 text-h3 text-white font-black uppercase">{event.titre}</h3>
										<span class="rounded-full border border-white/20 bg-white/8 px-3 py-1 font-mono text-[10px] text-white/60">
											{formatDateFr(event.dateDepart || event.dateEvenement)}
										</span>
										{event.nombreAvis > 0 && (
											<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1">
												<StarRating value={event.noteMoyenne} size="text-[13px]" />
												<span class="font-mono text-[10px] text-amber-200/80">{event.noteMoyenne} ({event.nombreAvis})</span>
											</span>
										)}
									</div>
									<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
										{photos.map((photo, idx) => (
											<Reveal key={`${event.id}-photo-${idx}`} animation="fadeUp" delay={idx * 40} duration={600}>
												<a
													href={photo}
													target="_blank"
													rel="noopener noreferrer"
													class="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50"
												>
													<img
														src={photo}
														alt={`${event.titre} photo ${idx + 1}`}
														class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
														loading="lazy"
														referrerPolicy="no-referrer"
													/>
													<div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
												</a>
											</Reveal>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</section>
			)}
		</main>
		<Footer />
		</>
	);
}

