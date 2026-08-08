import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';

export function DestinationsSection() {
	const bg1 = `url('${img('https://images.unsplash.com/photo-1695236268766-cd55f5502fba?w=1200&q=80')}')`;
	const bg2 = `url('${img('https://images.unsplash.com/photo-1656163157901-8715e42adeb4?w=1200&q=80')}')`;
	const bg3 = `url('${img('https://images.unsplash.com/photo-1662567534419-b955d8b50cdf?w=1200&q=80')}')`;

	const sectors = [
		{
			id: 'SEC-01',
			name: 'Fianarantsoa',
			region: 'CENTRE-SUD',
			desc: 'Plongez au coeur de la capitale du Betsileo, entre vignobles en terrasses et artisanat.',
			coord: '21.4536° S, 47.0858° E',
			elev: '1,374m',
			bg: bg1,
			span: 'lg:col-span-2 lg:row-span-2'
		},
		{
			id: 'SEC-02',
			name: 'Ranomafana',
			region: 'HAUTS PLATEAUX',
			desc: 'Forêt tropicale, lémuriens et sources chaudes.',
			coord: '21.2585° S, 47.4521° E',
			elev: '1,100m',
			bg: bg2,
			span: 'lg:col-span-1 lg:row-span-1'
		},
		{
			id: 'SEC-03',
			name: 'Ambalavao',
			region: 'PORTES DU SUD',
			desc: 'Réserve d\'Anja et artisanat Antaimoro.',
			coord: '21.8333° S, 46.9333° E',
			elev: '1,020m',
			bg: bg3,
			span: 'lg:col-span-1 lg:row-span-1'
		}
	];

	return (
		<section class="relative overflow-hidden bg-on-secondary-fixed py-[120px] text-white" id="destinations">
			{/* Technical Bridge from Activities */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			</div>

			{/* Technical Background */}
			<div class="absolute inset-0 opacity-[0.02] pointer-events-none" 
				style="background-image: repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 10px);" />
			
			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				
				{/* ── Header ── */}
				<div class="mb-16 grid lg:grid-cols-[1fr_auto] items-end gap-10">
					<div class="max-w-2xl">
						<Reveal animation="fadeUp">
							<h2 class="font-h2 text-h2 md:text-6xl text-white font-black uppercase tracking-tighter leading-none">
								Destinations <span class="text-primary">Phares</span>
							</h2>
							<p class="mt-8 font-body-lg text-white/50 leading-relaxed">
									Des hauts plateaux aux forêts tropicales, chaque étape révèle une autre facette de Madagascar.
							</p>
						</Reveal>
					</div>
				</div>

				{/* ── Exploration Grid ── */}
				<div class="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6 h-auto lg:h-[700px]">
					{sectors.map((s, i) => (
						<Reveal key={s.id} animation="fadeUp" delay={i * 100} className={`${s.span} w-full`}>
							<a
								href="/events"
								aria-label={`Découvrir ${s.name}, ${s.region}`}
								class="group relative block w-full min-h-[320px] sm:min-h-[380px] lg:min-h-0 lg:h-full overflow-hidden rounded-2xl bg-stone-700 shadow-2xl transition-all duration-300 isolate border border-white/10 hover:shadow-2xl hover:shadow-primary/20"
							>

								{/* Background Image with Ken Burns effect on hover */}
								<div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110" style={`background-image: ${s.bg}`} />

								{/* Technical Overlays with Duotone */}
								<div class="absolute inset-0 z-10 bg-gradient-to-t from-on-secondary-fixed via-on-secondary-fixed/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
								<div class="absolute inset-0 z-10 bg-gradient-to-br from-[#ba0013]/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								
								{/* Scanner Crosshairs (visible on hover) */}
								<div class="absolute inset-4 z-20 border border-white/0 transition-all duration-300 group-hover:border-white/10 group-hover:inset-6">
									<div class="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<div class="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<div class="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<div class="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>

								{/* Content Wrapper */}
								<div class="absolute inset-0 z-30 p-8 flex flex-col justify-between">
									<div class="flex justify-between items-start translate-y-[-10px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
										<div class="flex flex-col gap-1">
															<span class="font-mono text-[10px] text-primary font-black tracking-widest">{String(i + 1).padStart(2, '0')}</span>
															<span class="font-mono text-[10px] text-white/40 tracking-tighter uppercase">{s.coord}</span>
										</div>
										<div class="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center">
											<span class="material-symbols-outlined text-sm text-white/40">radar</span>
										</div>
									</div>

									<div>
										<span class="inline-block bg-primary text-white text-[10px] font-bold tracking-[0.2em] px-3 py-1 mb-4 uppercase rounded-sm shadow-lg">
											{s.region}
										</span>
										<h3 class="font-h1 text-h1 md:text-4xl text-white font-black uppercase tracking-tighter mb-4 leading-none">
											{s.name}
										</h3>
										<p class="font-body-md text-white/70 max-w-sm line-clamp-2 transition-all duration-300 group-hover:line-clamp-none group-hover:text-white">
											{s.desc}
										</p>
										
										{/* Expanded Specs on Hover */}
										<div class="mt-6 flex items-center gap-6 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 border-t border-white/10 pt-6">
											<div class="flex flex-col">
																<span class="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">Altitude</span>
												<span class="font-mono text-xs font-bold text-white">{s.elev}</span>
											</div>
											<div class="flex flex-col">
																<span class="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">À découvrir</span>
																<span class="font-mono text-xs font-bold text-white uppercase">Toute l'année</span>
											</div>
											<div class="ml-auto h-10 w-10 rounded-full bg-white text-on-secondary-fixed flex items-center justify-center transition-transform hover:scale-110">
												<span class="material-symbols-outlined text-sm">arrow_outward</span>
											</div>
										</div>
									</div>
								</div>

								{/* Shimmer Effect */}
								<div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
							</a>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
