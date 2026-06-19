import { useEffect, useState } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { parseMarkdownInline } from '../../../utils/markdown.js';
import { formatDateFr } from '../../../utils/dateFormatter.js';

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
					.filter((e) => e.estPublie)
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
			{/* Transition dark → light */}
			<div class="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#1c1b1b] via-[#1c1b1b]/70 via-40% to-transparent pointer-events-none z-10" />
			<div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#ba0013]/5 to-transparent pointer-events-none z-10" />

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
							<div class="flex items-center gap-3 mb-6">
								<div class="h-2 w-2 rounded-full bg-primary" />
								<span class="font-label-caps text-label-caps tracking-[0.3em] text-on-background/70 font-bold uppercase">Chronologie Terrain</span>
							</div>
							<h2 class="font-h2 text-h2 md:text-6xl text-on-background font-black uppercase tracking-tighter leading-none">
								Prochains <br /> <span class="text-primary">Événements</span>
							</h2>
							<p class="mt-8 font-body-lg text-on-background font-medium leading-relaxed">
								Suivez le fil de nos prochaines incursions. Des dates fermes, des groupes restreints et une logistique sans faille pour une immersion totale.
							</p>
						</Reveal>
					</div>

					<Reveal animation="fadeLeft">
						<a href="/events" class="group flex items-center gap-4 px-8 py-4 rounded-full border border-outline-variant bg-white shadow-sm hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-500">
							<span class="font-button text-xs tracking-widest font-bold">CALENDRIER COMPLET</span>
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
						<p class="mt-2 font-mono text-[10px] text-on-background/20 tracking-widest uppercase">Revenez bientôt — nouvelles missions en cours</p>
					</div>
				)}

				{/* ── Vertical Timeline ── */}
				{!loading && events.length > 0 && (
					<div class="relative">
						<div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent md:-translate-x-1/2" />

						<div class="space-y-24 relative">
							{events.map((event, i) => {
								const imgUrl = resolveImg(event.imagePrincipale);
								const date = formatDateFr(event.dateDepart || event.dateEvenement) || '—';
								const prix = formatPrix(event.prix);

								return (
									<Reveal key={event.id} animation={i % 2 === 0 ? 'fadeRight' : 'fadeLeft'} delay={i * 100}>
										<div class={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

											{/* Photo */}
											<div class="w-full md:w-1/2">
												<div class="group relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
													{imgUrl ? (
														<div
															class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
															style={`background-image: url('${imgUrl}')`}
														/>
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
												</div>
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
														CONSULTER LA FICHE MISSION
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

				{/* ── CTA Expéditions Personnalisées ── */}
				<div class="mt-24 relative overflow-hidden rounded-3xl bg-on-secondary-fixed isolate min-h-[280px] flex items-center">
					<div class="absolute inset-0 z-0 pointer-events-none">
						<div class="absolute inset-0 bg-gradient-to-r from-on-secondary-fixed via-on-secondary-fixed/95 to-on-secondary-fixed/80" />
						<div class="absolute right-0 top-0 bottom-0 w-2/5 bg-primary/10" style="clip-path: polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)" />
						<div class="absolute right-0 top-0 bottom-0 w-1/4 bg-primary/5" style="clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)" />
					</div>
					<div class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
						style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 28px 28px;" />
					<div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-10" />
					<div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
					<div class="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block opacity-[0.04]">
						<span class="material-symbols-outlined text-white" style="font-size: 200px; line-height: 1;">explore</span>
					</div>
					<div class="absolute top-4 right-6 z-20 hidden md:flex flex-col items-end gap-1">
						<span class="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase">GMT3 / CUSTOM-OPS</span>
						<span class="font-mono text-[8px] text-primary tracking-widest font-bold">STATUS: OPEN</span>
					</div>

					<div class="relative z-20 w-full p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
						<div class="max-w-xl">
							<div class="flex items-center gap-3 mb-5">
								<div class="h-px w-8 bg-primary/60" />
								<span class="font-label-caps text-[10px] tracking-[0.3em] text-primary font-bold uppercase">Mission sur mesure</span>
							</div>
							<h4 class="font-h2 text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
								Expéditions<br /><span class="text-primary">Personnalisées</span>
							</h4>
							<p class="font-body-md text-white/50 leading-relaxed max-w-md">
								Nos équipes terrain calibrent un itinéraire spécifique pour votre groupe ou projet — logistique, dates, difficulté.
							</p>
							<div class="mt-5 flex items-center gap-4 text-white/20">
								<span class="font-mono text-[9px] tracking-widest uppercase">S 18.91° / E 47.53°</span>
								<div class="h-px w-8 bg-white/10" />
								<span class="font-mono text-[9px] tracking-widest uppercase">Madagascar</span>
							</div>
						</div>

						<div class="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 shrink-0">
							<a
								href="#contact"
								class="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-button text-xs tracking-[0.2em] font-bold uppercase rounded-full overflow-hidden shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
							>
								<span class="relative z-10 flex items-center gap-3">
									DEMANDER UN DEVIS
									<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">north_east</span>
								</span>
								<div class="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
							</a>
							<a
								href="/events"
								class="inline-flex items-center gap-2 px-6 py-4 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-button text-xs tracking-[0.2em] font-bold uppercase rounded-full transition-all duration-300 cursor-pointer"
							>
								VOIR LE CATALOGUE
								<span class="material-symbols-outlined text-sm">arrow_forward</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}



