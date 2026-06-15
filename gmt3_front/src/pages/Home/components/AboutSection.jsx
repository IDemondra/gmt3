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
			src: '/src/assets/hasina.jpeg',
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
		<section class="relative overflow-hidden bg-[#faf9f6] px-margin-mobile py-section-gap md:px-margin-desktop w-full" id="equipes">
			{/* Transition light → light (Tours → About) */}
			<div class="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#faf9f6] via-[#faf9f6]/50 to-transparent pointer-events-none z-10" />
			
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
			</div>

			{/* Decorative background elements */}
			<div class="absolute -top-24 left-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
			<div class="absolute bottom-[-7rem] right-[-4rem] h-80 w-80 rounded-full bg-white/20 blur-3xl pointer-events-none" />
			<div class="absolute top-1/4 right-10 h-64 w-64 rounded-full bg-primary/5 blur-[100px] pointer-events-none animate-pulse" />

			<div class="relative mx-auto max-w-container-max">
				{/* ── Header ── */}
				<div class="mb-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div class="max-w-2xl">
						<div class="flex items-center gap-3">
							<span class="h-px w-12 bg-primary/40" />
							<span class="font-label-caps text-label-caps tracking-[0.2em] text-primary">L'ÂME DE GMT+3</span>
						</div>
						<h2 class="mt-4 font-h2 text-h2 md:text-[clamp(2.5rem,4vw,4rem)] text-on-background font-black uppercase tracking-tighter leading-[0.95]">
							Passeurs <br class="hidden md:block" /> d'Horizons
						</h2>
						<p class="font-body-lg text-body-lg text-secondary mt-6 max-w-xl leading-relaxed">
							Plus que des guides, ils sont les gardiens des secrets de l'île. Chaque membre de notre équipe est un expert du terrain, choisi pour son lien viscéral avec sa terre.
						</p>
					</div>

					{/* Mission Log Stats */}
					<div class="relative">
						<div class="absolute -inset-4 rounded-[2rem] bg-white/40 blur-xl pointer-events-none" />
						<div class="relative grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
							{[
								{ label: "Expertise", val: "10", sub: "Années d'aventure", icon: "military_tech" },
								{ label: "Équipe", val: "06", sub: "Membres racines", icon: "group" },
								{ label: "Origine", val: "100%", sub: "Madagascar native", icon: "location_on" }
							].map((s, idx) => (
								<div key={idx} class="group flex items-center gap-4 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all hover:translate-x-2 hover:bg-white/80">
									<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
										<span class="material-symbols-outlined">{s.icon}</span>
									</div>
									<div>
										<div class="flex items-baseline gap-2">
											<span class="font-h3 text-2xl font-bold text-on-background">{s.val}</span>
											<span class="text-[10px] font-bold uppercase tracking-wider text-primary/70">{s.label}</span>
										</div>
										<p class="text-xs text-secondary font-medium">{s.sub}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ── Field Journal Grid (Staggered) ── */}
				<div class="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 md:pt-10">
					{team.map((member, i) => (
						<Reveal
							key={member.name}
							animation="fadeUp"
							delay={i * 100}
							className={i % 2 !== 0 ? 'lg:translate-y-16' : ''}
						>
							<article class="group relative">
								{/* The "Notebook Page" Card */}
								<div class={`relative flex flex-col rounded-[0.5rem] bg-[#fdfcf8] p-4 pt-12 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:rotate-0 isolate ${member.accent} border-b-4 border-stone-300/50`}>
									
									{/* Top decoration: Binder holes or Clip */}
									<div class="absolute top-4 left-0 right-0 flex justify-center gap-4 opacity-30">
										{[1, 2, 3, 4, 5].map(n => <div key={n} class="h-3 w-3 rounded-full bg-stone-800" />)}
									</div>
									
									{/* Bio-Stamp / Badge */}
									<div class="absolute -right-3 -top-3 z-30 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-white p-1 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-0">
										<div class="flex h-full w-full items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
											<span class="material-symbols-outlined text-2xl">
												{i % 3 === 0 ? 'eco' : i % 3 === 1 ? 'explore' : 'camera'}
											</span>
										</div>
									</div>

									{/* Main Photo area: Inset and slightly aged */}
									<div class="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-200 shadow-inner">
										<img
											alt={member.name}
											class="h-full w-full object-cover grayscale-[0.2] sepia-[0.1] transition-all duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-105"
											src={img(member.src)}
										/>
										{/* Overlay vignette */}
										<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
										
										{/* Tag / Role label */}
										<div class="absolute bottom-3 left-3 flex flex-col gap-1">
											<span class="w-fit bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
												{member.role}
											</span>
											<span class="w-fit bg-on-background px-2 py-0.5 text-[9px] font-medium text-white/80">
												EXP: {member.meta.split('&')[0].trim()}
											</span>
										</div>
									</div>

									{/* Handwritten-style Name & Note */}
									<div class="mt-6 flex flex-col">
										<h3 class="text-xl font-bold tracking-tight text-on-background underline decoration-primary/20 decoration-2 underline-offset-4">
											{member.name}
										</h3>
										
										<div class="relative mt-4">
											<span class="absolute -left-2 -top-2 text-4xl text-primary/10 font-serif">"</span>
											<p class="relative font-serif italic text-secondary text-sm leading-relaxed pl-2 border-l-2 border-stone-100">
												{member.note.replace(/[«»]/g, '')}
											</p>
										</div>
										
										{/* Bottom details: Coordinates or fake ID */}
										<div class="mt-6 flex items-center justify-between border-t border-dashed border-stone-200 pt-4">
											<div class="flex gap-1">
												{[1, 2, 3, 4, 5].map(s => (
													<span key={s} class="h-1.5 w-1.5 rounded-full bg-primary/30" />
												))}
											</div>
											<span class="text-[9px] font-bold tracking-tighter text-stone-400 uppercase">
												Ref. GMT3-MADA-{i + 10}
											</span>
										</div>
									</div>

									{/* "Tape" piece at bottom */}
									<div class="absolute -bottom-2 right-10 h-6 w-16 bg-white/60 backdrop-blur-sm border border-stone-200/50 -rotate-2 opacity-0 transition-opacity group-hover:opacity-100" />
								</div>
							</article>
						</Reveal>
					))}
				</div>

				{/* ── Call to Action: Join the Expedition ── */}
				<div class="mt-24 rounded-[2.5rem] bg-on-background p-8 md:p-12 text-center text-white relative overflow-hidden">
					<div class="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
					<div class="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
					
					<Reveal animation="fadeUp">
						<div class="max-w-2xl mx-auto relative z-10">
							<span class="text-primary font-bold tracking-[0.3em] text-xs uppercase">Immersion Totale</span>
							<h3 class="mt-4 text-3xl md:text-5xl font-black uppercase leading-tight">Envie de les rencontrer sur le terrain ?</h3>
							<p class="mt-6 text-white/70 font-body-md">
								Nos expéditions sont limitées à 8 participants pour garantir une interaction réelle avec nos équipes et les communautés locales.
							</p>
							<div class="mt-10 flex flex-wrap justify-center gap-4">
								<a href="#contact" class="px-8 py-4 bg-primary text-white font-bold uppercase tracking-widest text-sm rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
									Rejoindre l'aventure
								</a>
								<div class="flex -space-x-3 items-center">
									{team.slice(0, 4).map((m, idx) => (
										<img key={idx} src={img(m.src)} class="h-10 w-10 rounded-full border-2 border-on-background object-cover" />
									))}
									<div class="h-10 w-10 rounded-full border-2 border-on-background bg-stone-800 flex items-center justify-center text-[10px] font-bold">
										+2
									</div>
								</div>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
			{/* Transition light → dark (About → Offers) */}
			<div class="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-on-secondary-fixed via-on-secondary-fixed/30 to-transparent pointer-events-none z-10" />
		</section>
	);
}
