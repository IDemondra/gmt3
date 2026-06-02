import { Reveal } from '../../../components/ui/Reveal.jsx';

export function ActivitiesSection() {
	const activities = [
		{
			icon: 'hiking',
			title: 'Randonnée',
			description: 'Sentiers de crêtes, vallées et dénivelés maîtrisés.',
			hue: 'primary',
			gradient: 'from-primary/10 to-primary/20',
			iconBg: 'bg-primary text-on-primary',
		},
		{
			icon: 'camping',
			title: 'Camping',
			description: 'Nuits en bivouac avec installation optimisée.',
			hue: 'tertiary',
			gradient: 'from-tertiary/10 to-tertiary/20',
			iconBg: 'bg-tertiary text-on-tertiary',
		},
		{
			icon: 'restaurant',
			title: 'Pique-nique',
			description: 'Pauses conviviales avec logistique légère.',
			hue: 'secondary',
			gradient: 'from-secondary/10 to-secondary/20',
			iconBg: 'bg-secondary text-on-secondary',
		},
		{
			icon: 'explore',
			title: 'Voyage',
			description: 'Itinéraires fluides, pensés pour la découverte.',
			hue: 'primary',
			gradient: 'from-primary/10 to-primary/20',
			iconBg: 'bg-primary text-on-primary',
		},
		{
			icon: 'map',
			title: 'Sur Mesure',
			description: 'Parcours calibrés selon rythme, budget et saison.',
			hue: 'tertiary',
			gradient: 'from-tertiary/10 to-tertiary/20',
			iconBg: 'bg-tertiary text-on-tertiary',
		},
	];

	return (
		<section class="relative overflow-hidden bg-surface-variant py-section-gap">
			{/* Decorative blobs */}
			<div class="absolute -top-20 right-[-5rem] h-64 w-64 rounded-full bg-primary/12 blur-2xl pointer-events-none" />
			<div class="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-white/50 blur-2xl pointer-events-none" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">

				{/* ── Header ── */}
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

				{/* ── Grid ── */}
				{/* Mobile: 1 col, sm: 2 col, lg: 3+2 split (first 3 span a row, last 2 share a row) */}
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:[&>*:nth-child(4)]:col-span-2">
					{activities.map((activity, index) => (
						<Reveal key={index} animation="fadeUp" delay={index * 80} duration={600}>
							<article class="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md shadow-sm shadow-black/[0.04] border border-white/20 transition-all duration-300 hover:shadow-md hover:shadow-black/8 cursor-pointer">

								{/* Color accent bar */}
								<div class={`h-1.5 w-full bg-gradient-to-r ${activity.gradient}`} />

								<div class="flex flex-col p-5 md:p-6">
									{/* Top row: icon + index */}
									<div class="flex items-center justify-between">
										<div class={`flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl ${activity.iconBg} shadow-sm`}>
											<span class="material-symbols-outlined text-[1.5rem] md:text-[1.75rem]">
												{activity.icon}
											</span>
										</div>
										<span class="font-mono text-[2rem] md:text-[2.5rem] font-black leading-none text-on-background/[0.06] select-none">
											{String(index + 1).padStart(2, '0')}
										</span>
									</div>

									{/* Title */}
									<h3 class="mt-4 md:mt-5 font-h3 text-h3 md:text-[clamp(1.25rem,2vw,1.5rem)] text-on-background font-black uppercase tracking-tight transition-colors duration-300 group-hover:text-primary">
										{activity.title}
									</h3>

									{/* Description */}
									<p class="mt-2.5 md:mt-3 font-body-md text-body-md text-secondary leading-relaxed flex-1">
										{activity.description}
									</p>

									{/* CTA */}
									<div class="mt-5 md:mt-6 inline-flex items-center gap-2 text-primary/80 font-button text-button transition-all duration-300 group-hover:gap-3 group-hover:text-primary cursor-pointer">
										<span>Voir le détail</span>
										<span class="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
									</div>
								</div>

								{/* Bottom hover glow */}
								<div class="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-primary/[0.04] blur-2xl transition-all duration-500 group-hover:scale-[2] group-hover:bg-primary/[0.08] pointer-events-none" />
							</article>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
