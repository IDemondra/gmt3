import { Reveal } from '../../../components/ui/Reveal.jsx';

export function OffersSection() {
	return (
		<section class="relative overflow-hidden bg-surface-variant py-section-gap" id="offers">
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
				<div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-start py-3">
					<span class="font-mono text-[8px] text-on-background/10 tracking-[0.2em] uppercase">Commitment Sync: Ready</span>
					<span class="font-mono text-[8px] text-on-background/10 tracking-[0.2em] uppercase">Type: SUSTAINABLE-OPS</span>
				</div>
			</div>

			<div class="absolute -top-20 right-[-5rem] h-64 w-64 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
			<div class="absolute bottom-[-5rem] left-[-4rem] h-72 w-72 rounded-full bg-white/50 blur-2xl pointer-events-none" />
			<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				{/* ── Header ── */}
				<div class="mb-14 text-center">
					<span class="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/70 px-4 py-2 font-label-caps text-label-caps text-on-background/70 backdrop-blur-sm">
						<span class="h-2 w-2 rounded-full bg-primary-container" />
						BONNES AFFAIRES
					</span>
					<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.5rem)] text-on-background font-black uppercase tracking-tighter leading-[1.05]">
						Offres Spéciales
					</h2>
					<div class="section-divider mx-auto mt-4 w-24" />
					<p class="mx-auto mt-5 max-w-2xl font-body-lg text-body-lg text-secondary leading-relaxed">
						Profitez de nos offres exclusives pour vivre l'aventure malgache dans les meilleures conditions, à un tarif privilégié.
					</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Reveal animation="fadeUp" duration={650}>
						<div class="bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center border border-white/20 hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 group cursor-pointer">
							<div class="w-20 h-20 shrink-0 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/15">
								<span class="material-symbols-outlined text-3xl">event_available</span>
							</div>
							<div class="text-center md:text-left">
								<h3 class="font-h3 text-h3 text-on-background mb-2 uppercase font-bold">Saison Sèche 2026</h3>
								<p class="font-body-md text-secondary mb-4">-15% sur les circuits "Découverte" réservés 3 mois à l'avance.</p>
								<button class="font-button text-button text-primary hover:text-primary-container transition-colors flex items-center gap-1 justify-center md:justify-start w-full font-semibold cursor-pointer">
									EN PROFITER <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
								</button>
							</div>
						</div>
					</Reveal>
					<Reveal animation="driftRight" delay={80} duration={650}>
						<div class="bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center border border-white/20 hover:shadow-lg transition-all duration-300 group cursor-pointer">
							<div class="w-20 h-20 shrink-0 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/15">
								<span class="material-symbols-outlined text-3xl">group_add</span>
							</div>
							<div class="text-center md:text-left">
								<h3 class="font-h3 text-h3 text-on-background mb-2 uppercase font-bold">Aventure en Groupe</h3>
								<p class="font-body-md text-secondary mb-4">Voyagez à 5, la 6ème personne bénéficie d'une réduction de 50%.</p>
								<button class="font-button text-button text-primary hover:text-primary-container transition-colors flex items-center gap-1 justify-center md:justify-start w-full font-semibold cursor-pointer">
									EN PROFITER <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
								</button>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}