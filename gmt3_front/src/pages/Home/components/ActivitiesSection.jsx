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
					<div class="section-divider w-24 mx-auto mb-4" />
					<p class="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">Conçu pour l'aventure, exécuté avec précision.</p>
				</div>
				<div class="grid grid-cols-2 md:grid-cols-5 gap-8">
					{activities.map((a, i) => (
						<div key={i} class="flex flex-col items-center group cursor-pointer">
							<div class="w-24 h-24 rounded-2xl bg-on-secondary-fixed flex items-center justify-center shadow-lg shadow-primary/10 group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:-translate-y-1">
								<span class="material-symbols-outlined text-4xl text-primary group-hover:text-on-primary transition-colors duration-300">{a.icon}</span>
							</div>
							<h4 class="mt-6 font-h3 text-h3 text-on-background text-base uppercase text-center group-hover:text-primary transition-colors duration-300 font-bold">{a.title}</h4>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}