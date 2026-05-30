import { Reveal } from '../../../components/ui/Reveal.jsx';

export function OffersSection() {
	return (
		<section class="py-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto" id="offers">
			<div class="text-center mb-14">
				<h2 class="font-h2 text-h2 text-on-background font-bold mb-2 uppercase">Offres Speciales</h2>
				<div class="section-divider w-24 mx-auto" />
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<Reveal animation="fadeUp" duration={650}>
					<div class="bg-gradient-to-br from-primary-fixed/20 to-primary-fixed/5 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center border border-primary-fixed-dim hover:shadow-lg hover:shadow-primary/8 transition-all duration-300 hover:-translate-y-0.5 group">
						<div class="w-20 h-20 shrink-0 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/15">
							<span class="material-symbols-outlined text-3xl">event_available</span>
						</div>
						<div class="text-center md:text-left">
							<h3 class="font-h3 text-h3 text-on-background mb-2 uppercase font-bold">Saison Seche 2026</h3>
							<p class="font-body-md text-secondary mb-4">-15% sur les circuits "Decouverte" reserves 3 mois a l'avance.</p>
							<button class="font-button text-button text-primary hover:text-primary-container transition-colors flex items-center gap-1 justify-center md:justify-start w-full font-semibold">
								EN PROFITER <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
							</button>
						</div>
					</div>
				</Reveal>
				<Reveal animation="driftRight" delay={80} duration={650}>
					<div class="bg-gradient-to-br from-surface-variant to-background p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center border border-outline-variant hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
						<div class="w-20 h-20 shrink-0 bg-primary-container rounded-2xl flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary/15">
							<span class="material-symbols-outlined text-3xl">group_add</span>
						</div>
						<div class="text-center md:text-left">
							<h3 class="font-h3 text-h3 text-on-background mb-2 uppercase font-bold">Aventure en Groupe</h3>
							<p class="font-body-md text-secondary mb-4">Voyagez a 5, la 6eme personne beneficie d'une reduction de 50%.</p>
							<button class="font-button text-button text-primary hover:text-primary-container transition-colors flex items-center gap-1 justify-center md:justify-start w-full font-semibold">
								EN PROFITER <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
							</button>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
