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
		<section class="py-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto" id="expeditions">
			<div class="flex justify-between items-end mb-12">
				<div>
					<h2 class="font-h2 text-h2 text-on-background font-bold mb-2">PROCHAINES EVENNEMENTS</h2>
					<div class="h-1 w-24 bg-primary-container"></div>
				</div>
				<a class="hidden md:flex items-center gap-2 text-primary font-button text-button hover:text-[#C62828]" href="#">
					VOIR TOUT <span class="material-symbols-outlined">arrow_forward</span>
				</a>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
				{tours.map((tour, i) => (
					<TourCard key={i} {...tour} />
				))}
			</div>
			<button class="w-full md:hidden mt-8 font-button text-button bg-primary-container text-on-primary px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300">
				VOIR TOUT
			</button>
		</section>
	);
}