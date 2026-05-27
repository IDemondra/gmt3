import { Reveal } from '../../components/ui/Reveal.jsx';
import { TourCard } from '../../components/ui/TourCard.jsx';
import { Footer } from '../../components/Footer.jsx';
import { upcomingEvents } from '../../data/upcomingEvents.js';

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
							<TourCard {...event} href={`/events/${event.slug}`} />
						</Reveal>
					))}
				</div>
			</section>
		</main>
		<Footer />
		</>
	);
}
