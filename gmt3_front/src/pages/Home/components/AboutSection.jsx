import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';

export function AboutSection() {
	const expertise = [
		{
			icon: 'health_and_safety',
			title: 'Secourisme certifié',
			detail: 'Formation internationale en milieu sauvage, mise à jour chaque saison.',
		},
		{
			icon: 'language',
			title: 'Polyglottes de terrain',
			detail: 'Français, anglais et dialectes locaux pour une immersion sans filtre.',
		},
		{
			icon: 'eco',
			title: 'Éthique durable',
			detail: 'Zéro trace, circuits courts et contribution directe aux villages traversés.',
		},
	];

	const team = [
		{
			name: 'Rija',
			role: 'Guide naturaliste',
			meta: 'Faune & flore endémiques',
			note: '« Je lis la forêt comme un livre ouvert. Chaque cri, chaque trace raconte une histoire. »',
			src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbuDeIPLsY83l0VH8H0y92_P8QpKqSP8rE3nKmm3kDbjmZgcvhUcWwO2iiqNLPnl67NACEORlOuY1MGvTy1DEoocLXX0Pvc33eMsOykpFGJR7BQXeaz7_fiEpApi2bYlGWGIFbSbiOFdys5G9jUbLC8GBBI6BjWFehAl3bISOSDPYHelPt7ZdHT0nlW8XGUxnUkcUULbbyz4I7wtrDxAtXYFtyKDqmxsj8iQntZi3uZpfXktCP23bYcIvnnTWiVG8RNGM7KzwMcsA',
			accent: 'rotate-[-1.2deg]',
		},
		{
			name: 'Soa',
			role: 'Guide culturelle',
			meta: 'Traditions & artisanat',
			note: '« Les vrais trésors de Madagascar sont dans les sourires et les gestes du quotidien. »',
			src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFObZ3NzvjwCbetXzl_ONZPxuiEgjfXRWCsEkZD1-cV7rExx4dFnd72HvbllO9v6Q19Ej5gPbGvfmlA2U3AE3FyiUK3ehKtEJjSkAy6ORj2xYfvTPAi6_IBkP5yp0Jl4L_qdaakA1xd0S1znDNGX9ndrh-e0rtXOl8Ut8ikFEmiY2V2ZidBPyT1D07PEFHhhEfgnIA9RStddtqqDB82zbtgzI5zL_o5ysVI5plnLzrzyAOULPtrhl85B1a_oxIQ6IIZaTINMSnzfI',
			accent: 'rotate-[0.8deg]',
		},
		{
			name: 'Hery',
			role: "Guide d'aventure",
			meta: 'Trek & orientation',
			note: "« La montagne ne se dompte pas, elle s'écoute. Je suis là pour traduire. »",
			src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbuDeIPLsY83l0VH8H0y92_P8QpKqSP8rE3nKmm3kDbjmZgcvhUcWwO2iiqNLPnl67NACEORlOuY1MGvTy1DEoocLXX0Pvc33eMsOykpFGJR7BQXeaz7_fiEpApi2bYlGWGIFbSbiOFdys5G9jUbLC8GBBI6BjWFehAl3bISOSDPYHelPt7ZdHT0nlW8XGUxnUkcUULbbyz4I7wtrDxAtXYFtyKDqmxsj8iQntZi3uZpfXktCP23bYcIvnnTWiVG8RNGM7KzwMcsA',
			accent: 'rotate-[-0.6deg]',
		},
		{
			name: 'Miora',
			role: 'Logistique terrain',
			meta: 'Campements & intendance',
			note: '« Un bivouac bien pensé, c\'est la moitié de l\'aventure. L\'autre moitié, c\'est le feu de camp. »',
			src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFObZ3NzvjwCbetXzl_ONZPxuiEgjfXRWCsEkZD1-cV7rExx4dFnd72HvbllO9v6Q19Ej5gPbGvfmlA2U3AE3FyiUK3ehKtEJjSkAy6ORj2xYfvTPAi6_IBkP5yp0Jl4L_qdaakA1xd0S1znDNGX9ndrh-e0rtXOl8Ut8ikFEmiY2V2ZidBPyT1D07PEFHhhEfgnIA9RStddtqqDB82zbtgzI5zL_o5ysVI5plnLzrzyAOULPtrhl85B1a_oxIQ6IIZaTINMSnzfI',
			accent: 'rotate-[1.5deg]',
		},
		{
			name: 'Tovo',
			role: 'Photographe & reporter',
			meta: 'Mémoire visuelle',
			note: '« Je ne capture pas des paysages, je capture des moments qui ne reviendront jamais. »',
			src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvU8JMScoFI1gbViK1kPPegwWGpihkNED-vo79OhOKlq-ZcnZi27cJg89GogKZzSAuhe-m63xBdxe0kr6w8jHSSfTIBoe1GT6xEACKS2UY-Dsrx8A2YMZGLijrdzVTQ5apcyHO2PEqP_RYJCZzhm4aRO5QxrAGKtSRDVszLGvbULPSKhek-35AQansjo4gwzG84fDtGXtuTOJEttfBaoGfKPXb6s6HD26Ssnzc3-I93-3CGKz68Pu7avKuVJUHNEWRigTAmhETLvQ',
			accent: 'rotate-[-1deg]',
		},
		{
			name: 'Lala',
			role: 'Médiatrice communautaire',
			meta: 'Lien avec les villages',
			note: '« Chaque village a son propre rythme. Mon rôle, c\'est de faire le pont sans rien bousculer. »',
			src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkio4VJUPgJPpaxLyJf8XUmQPzbUCkHHzbdIofoPS9BA1BfUXImCENR0mxA91OqeDCz1bWiXFpb1uxDTlqA9FSyLPDlxYYGFNMAVDsXqRq_o5rxf-KPpHEeN4rQWY-AeMAFgXmqm0vXDvDcfB99PknncZRIGPyS_e9KfpACSU__BgtaGCRS-5SjG2v4OxglWwnN7jgk12W2RiT8rL_J7hc0rEF-R5T0QV-cDxZH6YaA97XsLFCUQCchIJtY-ZTmEXTllCnw96DTmc',
			accent: 'rotate-[0.5deg]',
		},
	];

	return (
		<section class="relative overflow-hidden bg-surface-variant px-margin-mobile py-section-gap md:px-margin-desktop w-full" id="equipes">
			<div class="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
			<div class="absolute bottom-[-7rem] right-[-4rem] h-80 w-80 rounded-full bg-white/20 blur-2xl pointer-events-none" />

			<div class="relative mx-auto max-w-container-max">
				{/* ── Header ── */}
				<div class="mb-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
					<div class="max-w-2xl">
						<span class="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/75 px-4 py-2 font-label-caps text-label-caps text-on-background/70">
							<span class="relative flex h-2 w-2">
								<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-container opacity-75" />
								<span class="relative inline-flex h-2 w-2 rounded-full bg-primary-container" />
							</span>
							ACCOMPAGNEMENT TERRAIN
						</span>
						<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.5rem)] text-on-background font-black uppercase tracking-tighter leading-[1.05]">
							Nos Équipes
						</h2>
						<div class="section-divider mt-4 w-24" />
						<p class="font-body-lg text-body-lg text-secondary mt-5 max-w-xl leading-relaxed">
							Chaque itinéraire GMT+3 est porté par une équipe soudée de locaux qui connaissent chaque relief, chaque usage et chaque silence du terrain. Pas de simples accompagnateurs&nbsp;: des passeurs de sens.
						</p>
					</div>

					{/* Stats strip */}
					<div class="grid gap-3 sm:grid-cols-3">
						<div class="rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md px-4 py-3 shadow-md shadow-black/5">
							<p class="font-h3 text-h3 text-on-background">12+</p>
							<p class="mt-1 font-label-caps text-label-caps uppercase tracking-[0.22em] text-on-background/55">Années d'expérience</p>
						</div>
						<div class="rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md px-4 py-3 shadow-md shadow-black/5">
							<p class="font-h3 text-h3 text-on-background">06</p>
							<p class="mt-1 font-label-caps text-label-caps uppercase tracking-[0.22em] text-on-background/55">Membres clés</p>
						</div>
						<div class="rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md px-4 py-3 shadow-md shadow-black/5">
							<p class="font-h3 text-h3 text-on-background">100%</p>
							<p class="mt-1 font-label-caps text-label-caps uppercase tracking-[0.22em] text-on-background/55">Originaires de Mada</p>
						</div>
					</div>
				</div>

				{/* ── Polaroid team cards: 3-column grid, 2 rows ── */}
				<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{team.map((member, i) => (
						<Reveal key={member.name} animation={i % 2 === 0 ? 'fadeUp' : 'fadeRight'} delay={i * 70} duration={650}>
							<article class="group relative h-full w-full cursor-pointer">
								{/* Outer polaroid wrapper */}
								<div class={`relative flex h-full flex-col rounded-[1.6rem] bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md border border-white/20 p-4 shadow-lg shadow-black/8 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/12 overflow-hidden isolate transform-gpu ${member.accent}`}>
									{/* Tape pieces */}
									<div class="absolute left-3 md:left-6 top-2 md:top-3 h-8 w-12 md:h-10 md:w-16 -rotate-12 rounded-[0.5rem] bg-stone-200/80 backdrop-blur-sm border border-stone-300/50 shadow-sm z-10" />
									<div class="absolute right-3 md:right-6 top-2 md:top-3 h-8 w-12 md:h-10 md:w-16 rotate-12 rounded-[0.5rem] bg-stone-200/80 backdrop-blur-sm border border-stone-300/50 shadow-sm z-10" />

									{/* Inner container */}
									<div class="flex h-full flex-col overflow-hidden rounded-[1.15rem] bg-stone-100 border border-stone-200/60 flex-1 shadow-inner isolate">
										{/* Photo area */}
										<div class="relative flex-1 min-h-[240px] md:min-h-[280px] overflow-hidden rounded-t-[1.15rem]">
											<img
												alt={`${member.name} – ${member.role}`}
												class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
												loading="lazy"
												src={img(member.src)}
											/>
											<div class="absolute inset-0 bg-gradient-to-t from-black/75 from-0% via-black/10 via-50% to-transparent to-100% opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10" />
											<div class="absolute bottom-4 left-4 z-20 rounded-full border border-white/20 bg-black/50 backdrop-blur-md px-4 py-2 font-label-caps text-label-caps text-white/95 shadow-lg">
												{member.name}
											</div>
										</div>

										{/* Info area */}
										<div class="border-t border-stone-200 bg-white/60 px-3 py-4 sm:px-5 sm:py-5 shrink-0">
											<div class="flex flex-wrap items-center gap-2">
												<span class="rounded-full border border-outline-variant/60 bg-white px-3 py-1.5 font-label-caps text-label-caps text-on-background/80 shadow-sm">
													{member.role}
												</span>
												<span class="rounded-full border border-outline-variant/40 bg-stone-100 px-2.5 py-1 font-label-caps text-[11px] text-on-background/45">
													{member.meta}
												</span>
											</div>
											<p class="mt-2 md:mt-3 font-body-md text-body-md md:text-body-md text-[14px] leading-relaxed text-secondary italic break-words hyphens-auto">
												{member.note}
											</p>
										</div>
									</div>
								</div>
							</article>
						</Reveal>
					))}
				</div>

				{/* ── Expertise pills ── */}
				<div class="mt-10 md:mt-12 flex flex-wrap justify-center gap-2 md:gap-3">
					{expertise.map((item) => (
						<div class="flex items-center gap-2 md:gap-3 rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md px-3 py-2.5 md:px-5 md:py-3.5 shadow-md shadow-black/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/8 cursor-pointer w-full sm:w-auto">
							<div class="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/15 text-primary">
								<span class="material-symbols-outlined text-[18px] md:text-[22px]">{item.icon}</span>
							</div>
							<div class="min-w-0">
								<p class="font-body-md text-[14px] md:text-body-md font-semibold text-on-background leading-tight">{item.title}</p>
								<p class="text-[12px] md:text-sm text-secondary mt-0.5">{item.detail}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
