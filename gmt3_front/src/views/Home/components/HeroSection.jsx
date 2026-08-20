import { useState, useEffect } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { BlurBackgroundImage } from '../../../components/ui/BlurBackgroundImage.jsx';
import { img, resolveImg } from '../../../utils/images.js';
import { fetchEvents } from '../../../utils/events.js';
import { isEventPast } from '../../../utils/dateFormatter.js';
import { eventPath } from '../../../utils/eventUrl.js';
import { useMagnetic } from '../../../hooks/useMagnetic.js';
import { useTilt } from '../../../hooks/useTilt.js';

export function HeroSection({ initialEvents = null }) {
	const ctaMag = useMagnetic(0.4);
	const ctaMag2 = useMagnetic(0.25);
	const tiltRef = useTilt(8);
	const getInitialPhotos = () => {
		if (Array.isArray(initialEvents) && initialEvents.length > 0) {
			return initialEvents
				.filter((e) => e.estPublie && isEventPast(e.dateDepart, e.dateRetour, e.dateEvenement) && e.imagePrincipale)
				.slice(0, 5);
		}
		return [];
	};
	const [photos, setPhotos] = useState(getInitialPhotos);
	const [photosLoading, setPhotosLoading] = useState(!initialEvents);

	useEffect(() => {
		if (initialEvents) {
			setPhotosLoading(false);
			return;
		}
		fetchEvents()
			.then((events) => {
				const past = events
					.filter((e) => e.estPublie && isEventPast(e.dateDepart, e.dateRetour, e.dateEvenement) && e.imagePrincipale);
				setPhotos(past.slice(0, 5));
			})
			.catch(() => {})
			.finally(() => setPhotosLoading(false));
	}, [initialEvents]);

	return (
		<section class="relative min-h-[100dvh] w-full flex items-center bg-zinc-950 overflow-hidden">

			{/* LCP Hero — parallax view-timeline (compositor, zero JS) */}
			<picture class="absolute inset-0 z-0">
				<source type="image/avif" srcset="/assets/hero-640.avif 640w, /assets/hero-1280.avif 1280w, /assets/hero-1920-q50.avif 1920w" sizes="100vw" />
				<img
					src="/assets/hero-1280-q65.webp"
					srcset="/assets/hero-640.webp 640w, /assets/hero-1280-q65.webp 1280w, /assets/hero-1920-q65.webp 1920w"
					sizes="100vw"
					alt="Groupe de voyageurs GMT+3 au sommet, au-dessus des paysages de Fianarantsoa"
					width="1280"
					height="720"
					fetchpriority="high"
					loading="eager"
					decoding="async"
					class="parallax-hero h-full w-full object-cover"
				/>
			</picture>
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

						{/* Eyebrow — clip reveal */}
						<Reveal animation="clip" creative duration={800}>
							<div class="flex items-center gap-4 mb-10">
								<div class="h-px w-8 bg-primary" />
								<span class="font-label-caps text-[10px] tracking-[0.35em] text-white/45 font-bold uppercase">
									Voyages responsables depuis Fianarantsoa
								</span>
							</div>
						</Reveal>

						{/* Headline — split words stagger kinetic */}
						<h1 class="font-h1 leading-[0.88] tracking-tighter uppercase font-black text-white overflow-visible" style="font-size: clamp(2.75rem, 6.5vw, 6rem);">
							<Reveal animation="kinetic" creative duration={900}><span class="inline-block">Découvrez</span></Reveal>
							<Reveal animation="kinetic" creative delay={90} duration={900}><span class="inline-block text-gradient">Madagascar</span></Reveal>
							<Reveal animation="kinetic" creative delay={180} duration={900}><span class="inline-block text-gradient">autrement</span></Reveal>
						</h1>

						{/* Subtext — blurScale */}
						<Reveal animation="blurScale" creative delay={220} duration={900}>
							<p class="mt-8 font-body-lg text-base md:text-[17px] text-white/55 max-w-sm leading-relaxed pl-5 border-l border-primary/35">
								Randonnées, rencontres et voyages sur mesure, guidés par ceux qui vivent et aiment la Grande Île.
							</p>
						</Reveal>

						{/* CTAs — magnetic spring */}
						<Reveal animation="warp" creative delay={340} duration={800}>
							<div class="mt-10 flex flex-wrap items-center gap-4">
								<a
									ref={ctaMag}
									href="#contact"
									class="magnetic-cta h-14 px-8 flex items-center justify-center gap-3 bg-primary text-white font-button text-[13px] tracking-widest rounded-full shadow-xl shadow-primary/30 transition-all duration-200 hover:bg-primary-container will-change-transform"
								>
									PRÉPARER MON VOYAGE
									<span class="material-symbols-outlined text-[18px]">north_east</span>
								</a>
								<a
									ref={ctaMag2}
									href="#expeditions"
									class="magnetic-cta h-14 px-7 flex items-center justify-center border border-white/20 text-white/75 font-button text-[13px] tracking-widest rounded-full transition-all duration-200 hover:border-white/45 hover:text-white will-change-transform"
								>
									VOIR LES RANDONNÉES
								</a>
							</div>
						</Reveal>

						{/* Gallery strip */}
						{(photosLoading || photos.length > 0) && (
							<Reveal animation="fadeUp" delay={460} duration={800}>
								<div class="mt-14 border-t border-white/10 pt-8">
								<p class="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mb-4">Quelques souvenirs de terrain</p>
									{photosLoading ? (
										<div class="flex items-center gap-2" aria-hidden="true">
											{[0, 1, 2, 3, 4].map((i) => (
												<div
													key={i}
													class={`h-16 rounded-lg border border-white/10 animate-pulse ${i === 0 ? 'w-24' : 'w-14'} shrink-0`}
												/>
											))}
										</div>
									) : (
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
														<p class="font-mono text-[10px] text-white/70 uppercase tracking-wide truncate">{evt.titre}</p>
													</div>
												)}
											</a>
										))}
										<a
											href="/archives"
											class="shrink-0 h-16 w-14 rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 text-white/30 hover:text-white/60 hover:border-white/25 transition-all duration-200"
										>
											<span class="material-symbols-outlined text-[16px]">photo_library</span>
											<span class="font-mono text-[10px] tracking-wide uppercase">Tout</span>
										</a>
									</div>
									)}
								</div>
							</Reveal>
						)}
					</div>

					{/* RIGHT — Floating photo panel 3D tilt */}
					<Reveal animation="warp" creative delay={320} duration={1000} className="hidden lg:block">
						<div class="relative flex justify-center items-center" style="perspective: 1000px;">

							{/* Main framed card — tilt 3D */}
							<div
								ref={tiltRef}
								class="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl will-change-transform"
								style="transform: perspective(900px) rotate(1.5deg); transform-style: preserve-3d;"
							>
								<img src="/assets/hero-640.webp" alt="" width="420" height="560" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" />
								<div class="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-zinc-950/10" />

								{/* Inset badge */}
								<div class="absolute bottom-5 left-5 right-5">
									<div class="flex items-end justify-between">
										<div>
											<p class="font-mono text-[10px] tracking-[0.25em] text-white/40 uppercase mb-1">Zone</p>
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
							<p class="font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase mt-1">Voyages accompagnés localement</p>
								</div>
							</div>

							{/* GMT+3 tag */}
							<div class="absolute -bottom-3 -right-3 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
								<p class="font-label-caps text-[10px] tracking-[0.25em] text-white font-bold uppercase">GMT +3</p>
							</div>
						</div>
					</Reveal>

				</div>
			</div>

		</section>
	);
}
