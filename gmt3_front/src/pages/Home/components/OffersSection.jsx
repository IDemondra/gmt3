import { Reveal } from '../../../components/ui/Reveal.jsx';

const ops = [
	{
		id: 'OPS-2601',
		icon: 'hiking',
		tag: 'Aventure Terrain',
		title: 'Randonnée Guidée',
		detail: 'Trek sur mesure en petit groupe (max. 8 pers.) avec guides naturalistes certifiés. Randonnées touristiques ou explorations hors sentiers battus, selon vos envies. Sécurité et immersion garanties.',
		badge: '',
		badgeLabel: '',
		status: 'ACTIF',
		cta: 'Découvrir les parcours',
		delay: 80,
	},
	{
		id: 'OPS-2602',
		icon: 'tent',
		tag: 'Immersion Nature',
		title: 'Camping Équipé',
		detail: 'Bivouacs en pleine nature avec campements équipés et repas cuisinés sur place. Nuits sous les étoiles malgaches avec tout le confort logistique. Inclus : matériel & intendance complète.',
		badge: '',
		badgeLabel: '',
		status: 'ACTIF',
		cta: 'Réserver mon campement',
		delay: 160,
	},
];

export function OffersSection() {
	return (
		<section class="relative overflow-hidden bg-on-secondary-fixed py-section-gap" id="offers">
			{/* Transition light → dark (About → Offers) */}
			<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none z-20" />

			{/* Dot grid */}
			<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
				style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 30px 30px;" />

			{/* Ambient glows */}
			<div class="absolute -top-20 left-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
			<div class="absolute bottom-[-5rem] right-[-4rem] h-80 w-80 rounded-full bg-white/5 blur-[80px] pointer-events-none" />

			{/* Bottom scan line */}
			<div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

			<div class="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">

				{/* ── Header ── */}
				<Reveal animation="fadeUp" duration={700}>
					<div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
						<div class="max-w-2xl">
							<div class="flex items-center gap-3 mb-5">
								<div class="h-px w-10 bg-primary/50" />
								<span class="font-label-caps text-[10px] tracking-[0.3em] text-primary font-bold uppercase">Ops Spéciales</span>
							</div>
							<h2 class="font-h2 text-h2 md:text-5xl text-white font-black uppercase tracking-tighter leading-none">
								Offres <br /><span class="text-primary">Prioritaires</span>
							</h2>
							<p class="mt-6 font-body-lg text-white/40 leading-relaxed max-w-xl">
								Fenêtres d'opportunité à durée limitée. Chaque offre est calibrée pour maximiser votre déploiement terrain.
							</p>
						</div>

						<div class="hidden md:flex flex-col items-end gap-2 border-l border-white/10 pl-10 shrink-0">
							<div class="flex items-center gap-2">
								<div class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
								<span class="font-mono text-[9px] text-primary tracking-widest font-bold uppercase">2 Opérations actives</span>
							</div>
							<span class="font-mono text-[8px] text-white/20 tracking-[0.2em] uppercase">Fenêtre: Saison 2026</span>
						</div>
					</div>
				</Reveal>

				{/* ── Offer Cards ── */}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{ops.map((op) => (
						<Reveal key={op.id} animation="fadeUp" delay={op.delay} duration={700}>
							<div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-primary/40 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer isolate h-full">

								{/* Corner accents */}
								<div class="absolute top-3 left-3 w-4 h-4 border-t border-l border-white/10 group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />
								<div class="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/10 group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />

								{/* Diagonal accent */}
								<div class="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none overflow-hidden">
									<div class="absolute inset-0 bg-primary/5" style="clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" />
								</div>

								{/* Dot grid inside */}
								<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
									style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;" />

								{/* Glow */}
								<div class="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-primary/15 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

								<div class="relative z-10 p-8 flex flex-col gap-6">
									<div class="flex items-start justify-between gap-4">
										<div class="flex items-center gap-4">
											<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
												<span class="material-symbols-outlined text-2xl text-white/60 group-hover:text-white transition-colors duration-300">{op.icon}</span>
											</div>
											<div>
												<span class="font-mono text-[8px] text-white/20 tracking-[0.3em] uppercase block mb-1">{op.id}</span>
												<span class="font-mono text-[9px] text-primary tracking-widest font-bold uppercase">{op.tag}</span>
											</div>
										</div>
										<div class="flex flex-col items-end shrink-0">
											<span class="font-mono text-2xl font-black text-white leading-none">{op.badge}</span>
											<span class="font-mono text-[8px] text-white/30 tracking-widest uppercase">{op.badgeLabel}</span>
										</div>
									</div>

									<div class="h-px bg-gradient-to-r from-white/10 via-primary/20 to-transparent" />

									<div>
										<h3 class="font-h3 text-xl font-black text-white uppercase tracking-tighter leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
											{op.title}
										</h3>
										<p class="font-body-md text-white/40 leading-relaxed text-sm">{op.detail}</p>
									</div>

									<div class="flex items-center justify-between pt-2">
										<div class="flex items-center gap-2">
											<div class="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
											<span class="font-mono text-[9px] text-primary tracking-widest font-bold uppercase">{op.status}</span>
										</div>
										<a href="#contact" class="inline-flex items-center gap-2 font-button text-[10px] tracking-widest font-bold uppercase text-white/40 hover:text-white transition-colors duration-300 group/cta">
											{op.cta}
											<span class="material-symbols-outlined text-sm group-hover/cta:translate-x-1 transition-transform duration-300">north_east</span>
										</a>
									</div>
								</div>
							</div>
						</Reveal>
					))}
				</div>

				{/* ── Disclaimer ── */}
				<Reveal animation="fadeUp" delay={280} duration={700}>
					<div class="mt-10 flex items-center justify-center gap-4">
						<div class="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
						<span class="font-mono text-[9px] text-white/20 tracking-[0.3em] uppercase whitespace-nowrap">Offres non cumulables — Sous réserve de disponibilité</span>
						<div class="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
					</div>
				</Reveal>
			</div>
		</section>
	);
}
