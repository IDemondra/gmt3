export function OffersSection() {
	return (
		<section class="py-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto" id="offers">
			<div class="text-center mb-12">
				<h2 class="font-h2 text-h2 text-on-background font-bold mb-2 uppercase">Offres Spéciales</h2>
				<div class="h-1 w-24 bg-primary-container mx-auto"></div>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div class="bg-primary-fixed/20 p-8 rounded-lg flex flex-col md:flex-row gap-6 items-center border border-primary-fixed-dim hover:shadow-md transition-shadow">
					<div class="w-20 h-20 shrink-0 bg-primary-container rounded-full flex items-center justify-center text-on-primary">
						<span class="material-symbols-outlined text-3xl">event_available</span>
					</div>
					<div class="text-center md:text-left">
						<h3 class="font-h3 text-h3 text-on-background mb-2 uppercase">Saison Sèche 2024</h3>
						<p class="font-body-md text-secondary mb-4">-15% sur les circuits "Découverte" réservés 3 mois à l'avance.</p>
						<button class="font-button text-button text-primary-container hover:text-primary transition-colors flex items-center gap-1 justify-center md:justify-start w-full">
							EN PROFITER <span class="material-symbols-outlined text-sm">arrow_forward</span>
						</button>
					</div>
				</div>
				<div class="bg-surface-variant p-8 rounded-lg flex flex-col md:flex-row gap-6 items-center border border-outline-variant hover:shadow-md transition-shadow">
					<div class="w-20 h-20 shrink-0 bg-on-background rounded-full flex items-center justify-center text-on-primary">
						<span class="material-symbols-outlined text-3xl">group_add</span>
					</div>
					<div class="text-center md:text-left">
						<h3 class="font-h3 text-h3 text-on-background mb-2 uppercase">Aventure en Groupe</h3>
						<p class="font-body-md text-secondary mb-4">Voyagez à 5, la 6ème personne bénéficie d'une réduction de 50%.</p>
						<button class="font-button text-button text-on-background hover:text-primary-container transition-colors flex items-center gap-1 justify-center md:justify-start w-full">
							EN PROFITER <span class="material-symbols-outlined text-sm">arrow_forward</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}