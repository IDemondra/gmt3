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
		<section class="relative overflow-hidden bg-on-secondary-fixed py-section-gap text-white" id="specialites">
			{/* Technical Background Accents */}
			<div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
				style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 30px 30px;" />
			<div class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
			<div class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">

				{/* ── Header ── */}
				<div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
					<div class="max-w-2xl">
						<div class="flex items-center gap-3 mb-4">
							<div class="h-2 w-2 bg-primary animate-pulse" />
							<span class="font-label-caps text-[10px] tracking-[0.4em] text-primary font-bold">CORE CAPABILITIES</span>
						</div>
						<h2 class="font-h2 text-h2 md:text-5xl text-white font-black uppercase tracking-tighter leading-none">
							Nos <span class="text-primary">Spécialités</span>
						</h2>
						<p class="mt-6 font-body-lg text-white/50 leading-relaxed max-w-xl">
							Des modules d'exploration conçus pour l'efficacité brute. Chaque spécialité est une brique de votre aventure, calibrée pour le terrain malgache.
						</p>
					</div>
					
					<div class="hidden md:block text-right">
						<p class="font-mono text-[10px] text-white/20 tracking-widest uppercase">System Status: Optimal</p>
						<p class="font-mono text-[10px] text-white/20 tracking-widest uppercase">Coord: 20.0000° S, 47.0000° E</p>
					</div>
				</div>

				{/* ── Bento Grid ── */}
				<div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[240px]">
					{activities.map((activity, index) => {
						// Bento logic: 1st is large, 2nd & 3rd are medium, 4th & 5th are wide
						const spanClass = index === 0 
							? "md:col-span-2 md:row-span-2" 
							: index === 1 || index === 2
							? "md:col-span-2 md:row-span-1"
							: "md:col-span-2 lg:col-span-3 md:row-span-1";

						return (
							<Reveal key={index} animation="fadeUp" delay={index * 100} className={spanClass}>
								<article class="group relative h-full w-full overflow-hidden bg-white/5 border border-white/10 rounded-xl transition-all duration-500 hover:border-primary/50 hover:bg-white/10 flex flex-col p-6 isolate">
									
									{/* Corner Accents */}
									<div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-primary transition-colors" />
									<div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-primary transition-colors" />
									<div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-primary transition-colors" />
									<div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-primary transition-colors" />

									{/* Header: Icon + Serial */}
									<div class="flex items-start justify-between mb-auto">
										<div class={`flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white`}>
											<span class="material-symbols-outlined text-2xl">
												{activity.icon}
											</span>
										</div>
										<div class="text-right">
											<p class="font-mono text-[10px] text-white/20 tracking-tighter">MOD-0{index + 1}</p>
											<div class="flex gap-1 justify-end mt-1">
												<div class="h-1 w-1 bg-primary rounded-full" />
												<div class="h-1 w-1 bg-white/10 rounded-full" />
												<div class="h-1 w-1 bg-white/10 rounded-full" />
											</div>
										</div>
									</div>

									{/* Content */}
									<div class="relative z-10 mt-4">
										<h3 class="font-h3 text-xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-primary">
											{activity.title}
										</h3>
										<p class="mt-2 text-sm text-white/40 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
											{activity.description}
										</p>
									</div>

									{/* Footer: Tech specs / Status */}
									<div class="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
										<span class="text-[9px] font-bold tracking-widest text-primary uppercase">Module Active</span>
										<span class="material-symbols-outlined text-sm text-white/20">sensors</span>
									</div>

									{/* Background Glow */}
									<div class="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
								</article>
							</Reveal>
						);
					})}
				</div>

				{/* ── Expertise footer ── */}
				<div class="mt-16 flex flex-wrap justify-center gap-8 border-t border-white/5 pt-12">
					{[
						{ label: "LOGISTICS", val: "L-24" },
						{ label: "EXPLORATION", val: "E-12" },
						{ label: "SECURITY", val: "S-01" },
						{ label: "PROTOCOL", val: "P-09" }
					].map((tag, i) => (
						<div key={i} class="flex items-center gap-3">
							<span class="text-[10px] font-bold text-white/20 tracking-[0.3em]">{tag.label}</span>
							<span class="font-mono text-xs text-primary">{tag.val}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
