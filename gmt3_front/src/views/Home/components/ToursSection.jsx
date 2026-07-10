import { useEffect, useState } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { BlurBackgroundImage } from '../../../components/ui/BlurBackgroundImage.jsx';
import { parseMarkdownInline } from '../../../utils/markdown.js';
import { formatDateFr, isEventActive } from '../../../utils/dateFormatter.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND = API_BASE.replace(/\/api$/, '');

function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

function formatPrix(prix) {
	if (!prix) return null;
	return `${Number(prix).toLocaleString('fr-FR')} Ar`;
}

export function ToursSection() {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE}/evenements`, { credentials: 'include' })
			.then((r) => r.json())
			.then((response) => {
					const published = (Array.isArray(response.data) ? response.data : [])
					.filter((e) => e.estPublie && isEventActive(e.dateDepart, e.dateRetour, e.dateEvenement))
					.slice(0, 3);
				setEvents(published);
			})
			.catch((err) => {
				setEvents([]);
			})
			.finally(() => setLoading(false));
	}, []);

	return (
		<section class="relative overflow-hidden bg-[#faf9f6] py-section-gap" id="expeditions">
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			</div>

			{/* Technical Background */}
			<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
				style="background-image: radial-gradient(#1a1c1c 1px, transparent 1px); background-size: 20px 20px;" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop z-30">

				{/* ── Header ── */}
				<div class="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
					<div class="max-w-2xl">
						<Reveal animation="fadeUp">
							<h2 class="font-h2 text-h2 md:text-6xl text-on-background font-black uppercase tracking-tighter leading-none">
								Prochains <span class="text-primary">Événements</span>
							</h2>
							<p class="mt-8 font-body-lg text-on-background font-medium leading-relaxed">
									Choisissez une date ou racontez-nous votre projet. Nous construisons le bon itinéraire, au bon rythme.
							</p>
						</Reveal>
					</div>

					<Reveal animation="fadeLeft">
						<a href="/events" class="group flex items-center gap-4 px-8 py-4 rounded-full border border-outline-variant bg-white shadow-sm hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-500">
							<span class="font-button text-xs tracking-widest font-bold">VOIR TOUTES LES DATES</span>
							<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">calendar_month</span>
						</a>
					</Reveal>
				</div>

				{/* ── Loading ── */}
				{loading && (
					<div class="flex items-center justify-center py-24 gap-3">
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:0ms" />
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:150ms" />
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:300ms" />
					</div>
				)}

				{/* ── Empty state ── */}
				{!loading && events.length === 0 && (
					<div class="py-24 text-center">
						<div class="inline-flex h-20 w-20 items-center justify-center rounded-full border border-on-background/10 bg-on-background/5 mb-6">
							<span class="material-symbols-outlined text-3xl text-primary">event_busy</span>
						</div>
						<p class="font-h3 text-xl text-on-background/40 uppercase tracking-tight">Aucune expédition planifiée</p>
						<p class="mt-2 font-mono text-[10px] text-on-background/20 tracking-widest uppercase">Écrivez-nous pour créer un départ sur mesure</p>
					</div>
				)}

				{/* ── Vertical Timeline ── */}
				{!loading && events.length > 0 && (
					<div class="relative">
						<div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent md:-translate-x-1/2" />

						<div class="space-y-24 relative">
							{events.map((event, i) => {
								const imgUrl = resolveImg(event.imagePrincipale);
								const date = formatDateFr(event.dateDepart || event.dateEvenement) || 'Date à confirmer';
								const prix = formatPrix(event.prix);

								return (
									<Reveal key={event.id} animation={i % 2 === 0 ? 'fadeRight' : 'fadeLeft'} delay={i * 100}>
										<div class={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

											{/* Photo */}
											<div class="w-full md:w-1/2">
												<a href={`/events/${event.id}`} class="group block relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl border-4 border-white hover:shadow-2xl transition-shadow">
													{imgUrl ? (
														<BlurBackgroundImage src={imgUrl} class="absolute inset-0 group-hover:scale-110" />
													) : (
														<div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
															<span class="material-symbols-outlined text-6xl text-primary/30">landscape</span>
														</div>
													)}
													<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

													<div class="absolute top-4 right-4 flex flex-col items-end gap-2">
														<span class="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[9px] text-white font-bold tracking-widest rounded-sm">
															EVT-{String(event.id).padStart(4, '0')}
														</span>
														{prix && (
															<span class="bg-primary text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm shadow-lg">
																{prix}
															</span>
														)}
													</div>
												</a>
											</div>

											{/* Timeline node */}
											<div class="absolute left-4 md:left-1/2 h-10 w-10 rounded-full border-4 border-[#faf9f6] bg-white shadow-lg md:-translate-x-1/2 flex items-center justify-center z-10 transition-transform hover:scale-125 hover:rotate-45">
												<div class="h-3 w-3 rounded-full bg-primary" />
											</div>

											{/* Content */}
											<div class={`w-full md:w-1/2 text-left ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
												<div class={`flex flex-col ${i % 2 !== 0 ? 'md:items-end' : 'md:items-start'} gap-4`}>
													<span class="inline-flex items-center gap-2 font-label-caps text-[10px] tracking-[0.3em] text-primary font-bold">
														<span class="material-symbols-outlined text-sm">event</span>
														{date}
													</span>

													<h3 class="font-h2 text-2xl md:text-3xl font-black text-on-background uppercase tracking-tighter leading-tight max-w-sm">
														{event.titre}
													</h3>

													{event.lieu && (
														<div class={`flex items-center gap-3 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
															<span class="px-2 py-1 rounded bg-stone-100 text-[9px] font-bold text-secondary tracking-widest border border-stone-200 uppercase flex items-center gap-1">
																<span class="material-symbols-outlined text-[12px]">location_on</span>
																{event.lieu}
															</span>
														</div>
													)}

													{event.description && (
														<p class="font-body-md text-secondary leading-relaxed max-w-md line-clamp-3" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(event.description) }} />
													)}

													<a
														href={`/events/${event.id}`}
														class="mt-4 flex items-center gap-2 font-button text-xs tracking-widest text-on-background hover:text-primary transition-colors group"
													>
															DÉCOUVRIR L'EXPÉDITION
														<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">north_east</span>
													</a>
												</div>
											</div>
										</div>
									</Reveal>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
