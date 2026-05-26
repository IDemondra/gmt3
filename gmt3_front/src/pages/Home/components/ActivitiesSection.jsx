export function ActivitiesSection() {
	const activities = [
		{ icon: 'hiking', title: 'Randonnée' },
		{ icon: 'camping', title: 'Camping' },
		{ icon: 'restaurant', title: 'Pique-nique' },
		{ icon: 'explore', title: 'Voyage' },
		{ icon: 'map', title: 'Sur Mesure' },
	];

	return (
		<section class="bg-surface-variant py-section-gap border-y-2 border-outline-variant">
			<div class="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
				<div class="text-center mb-16">
					<h2 class="font-h2 text-h2 text-on-background font-bold mb-4 uppercase">Nos Spécialités</h2>
					<p class="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">Conçu pour l'aventure, exécuté avec précision.</p>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-5 gap-8">
					{activities.map((a, i) => (
						<div key={i} class="flex flex-col items-center group cursor-pointer">
							<div class="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center shadow-[0_0_0_2px_#E31E24] hover:bg-primary transition-all duration-300">
								<span class="material-symbols-outlined text-4xl text-on-primary">{a.icon}</span>
							</div>
							<h4 class="mt-6 font-h3 text-h3 text-on-background text-base uppercase text-center group-hover:text-primary transition-colors">{a.title}</h4>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}