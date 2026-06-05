import { Reveal } from '../../../components/ui/Reveal.jsx';
import { TourCard } from '../../../components/ui/TourCard.jsx';

export function ToursSection() {
	const tours = [
		{
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbkiY6GxuTBo45rfpYkngEJPXibulRnZJDGLsZE9CJyKkntB-6ul4tgkXtyEqmr7ZpkyfJK6UN0y4V8194bIYkrFqRVBoSU_jSit2qTsheNbQdEKbvWFqrrsUKenT4kbeNstLzmHkk3hVCqs5m__0aaFCkssynLjUWoXtKqzWDgV-WekI3pPTjh-iF73LRh1MNouj0NrqUrhjidOUSo-gQlwuNWQMrQu7JcddM0hLrNpNcFhCUM1kYL5U6ysNZVx-7Msi3vT_XLgg',
			badge: 'NIVEAU: EXTRÊME',
			date: '12 - 20 OCTOBRE 2024',
			title: 'TREK DES TSINGY',
			description: 'Une randonnée exigeante à travers les formations calcaires acérées du parc national des Tsingy de Bemaraha.',
		},
		{
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC13pMjf5SecUZ2gq-JMYA5FJ1PMDLVL8PA3-EffiynxWBBKQPmCUNAI8PJ4rtKgrWVDG7IgfNKl9Ha-vCoKStTDLfyu0JcQ7NsQb-odnZ3kksBzvTnA1m-CfogZhrgrZzfRzHlUaWdOisxkiAoMnjh36hUty0LsieH-BUFfPhtPVsZGndqquwQawzHHQAohyhRJwjtlecfPV9ZJtA4_jTu69IU72IDpXXPm65odjSv7Pgmi_nF6Fkg9csovhynGJcro8m1PLb2Amw',
			badge: 'NIVEAU: MODÉRÉ',
			date: '05 - 15 NOVEMBRE 2024',
			title: 'CÔTE SAUVAGE EN PIROGUE',
			description: 'Navigation traditionnelle et bivouacs sur des plages désertes le long de la côte sud-ouest.',
		},
		{
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu56aJAnHzpUWj7sJjqOJbkwH0zIKvzV4zQbl-8QrS6JrBFWo5qqU4INh5zm7_DUEKwjSmAJ0thPMVfRtRzoa7kMnTluycotR7_MGXLxuem-OqQdeu9C4MC1iiXbseDIZe3nIkTRzQuJ_AiynzVie3tr5GQBMf_D69P0alLhM1Keyfp7Mpb0WliOsmnSztypSzByht3ffcAfIpAdTbJ2VFmDG_gayNs0_K8pM3fATfzB7Dzz2CCDvdrOA00tzsyeJEXaMVBYFT_4I',
			badge: 'NIVEAU: DÉCOUVERTE',
			date: '01 - 08 DÉCEMBRE 2024',
			title: 'DÉCOUVERTE DE FIANARANTSOA',
			description: 'Explorez les collines verdoyantes, les vignobles et la riche culture de la région de Fianarantsoa.',
		},
	];

	return (
		<section class="relative overflow-hidden bg-surface-variant py-section-gap" id="expeditions">
			{/* Decorative blobs */}
			<div class="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
			<div class="absolute bottom-[-5rem] left-[-5rem] h-80 w-80 rounded-full bg-white/30 blur-2xl pointer-events-none" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				{/* ── Header ── */}
				<div class="mb-14 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
					<div class="max-w-2xl">
						<span class="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/70 px-4 py-2 font-label-caps text-label-caps text-on-background/70 backdrop-blur-sm">
							<span class="h-2 w-2 rounded-full bg-primary-container" />
							CALENDRIER TERRAIN
						</span>
						<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.5rem)] text-on-background font-black uppercase tracking-tighter leading-[1.05]">
							Prochains Événements
						</h2>
						<div class="section-divider mt-4 w-24" />
						<p class="mt-5 max-w-xl font-body-lg text-body-lg text-secondary leading-relaxed">
							Chaque expédition est pensée pour un petit groupe, un rythme maîtrisé et une immersion totale dans le terrain malgache.
						</p>
					</div>
					<a
						href="/events"
						class="hidden md:inline-flex items-center gap-2 self-end rounded-2xl border border-outline-variant bg-white/80 px-5 py-3 font-button text-button text-primary hover:shadow-md hover:shadow-primary/8 transition-all duration-300 cursor-pointer"
					>
						VOIR TOUT
						<span class="material-symbols-outlined text-[18px] transition-transform duration-200 group-hover:translate-x-1">arrow_forward</span>
					</a>
				</div>

				{/* ── Cards Grid ── */}
				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					{tours.map((tour, i) => (
						<Reveal key={i} animation={i % 2 === 0 ? 'fadeUp' : 'driftRight'} delay={i * 80} duration={680}>
							<TourCard {...tour} />
						</Reveal>
					))}
				</div>

				{/* Mobile CTA */}
				<a
					href="/events"
					class="w-full md:hidden mt-10 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-container text-on-primary px-5 py-3.5 font-button text-button hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
				>
					VOIR TOUT
					<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
				</a>
			</div>
		</section>
	);
}