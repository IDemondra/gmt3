import { Reveal } from '../../../components/ui/Reveal.jsx';
import { TourCard } from '../../../components/ui/TourCard.jsx';
import { img } from '../../../utils/images.js';

export function ToursSection() {
	const tours = [
		{
			id: 'MSN-2410',
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbkiY6GxuTBo45rfpYkngEJPXibulRnZJDGLsZE9CJyKkntB-6ul4tgkXtyEqmr7ZpkyfJK6UN0y4V8194bIYkrFqRVBoSU_jSit2qTsheNbQdEKbvWFqrrsUKenT4kbeNstLzmHkk3hVCqs5m__0aaFCkssynLjUWoXtKqzWDgV-WekI3pPTjh-iF73LRh1MNouj0NrqUrhjidOUSo-gQlwuNWQMrQu7JcddM0hLrNpNcFhCUM1kYL5U6ysNZVx-7Msi3vT_XLgg',
			badge: 'EXTRÊME',
			date: '12 - 20 OCTOBRE 2024',
			title: 'TREK DES TSINGY',
			description: 'Une randonnée exigeante à travers les formations calcaires acérées du parc national des Tsingy de Bemaraha.',
			capacity: '03 places restantes'
		},
		{
			id: 'MSN-2411',
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC13pMjf5SecUZ2gq-JMYA5FJ1PMDLVL8PA3-EffiynxWBBKQPmCUNAI8PJ4rtKgrWVDG7IgfNKl9Ha-vCoKStTDLfyu0JcQ7NsQb-odnZ3kksBzvTnA1m-CfogZhrgrZzfRzHlUaWdOisxkiAoMnjh36hUty0LsieH-BUFfPhtPVsZGndqquwQawzHHQAohyhRJwjtlecfPV9ZJtA4_jTu69IU72IDpXXPm65odjSv7Pgmi_nF6Fkg9csovhynGJcro8m1PLb2Amw',
			badge: 'MODÉRÉ',
			date: '05 - 15 NOVEMBRE 2024',
			title: 'CÔTE SAUVAGE EN PIROGUE',
			description: 'Navigation traditionnelle et bivouacs sur des plages désertes le long de la côte sud-ouest.',
			capacity: '05 places restantes'
		},
		{
			id: 'MSN-2412',
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu56aJAnHzpUWj7sJjqOJbkwH0zIKvzV4zQbl-8QrS6JrBFWo5qqU4INh5zm7_DUEKwjSmAJ0thPMVfRtRzoa7kMnTluycotR7_MGXLxuem-OqQdeu9C4MC1iiXbseDIZe3nIkTRzQuJ_AiynzVie3tr5GQBMf_D69P0alLhM1Keyfp7Mpb0WliOsmnSztypSzByht3ffcAfIpAdTbJ2VFmDG_gayNs0_K8pM3fATfzB7Dzz2CCDvdrOA00tzsyeJEXaMVBYFT_4I',
			badge: 'DÉCOUVERTE',
			date: '01 - 08 DÉCEMBRE 2024',
			title: 'DÉCOUVERTE DE FIANARANTSOA',
			description: 'Explorez les collines verdoyantes, les vignobles et la riche culture de la région de Fianarantsoa.',
			capacity: 'COMPLET'
		},
	];

	return (
		<section class="relative overflow-hidden bg-[#faf9f6] py-section-gap" id="expeditions">
			{/* Technical Background */}
			<div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
				style="background-image: radial-gradient(#1a1c1c 1px, transparent 1px); background-size: 20px 20px;" />
			
			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				
				{/* ── Header ── */}
				<div class="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
					<div class="max-w-2xl">
						<Reveal animation="fadeUp">
							<div class="flex items-center gap-3 mb-6">
								<div class="h-2 w-2 rounded-full bg-primary" />
								<span class="font-label-caps text-label-caps tracking-[0.3em] text-on-background/40 font-bold uppercase">Chronologie Terrain</span>
							</div>
							<h2 class="font-h2 text-h2 md:text-6xl text-on-background font-black uppercase tracking-tighter leading-none">
								Prochains <br /> <span class="text-primary">Événements</span>
							</h2>
							<p class="mt-8 font-body-lg text-secondary leading-relaxed">
								Suivez le fil de nos prochaines incursions. Des dates fermes, des groupes restreints et une logistique sans faille pour une immersion totale.
							</p>
						</Reveal>
					</div>
					
					<Reveal animation="fadeLeft">
						<a href="/events" class="group flex items-center gap-4 px-8 py-4 rounded-full border border-outline-variant bg-white shadow-sm hover:shadow-xl hover:bg-primary hover:text-white transition-all duration-500">
							<span class="font-button text-xs tracking-widest font-bold">CALENDRIER COMPLET</span>
							<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">calendar_month</span>
						</a>
					</Reveal>
				</div>

				{/* ── Vertical Timeline ── */}
				<div class="relative">
					{/* The Central Line */}
					<div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/10 to-transparent md:-translate-x-1/2" />

					<div class="space-y-24 relative">
						{tours.map((tour, i) => (
							<Reveal key={i} animation={i % 2 === 0 ? 'fadeRight' : 'fadeLeft'} delay={i * 100}>
								<div class={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
									
									{/* Photo Module */}
									<div class="w-full md:w-1/2">
										<div class="group relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
											<div class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={`background-image: url('${img(tour.image)}')`} />
											<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
											
											{/* Mission Overlay */}
											<div class="absolute top-4 right-4 flex flex-col items-end gap-2">
												<span class="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[9px] text-white font-bold tracking-widest rounded-sm">
													{tour.id}
												</span>
												<span class={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-sm shadow-lg ${tour.capacity === 'COMPLET' ? 'bg-stone-500 text-white' : 'bg-primary text-white'}`}>
													{tour.capacity}
												</span>
											</div>
										</div>
									</div>

									{/* Timeline Node (The Circle) */}
									<div class="absolute left-4 md:left-1/2 h-10 w-10 rounded-full border-4 border-[#faf9f6] bg-white shadow-lg md:-translate-x-1/2 flex items-center justify-center z-10 transition-transform hover:scale-125 hover:rotate-45">
										<div class={`h-3 w-3 rounded-full ${tour.capacity === 'COMPLET' ? 'bg-stone-400' : 'bg-primary'}`} />
									</div>

									{/* Content Module */}
									<div class={`w-full md:w-1/2 text-left ${i % 2 !== 0 ? 'md:text-right' : ''}`}>
										<div class={`flex flex-col ${i % 2 !== 0 ? 'md:items-end' : 'md:items-start'} gap-4`}>
											<span class="inline-flex items-center gap-2 font-label-caps text-[10px] tracking-[0.3em] text-primary font-bold">
												<span class="material-symbols-outlined text-sm">event</span>
												{tour.date}
											</span>
											
											<h3 class="font-h2 text-2xl md:text-3xl font-black text-on-background uppercase tracking-tighter leading-tight max-w-sm">
												{tour.title}
											</h3>
											
											<div class={`flex items-center gap-3 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
												<span class="px-2 py-1 rounded bg-stone-100 text-[9px] font-bold text-secondary tracking-widest border border-stone-200 uppercase">
													NIVEAU {tour.badge}
												</span>
												<div class="h-1 w-8 bg-primary/20" />
											</div>

											<p class="font-body-md text-secondary leading-relaxed max-w-md">
												{tour.description}
											</p>
											
											<a href={`/events/${tour.title.toLowerCase().replace(/ /g, '-')}`} class="mt-4 flex items-center gap-2 font-button text-xs tracking-widest text-on-background hover:text-primary transition-colors group">
												CONSULTER LA FICHE MISSION
												<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">north_east</span>
											</a>
										</div>
									</div>
								</div>
							</Reveal>
						))}
					</div>
				</div>

				{/* ── Technical Footer ── */}
				<div class="mt-24 rounded-3xl bg-white border border-outline-variant p-8 md:p-12 shadow-sm overflow-hidden relative">
					<div class="absolute top-0 right-0 p-8 opacity-5">
						<span class="material-symbols-outlined text-9xl">pending_actions</span>
					</div>
					
					<div class="relative z-10 grid md:grid-cols-[1fr_auto] items-center gap-10">
						<div>
							<h4 class="text-xl font-bold text-on-background uppercase tracking-tight">Expéditions personnalisées ?</h4>
							<p class="mt-2 text-secondary font-body-md">Nos équipes sont prêtes à calibrer un itinéraire spécifique pour votre groupe ou projet.</p>
						</div>
						<a href="#contact" class="px-10 py-5 bg-on-background text-white font-button text-xs tracking-[0.2em] font-bold uppercase rounded-full hover:bg-primary transition-colors shadow-xl">
							DEMANDER UN DEVIS TERRAIN
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}