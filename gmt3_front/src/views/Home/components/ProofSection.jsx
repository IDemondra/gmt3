import { Reveal } from '../../../components/ui/Reveal.jsx';

const proofPoints = [
	{ index: '01', icon: 'person_pin', title: 'Une équipe du pays', text: 'Des guides qui partagent leurs chemins, leurs adresses et leurs histoires.' },
	{ index: '02', icon: 'groups', title: 'Des groupes à taille humaine', text: 'Plus de temps pour les rencontres, la marche et les imprévus qui comptent.' },
	{ index: '03', icon: 'route', title: 'Un itinéraire qui vous ressemble', text: 'Votre rythme, vos envies et la saison dessinent chaque départ.' },
];

export function ProofSection() {
	return (
		<section class="relative bg-on-secondary-fixed px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-label="Pourquoi voyager avec GMT+3">
			<div class="mx-auto max-w-container-max overflow-hidden rounded-2xl border border-white/10 bg-on-secondary-fixed shadow-2xl shadow-black/30">
				<div class="grid lg:grid-cols-[0.9fr_2.1fr]">
					<Reveal animation="fadeUp" className="relative overflow-hidden bg-primary px-7 py-9 sm:px-10 lg:flex lg:min-h-[250px] lg:flex-col lg:justify-between lg:px-12 lg:py-11">
						<div class="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/20" aria-hidden="true" />
						<div class="relative">
							<p class="font-label-caps text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">Pourquoi GMT+3</p>
							<h2 class="mt-4 font-h2 text-3xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-4xl">
								Un voyage qui reste avec vous.
							</h2>
						</div>
						<a href="#contact" class="relative mt-8 inline-flex w-fit items-center gap-2 border-b border-white/60 pb-1 font-button text-xs font-bold uppercase tracking-widest text-white transition-colors hover:border-white hover:text-white/75 active:translate-y-px">
							Parler de votre projet
							<span class="material-symbols-outlined text-base" aria-hidden="true">north_east</span>
						</a>
					</Reveal>

					<div class="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
						{proofPoints.map((point, index) => (
							<Reveal key={point.index} animation="fadeUp" delay={index * 90}>
								<article class="group flex min-h-[166px] flex-col justify-between px-7 py-8 sm:px-9 lg:min-h-[250px] lg:px-10 lg:py-11">
									<div class="flex items-center justify-between">
										<span class="font-label-caps text-[10px] font-bold tracking-[0.18em] text-white/30">{point.index}</span>
										<span class="material-symbols-outlined text-xl text-primary transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true">{point.icon}</span>
									</div>
									<div class="mt-8">
										<h3 class="font-h3 text-base font-bold leading-tight text-white">{point.title}</h3>
										<p class="mt-3 text-sm leading-relaxed text-white/55">{point.text}</p>
									</div>
								</article>
							</Reveal>
						))}
					</div>
				</div>
				<div class="flex flex-col gap-2 border-t border-white/10 bg-black/15 px-7 py-4 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-10">
					<span>Une question avant de partir ?</span>
					<a href="https://wa.me/261340312401" target="_blank" rel="noopener noreferrer" class="font-button text-xs font-bold uppercase tracking-widest text-white transition-colors hover:text-primary">
						Réponse sur WhatsApp sous 24 h
					</a>
				</div>
			</div>
		</section>
	);
}
