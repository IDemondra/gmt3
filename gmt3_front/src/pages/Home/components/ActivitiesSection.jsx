import { Reveal } from '../../../components/ui/Reveal.jsx';

export function ActivitiesSection() {
	const activities = [
		{
			icon: 'hiking',
			title: 'Randonnée',
			description: 'Sentiers de crêtes, vallées et dénivelés maîtrisés.',
		},
		{
			icon: 'camping',
			title: 'Camping',
			description: 'Nuits en bivouac avec installation optimisée.',
		},
		{
			icon: 'restaurant',
			title: 'Pique-nique',
			description: 'Pauses conviviales avec logistique légère.',
		},
		{
			icon: 'explore',
			title: 'Voyage',
			description: 'Itinéraires fluides, pensés pour la découverte.',
		},
		{
			icon: 'map',
			title: 'Sur Mesure',
			description: 'Parcours calibrés selon rythme, budget et saison.',
		},
	];

	return (
		<section class="relative overflow-hidden border-y-2 border-outline-variant bg-surface-variant py-section-gap">
			<div class="absolute -top-20 right-[-5rem] h-64 w-64 rounded-full bg-primary/12 blur-2xl pointer-events-none" />
			<div class="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-white/50 blur-2xl pointer-events-none" />
			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				<div class="mx-auto mb-14 max-w-3xl text-center">
					<span class="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/70 px-4 py-2 font-label-caps text-label-caps text-on-background/70 backdrop-blur-sm">
						<span class="h-2 w-2 rounded-full bg-primary-container" />
						EXPERTISES CLÉS
					</span>
					<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.5rem)] text-on-background font-black uppercase tracking-tighter leading-[1.05]">
						Nos Spécialités
					</h2>
					<div class="section-divider mx-auto mt-4 w-24" />
					<p class="mx-auto mt-5 max-w-2xl font-body-lg text-body-lg text-secondary leading-relaxed">
						Conçu pour l'aventure, orchestré avec précision. Chaque spécialité s'appuie sur une logique terrain claire, rapide à comprendre et simple à réserver.
					</p>
				</div>
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
					{activities.map((activity, index) => (
						<Reveal key={index} animation="fadeUp" delay={index * 70} duration={650}>
							<article
								class="group relative h-full overflow-hidden rounded-[1.75rem] border border-outline-variant/70 bg-white/88 p-6 shadow-md shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/8"
							>
								<div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/0 via-primary-container to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<div class="flex h-full flex-col">
									<div class="flex items-start justify-between gap-3">
										<div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-on-secondary-fixed text-primary shadow-md shadow-primary/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-primary/15">
											<span class="material-symbols-outlined text-[2rem]">
												{activity.icon}
											</span>
										</div>
										<span class="rounded-full border border-outline-variant bg-white/80 px-3 py-1.5 font-label-caps text-label-caps text-on-background/55">
											0{index + 1}
										</span>
									</div>
									<h3 class="mt-6 font-h3 text-h3 text-on-background font-black uppercase tracking-tight transition-colors duration-300 group-hover:text-primary">
										{activity.title}
									</h3>
									<p class="mt-3 font-body-md text-body-md text-secondary leading-relaxed">
										{activity.description}
									</p>
									<div class="mt-auto inline-flex items-center gap-2 self-start pt-6 leading-none text-primary opacity-80 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100">
										<span class="font-button text-button leading-none whitespace-nowrap">Voir le détail</span>
										<span class="material-symbols-outlined text-[18px] leading-none">arrow_forward</span>
									</div>
								</div>
							</article>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
