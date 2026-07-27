import { useState, useEffect } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { BlurBackgroundImage } from '../../../components/ui/BlurBackgroundImage.jsx';
import { img } from '../../../utils/images.js';
import { isEventPast } from '../../../utils/dateFormatter.js';
import { eventPath } from '../../../utils/eventUrl.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND = API_BASE.replace(/\/api$/, '');

function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

export function HeroSection() {
	const [photos, setPhotos] = useState([]);

	useEffect(() => {
		fetch(`${API_BASE}/evenements`, { credentials: 'include' })
			.then((r) => {
				if (!r.ok) throw new Error('Événements indisponibles');
				return r.json();
			})
			.then((response) => {
				const past = (Array.isArray(response.data) ? response.data : [])
					.filter((e) => e.estPublie && isEventPast(e.dateDepart, e.dateRetour, e.dateEvenement) && e.imagePrincipale);
				setPhotos(past.slice(0, 5));
			})
			.catch(() => {});
	}, []);

	return (
		<section class="relative min-h-[100dvh] w-full flex items-center bg-zinc-950 overflow-hidden">

			{/* Background — overlay intentionally light on the right to let the photo breathe */}
			<BlurBackgroundImage src={img('/assets/hero.jpg')} alt="Groupe de voyageurs GMT+3 au sommet, au-dessus des paysages de Fianarantsoa" decorative={false} class="absolute inset-0 z-0" />
			<div class="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950/96 via-zinc-950/75 lg:to-zinc-950/15 to-zinc-950/60" />
			<div class="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950/90 via-transparent to-zinc-950/50" />

			{/* Dot grid */}
			<div class="absolute inset-0 z-10 opacity-[0.025] pointer-events-none"
				style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 40px 40px;" />

			{/* ── Main content ── */}
			<div class="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-36 pb-24 lg:pt-0 lg:pb-0 lg:min-h-[100dvh] lg:flex lg:items-center">
				<div class="w-full lg:grid lg:grid-cols-[55fr_45fr] lg:gap-16 lg:items-center">

					{/* LEFT — Text block */}
					<div class="flex flex-col">

						{/* Eyebrow */}
						<Reveal animation="fadeUp" duration={700}>
							<div class="flex items-center gap-4 mb-10">
								<div class="h-px w-8 bg-primary" />
								<span class="font-label-caps text-[10px] tracking-[0.35em] text-white/45 font-bold uppercase">
									Voyages responsables depuis Fianarantsoa
								</span>
							</div>
						</Reveal>

						{/* Headline */}
						<Reveal animation="arc" delay={80} duration={950}>
							<h1
								class="font-h1 leading-[0.88] tracking-tighter uppercase font-black text-white overflow-visible"
								style="font-size: clamp(2.75rem, 6.5vw, 6rem);"
							>
								Découvrez<br />
								<span class="text-gradient">Madagascar<br />autrement</span>
							</h1>
						</Reveal>

						{/* Subtext */}
						<Reveal animation="fadeUp" delay={220} duration={800}>
							<p class="mt-8 font-body-lg text-base md:text-[17px] text-white/55 max-w-sm leading-relaxed pl-5 border-l border-primary/35">
								Randonnées, rencontres et voyages sur mesure, guidés par ceux qui vivent et aiment la Grande Île.
							</p>
						</Reveal>

						{/* CTAs */}
						<Reveal animation="fadeUp" delay={340} duration={800}>
							<div class="mt-10 flex flex-wrap items-center gap-4">
								<a
									href="#contact"
									class="h-14 px-8 flex items-center justify-center gap-3 bg-primary text-white font-button text-[13px] tracking-widest rounded-full shadow-xl shadow-primary/30 transition-all duration-200 hover:bg-primary-container hover:scale-[1.03] active:scale-[0.97]"
								>
									PRÉPARER MON VOYAGE
									<span class="material-symbols-outlined text-[18px]">north_east</span>
								</a>
								<a
									href="#expeditions"
									class="h-14 px-7 flex items-center justify-center border border-white/20 text-white/75 font-button text-[13px] tracking-widest rounded-full transition-all duration-200 hover:border-white/45 hover:text-white active:scale-[0.97]"
								>
									VOIR LES RANDONNÉES
								</a>
							</div>
						</Reveal>

						{/* Gallery strip */}
						{photos.length > 0 && (
							<Reveal animation="fadeUp" delay={460} duration={800}>
								<div class="mt-14 border-t border-white/10 pt-8">
								<p class="font-mono text-[9px] tracking-[0.3em] text-white/30 uppercase mb-4">Quelques souvenirs de terrain</p>
									<div class="flex items-center gap-2">
										{photos.map((evt, i) => (
											<a
												key={evt.id}
												href={eventPath(evt)}
												class="group relative h-16 rounded-lg overflow-hidden border border-white/10 transition-all duration-300 hover:border-primary/50 hover:scale-105 hover:z-10 shrink-0"
												style={`width: ${i === 0 ? '96px' : '56px'}`}
												title={evt.titre}
											>
												<BlurBackgroundImage src={resolveImg(evt.imagePrincipale)} class="absolute inset-0 group-hover:scale-110" />
												<div class="absolute inset-0 bg-zinc-950/30 group-hover:bg-zinc-950/10 transition-colors duration-300" />
												{i === 0 && (
													<div class="absolute inset-x-0 bottom-0 px-2 py-1 bg-gradient-to-t from-zinc-950/80 to-transparent">
														<p class="font-mono text-[7px] text-white/70 uppercase tracking-wide truncate">{evt.titre}</p>
													</div>
												)}
											</a>
										))}
										<a
											href="/archives"
											class="shrink-0 h-16 w-14 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 text-white/30 hover:text-white/60 hover:border-white/25 transition-all duration-200"
										>
											<span class="material-symbols-outlined text-[16px]">photo_library</span>
											<span class="font-mono text-[7px] tracking-wide uppercase">Tout</span>
										</a>
									</div>
								</div>
							</Reveal>
						)}
					</div>

					{/* RIGHT — Floating photo panel (desktop only) */}
					<Reveal animation="driftRight" delay={300} duration={1000} className="hidden lg:block">
						<div class="relative flex justify-center items-center">

							{/* Main framed card */}
							<div
								class="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
								style="transform: rotate(1.5deg);"
							>
								<BlurBackgroundImage src={img('/assets/hero.jpg')} class="absolute inset-0" />
								<div class="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-zinc-950/10" />

								{/* Inset badge */}
								<div class="absolute bottom-5 left-5 right-5">
									<div class="flex items-end justify-between">
										<div>
											<p class="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase mb-1">Zone</p>
											<p class="font-h2 text-sm font-black text-white uppercase tracking-wide">Haute Matsiatra</p>
										</div>
										<div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/80 backdrop-blur-sm">
											<span class="material-symbols-outlined text-white text-[18px]">explore</span>
										</div>
									</div>
								</div>
							</div>

							{/* Floating review chip */}
							<div class="absolute -top-4 -left-4 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
								<div class="flex flex-col">
									<div class="flex items-center gap-1">
										{[1,2,3,4,5].map((i) => (
											<span key={i} class="material-symbols-outlined text-[12px] text-primary-container" style="font-variation-settings:'FILL' 1">star</span>
										))}
									</div>
							<p class="font-mono text-[9px] tracking-[0.15em] text-white/40 uppercase mt-1">Voyages accompagnés localement</p>
								</div>
							</div>

							{/* GMT+3 tag */}
							<div class="absolute -bottom-3 -right-3 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
								<p class="font-label-caps text-[9px] tracking-[0.25em] text-white font-bold uppercase">GMT +3</p>
							</div>
						</div>
					</Reveal>

				</div>
			</div>

		</section>
	);
}
