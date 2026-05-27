import { img } from '../../../utils/images.js';

export function AboutSection() {
	const expertise = [
		{
			icon: 'health_and_safety',
			title: 'Formés aux premiers secours en milieu sauvage',
			detail: 'Certification internationale de secourisme',
		},
		{
			icon: 'language',
			title: 'Multilingues',
			detail: 'Français, Anglais, Malgache local',
		},
		{
			icon: 'eco',
			title: 'Éco-tourisme responsable',
			detail: 'Engagés dans une démarche durable',
		},
	];

	const principles = ['Sécurité terrain', 'Immersion culturelle', 'Responsabilité locale'];

	return (
		<section class="relative overflow-hidden border-y-2 border-outline-variant bg-surface-variant px-margin-mobile py-section-gap md:px-margin-desktop w-full" id="guides">
			<div class="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
			<div class="absolute bottom-[-7rem] right-[-4rem] h-80 w-80 rounded-full bg-white/30 blur-3xl pointer-events-none" />
			<div class="relative mx-auto max-w-container-max">
				<div class="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
					<div class="max-w-2xl">
						<span class="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/65 px-4 py-2 font-label-caps text-label-caps text-on-background/70 backdrop-blur-sm">
							<span class="h-2 w-2 rounded-full bg-primary-container" />
							ACCOMPAGNEMENT TERRAIN
						</span>
						<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.5rem)] text-on-background font-black uppercase tracking-tighter leading-[1.05]">
							Nos Guides Experts
						</h2>
						<div class="section-divider mt-4 w-24" />
						<p class="font-body-lg text-body-lg text-secondary mt-5 max-w-xl leading-relaxed">
							Votre sécurité et votre immersion restent nos priorités. Nos guides locaux partagent une connaissance directe de la biodiversité, des routes et des usages culturels de Madagascar.
						</p>

						<div class="mt-10 grid gap-4 sm:grid-cols-2">
							{expertise.map((item) => (
								<article class="group rounded-2xl border border-outline-variant/70 bg-white/60 p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
									<div class="flex items-start gap-4">
										<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-container/15 text-primary transition-all duration-300 group-hover:bg-primary-container group-hover:text-on-primary">
											<span class="material-symbols-outlined">{item.icon}</span>
										</div>
										<div>
											<h3 class="font-body-md text-body-md font-semibold text-on-background leading-snug">
												{item.title}
											</h3>
											<p class="mt-1 font-body-md text-body-md text-secondary text-sm">
												{item.detail}
											</p>
										</div>
									</div>
								</article>
							))}
						</div>

						<div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
							<button class="group inline-flex items-center gap-2 rounded-2xl bg-primary-container px-8 py-4 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 active:scale-95">
								RENCONTRER L'ÉQUIPE
								<span class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
							</button>
							<div class="flex flex-wrap gap-2">
								{principles.map((principle) => (
									<span class="rounded-full border border-outline-variant bg-white/70 px-4 py-2 font-label-caps text-label-caps text-on-background/70">
										{principle}
									</span>
								))}
							</div>
						</div>
					</div>

					<div class="relative">
						<div class="absolute -left-4 top-8 hidden h-28 w-28 rounded-[1.75rem] border border-white/60 bg-white/75 p-4 shadow-xl shadow-black/10 backdrop-blur-md lg:block">
							<p class="font-label-caps text-label-caps text-on-background/50">Focus terrain</p>
							<p class="mt-2 font-h3 text-h3 font-black uppercase tracking-tight text-on-background">
								Sécurité et récit
							</p>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							<div class="group relative overflow-hidden rounded-[1.75rem] border border-white/50 bg-white shadow-2xl shadow-black/10 sm:row-span-2">
								<img
									alt="Portrait de guide local"
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									src={img('https://lh3.googleusercontent.com/aida-public/AB6AXuAbuDeIPLsY83l0VH8H0y92_P8QpKqSP8rE3nKmm3kDbjmZgcvhUcWwO2iiqNLPnl67NACEORlOuY1MGvTy1DEoocLXX0Pvc33eMsOykpFGJR7BQXeaz7_fiEpApi2bYlGWGIFbSbiOFdys5G9jUbLC8GBBI6BjWFehAl3bISOSDPYHelPt7ZdHT0nlW8XGUxnUkcUULbbyz4I7wtrDxAtXYFtyKDqmxsj8iQntZi3uZpfXktCP23bYcIvnnTWiVG8RNGM7KzwMcsA')}
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
								<div class="absolute inset-x-0 bottom-0 p-5">
									<span class="inline-flex rounded-full bg-primary px-3 py-1.5 font-label-caps text-label-caps text-on-primary shadow-lg shadow-primary/20">
										Guide de proximité
									</span>
									<p class="mt-3 max-w-xs font-body-md text-body-md text-on-primary/85 leading-relaxed">
										Des repères concrets pour lire le terrain et anticiper chaque séquence du voyage.
									</p>
								</div>
							</div>

							<div class="group relative overflow-hidden rounded-[1.75rem] border border-white/50 bg-white shadow-xl shadow-black/10">
								<img
									alt="Guide en action"
									class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									src={img('https://lh3.googleusercontent.com/aida-public/AB6AXuDFObZ3NzvjwCbetXzl_ONZPxuiEgjfXRWCsEkZD1-cV7rExx4dFnd72HvbllO9v6Q19Ej5gPbGvfmlA2U3AE3FyiUK3ehKtEJjSkAy6ORj2xYfvTPAi6_IBkP5yp0Jl4L_qdaakA1xd0S1znDNGX9ndrh-e0rtXOl8Ut8ikFEmiY2V2ZidBPyT1D07PEFHhhEfgnIA9RStddtqqDB82zbtgzI5zL_o5ysVI5plnLzrzyAOULPtrhl85B1a_oxIQ6IIZaTINMSnzfI')}
								/>
								<div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
								<div class="absolute inset-x-0 bottom-0 p-5">
									<p class="font-label-caps text-label-caps text-on-primary/70">Terrain vivant</p>
									<p class="mt-2 font-body-md text-body-md text-on-primary leading-relaxed">
										Des échanges directs avec les communautés et les reliefs du pays.
									</p>
								</div>
							</div>

							<div class="relative overflow-hidden rounded-[1.75rem] border border-outline-variant/70 bg-white/80 p-6 shadow-xl shadow-black/5 backdrop-blur-sm">
								<p class="font-label-caps text-label-caps text-on-background/50">Approche</p>
								<p class="mt-2 font-h3 text-h3 font-black uppercase tracking-tight text-on-background">
									Immersion utile
								</p>
								<p class="mt-3 font-body-md text-body-md text-secondary leading-relaxed">
									Chaque guide combine lecture du relief, codes locaux et rythme de voyage maîtrisé.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
