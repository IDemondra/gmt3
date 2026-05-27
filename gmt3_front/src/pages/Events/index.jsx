import { Reveal } from '../../components/ui/Reveal.jsx';
import { TourCard } from '../../components/ui/TourCard.jsx';
import { Footer } from '../../components/Footer.jsx';

const upcomingEvents = [
	{
		img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp-WIeKr_a7VCmtcqnIFUlqRrFWsSSgE1Flw-1ab94TTrxSmlltLXWtOaqQ2_Uy3L_6BwllDGxshfnJ_emrhTdUrZKhnY8OOJ3shRHtfFn7Riop9OlCPRqMt2GSkToYX4pjlV8m-q78VdV6-rNYMckztRxBOwNF72FgxFsBC5S2nUjLVy6LD9ELFCWhvMYg-gQqnm4hRU_b5ofzaNe2VcAa_6yfhJtoUcFIsTEyRVko1hj2XtHVk_ocv5egThycNYJ3agjXgBrDaM',
		badge: 'EXTREME TREK',
		date: '15 - 22 OCTOBRE 2024',
		title: 'DÉFI DES TSINGY',
		description: 'Traversez les forêts de calcaire les plus abruptes de Madagascar lors d’une expédition exigeante pensée pour les marcheurs expérimentés.',
	},
	{
		img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Tj3wID0H6VbGQcK05TnegTtu6Fa5S7CQiR1nRH3Vn2FgLbrg8G15VQOeSO0FSZqMIP9J6O7bP-yDHQMv3PNl0QvWwNprl4uEJxW7Wb8TGrFG-EGyEBO4pII2znSImeT7xn4RWAau2XtDNQcT7YDNMLU8_YANrCTImaKpb-Rp5285BIGTCUoUQBGbclD6Zcc9JkwzQfwNbUA_qp9W9FbiAhIxPzd5gGPWX-2JE-jW3vcfPqcdO9EKtdGFeZK_LaiOC6hQhRWpu94',
		badge: 'WILDLIFE',
		date: '02 - 05 NOVEMBRE 2024',
		title: 'SUIVI DES LÉMURIENS',
		description: 'Partez au cœur d’Andasibe pour observer des espèces rares dans leur habitat naturel et préservé.',
	},
	{
		img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYJTEHnnc--WHOQ2V2aJ0luE0SsWDUG_KvejUxd98vb4G0Cs179gmDf1YjKVOyDDFNn4y6kCuugQrMNPx5zNeqma25kEvobaTngOO0K9GG-eA1KsmUUdVXcEhEDNriKc3wtdPnL_jlQYaYh0-UPRTRBIavCwRWDg9s8sfnRfMTIlnLeAxcKrfReqf0ycC7VJY0EBGcrTPi9y8lGRP7mdmYdif7tk3IXMHUfKHgNazhIs9owP7e0q9mj6sU0-a3PIp4FoS2eXiYxQ',
		badge: 'PHOTOGRAPHY',
		date: '10 - 14 DÉCEMBRE 2024',
		title: 'MASTERCLASS COUCHER DE SOLEIL',
		description: 'Capturez l’avenue des Baobabs sous une lumière spectaculaire avec l’accompagnement de photographes reconnus.',
	},
];

export function Events() {
	return (
		<>
		<main class="flex-grow flex flex-col pb-section-gap">
			<section class="relative overflow-hidden bg-inverse-surface py-20">
				<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,30,36,0.3),_transparent_60%)]" />
				<div class="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
					<Reveal animation="fadeUp" duration={1100}>
						<span class="inline-block bg-primary-container px-4 py-1.5 font-label-caps text-label-caps mb-5 uppercase rounded-lg text-on-primary">EXPLOREZ NOS</span>
					</Reveal>
					<Reveal animation="arc" delay={90} duration={1200}>
						<h1 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 text-on-primary mb-5 uppercase tracking-tighter font-black">
							PROCHAINES EVENNEMENTS
						</h1>
					</Reveal>
					<Reveal animation="fadeUp" delay={180} duration={1100}>
						<p class="font-body-lg text-body-lg text-on-primary/70 max-w-2xl leading-relaxed">
							Découvrez nos prochaines expéditions à Madagascar avec des cartes éditoriales premium, conçues pour mettre en avant chaque aventure avec clarté et impact.
						</p>
					</Reveal>
				</div>
			</section>

			<section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full -mt-6">
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter xl:gap-8">
					{upcomingEvents.map((event, i) => (
						<Reveal key={event.title} animation={i % 2 === 0 ? 'driftLeft' : 'driftRight'} delay={i * 120} duration={1200}>
							<TourCard {...event} />
						</Reveal>
					))}
				</div>
			</section>
		</main>
		<Footer />
		</>
	);
}
