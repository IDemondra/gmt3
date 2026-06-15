import { Reveal } from '../../../components/ui/Reveal.jsx';

export function BannerSection() {
	return (
		<section class="relative bg-primary-container text-on-primary w-full overflow-hidden">
			{/* Transition dark → red (Destinations → Banner) */}
			<div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-on-secondary-fixed/60 to-transparent pointer-events-none z-10" />
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			</div>

			{/* Dot grid */}
			<div class="absolute inset-0 opacity-[0.06] pointer-events-none"
				style="background-image: radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px); background-size: 32px 32px;" />

			{/* Diagonal geometric accent */}
			<div class="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none overflow-hidden">
				<div class="absolute inset-0 bg-white/5" style="clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" />
				<div class="absolute inset-0 bg-white/5" style="clip-path: polygon(45% 0%, 100% 0%, 100% 100%, 25% 100%)" />
			</div>

			{/* Big decorative background icon */}
			<div class="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none hidden lg:block">
				<span class="material-symbols-outlined text-white" style="font-size: 240px; line-height:1;">travel_explore</span>
			</div>

			{/* GPS badge top-right */}
			<div class="absolute top-12 right-8 hidden xl:flex flex-col items-end gap-1 z-20 mt-6">
				<span class="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase">GMT3 / DISPATCH</span>
				<div class="flex items-center gap-2">
					<div class="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
					<span class="font-mono text-[8px] text-white/40 tracking-widest font-bold">18.9137° S, 47.5361° E</span>
				</div>
			</div>

			{/* Bottom scan line */}
			<div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

			<div class="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-24 md:py-28">
				<div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
					<Reveal animation="fadeLeft" duration={650}>
						<div class="max-w-2xl">
							<div class="flex items-center gap-3 mb-5">
								<div class="h-px w-8 bg-white/40" />
								<span class="font-label-caps text-[10px] tracking-[0.3em] text-white/60 font-bold uppercase">Itinéraire sur demande</span>
							</div>
							<h2 class="font-h2 text-h2 md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
								Voyage <br /><span class="text-white/60">Sur Mesure</span>
							</h2>
							<p class="font-body-lg text-on-primary/80 leading-relaxed max-w-xl">
								Laissez nos experts concevoir un itinéraire qui correspond exactement à votre soif de découverte — logistique, rythme et budget calibrés.
							</p>
							<div class="mt-6 flex items-center gap-6">
								{[
									{ val: '10', label: 'Ans terrain' },
									{ val: '100%', label: 'Sur mesure' },
									{ val: '8', label: 'Max / groupe' },
								].map((s, i) => (
									<div key={i} class="flex flex-col">
										<span class="font-mono text-xl font-black text-white">{s.val}</span>
										<span class="font-mono text-[9px] text-white/40 uppercase tracking-widest">{s.label}</span>
									</div>
								))}
							</div>
						</div>
					</Reveal>

					<Reveal animation="driftRight" delay={150} duration={650}>
						<div class="flex flex-col gap-4 shrink-0">
							<a
								href="#contact"
								class="group relative inline-flex items-center justify-center gap-3 bg-white text-primary px-8 py-5 rounded-full font-button text-xs tracking-widest font-black uppercase transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
							>
								<span class="relative z-10 flex items-center gap-3">
									NOUS CONTACTER
									<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">sensors</span>
								</span>
								<div class="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
							</a>
							<a
								href="/events"
								class="inline-flex items-center justify-center gap-2 border border-white/20 text-white/60 hover:text-white hover:border-white/40 px-8 py-4 rounded-full font-button text-[10px] tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer"
							>
								VOIR LES CIRCUITS
								<span class="material-symbols-outlined text-sm">arrow_forward</span>
							</a>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}