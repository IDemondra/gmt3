import { Footer } from '../../components/Footer.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { TourCard } from '../../components/ui/TourCard.jsx';
import { img } from '../../utils/images.js';
import { getUpcomingEventBySlug, upcomingEvents } from '../../data/upcomingEvents.js';

export function EventDetail({ params }) {
	const event = getUpcomingEventBySlug(params.slug);

	if (!event) {
		return (
			<main class="flex-grow flex items-center justify-center bg-background px-margin-mobile py-20">
				<div class="max-w-xl text-center">
					<div class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
						<span class="material-symbols-outlined text-5xl">explore</span>
					</div>
					<h1 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 font-black uppercase text-primary">Event not found</h1>
					<p class="mt-4 font-body-lg text-body-lg text-secondary leading-relaxed">
						This expedition page no longer exists or has not been published yet.
					</p>
					<a
						href="/events"
						class="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-95"
					>
						<span class="material-symbols-outlined text-[18px]">arrow_back</span>
						BACK TO EVENTS
					</a>
				</div>
			</main>
		);
	}

	const relatedEvents = upcomingEvents.filter((item) => item.slug !== event.slug).slice(0, 2);
	const facts = [
		{ label: 'Location', value: event.location },
		{ label: 'Duration', value: event.duration },
		{ label: 'Difficulty', value: event.difficulty },
		{ label: 'Group size', value: event.groupSize },
		{ label: 'Season', value: event.season },
		{ label: 'Price', value: event.price },
	];

	return (
		<>
			<main class="flex-grow pb-section-gap">
				<section class="relative overflow-hidden bg-inverse-surface">
					<div class="absolute inset-0">
						<div class="absolute inset-0 bg-cover bg-center scale-105" style={`background-image: url('${img(event.image)}')`} />
						<div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
						<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(227,30,36,0.35),_transparent_55%)]" />
					</div>
					<div class="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full py-20 md:py-24">
						<div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
							<div class="max-w-3xl">
								<Reveal animation="fadeUp" duration={760}>
									<div class="flex flex-wrap items-center gap-3">
										<a href="/events" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-label-caps text-label-caps text-on-primary/85 backdrop-blur-md transition-colors hover:bg-white/15">
											<span class="material-symbols-outlined text-[18px]">arrow_back</span>
											ALL EVENTS
										</a>
										<span class="rounded-full bg-primary-container px-4 py-2 font-label-caps text-label-caps text-on-primary shadow-lg shadow-primary/20">
											{event.badge}
										</span>
										<span class="rounded-full border border-white/15 bg-white/10 px-4 py-2 font-label-caps text-label-caps text-on-primary/85 backdrop-blur-md">
											{event.date}
										</span>
									</div>
								</Reveal>
								<Reveal animation="arc" delay={60} duration={840}>
									<h1 class="mt-6 font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 font-black uppercase tracking-tighter leading-[1.02] text-on-primary">
										{event.title}
									</h1>
								</Reveal>
								<Reveal animation="fadeUp" delay={120} duration={760}>
									<p class="mt-6 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-primary/80">
										{event.description}
									</p>
								</Reveal>
								<Reveal animation="driftRight" delay={180} duration={820}>
									<div class="mt-8 flex flex-col sm:flex-row items-start gap-4">
										<a
											href="#details"
											class="inline-flex items-center gap-2 rounded-2xl bg-primary-container px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 active:scale-95"
										>
											EXPLORE DETAILS
											<span class="material-symbols-outlined text-[18px]">south</span>
										</a>
										<a
											href="#related"
											class="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-button text-button text-on-primary backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20 active:scale-95"
										>
											RELATED EVENTS
										</a>
									</div>
								</Reveal>
							</div>

							<Reveal animation="fadeUp" delay={120} duration={820} className="lg:justify-self-end">
								<aside class="w-full rounded-[1.75rem] border border-white/15 bg-white/10 p-6 text-on-primary shadow-2xl shadow-black/20 backdrop-blur-xl">
									<div class="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
										<div>
											<p class="font-label-caps text-label-caps text-on-primary/70">Starting from</p>
											<p class="mt-2 font-h2 text-h2 font-black">{event.price}</p>
										</div>
										<div class="rounded-2xl bg-primary-container px-4 py-3 text-on-primary shadow-lg shadow-primary/20">
											<span class="material-symbols-outlined text-3xl">local_fire_department</span>
										</div>
									</div>

									<div class="mt-5 grid grid-cols-2 gap-3">
										{facts.slice(0, 4).map((fact) => (
											<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
												<p class="font-label-caps text-label-caps text-on-primary/60">{fact.label}</p>
												<p class="mt-2 font-body-md text-body-md font-semibold text-on-primary leading-snug">{fact.value}</p>
											</div>
										))}
									</div>

									<div class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
										<p class="font-label-caps text-label-caps text-on-primary/60">Experience highlights</p>
										<ul class="mt-3 space-y-3">
											{event.highlights.map((highlight) => (
												<li class="flex items-start gap-3 font-body-md text-body-md text-on-primary/85 leading-relaxed">
													<span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary">
														<span class="material-symbols-outlined text-[15px]">check</span>
													</span>
													{highlight}
												</li>
											))}
										</ul>
									</div>

									<a
										href="#contact"
										class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 active:scale-95"
									>
										BOOK THIS EXPERIENCE
										<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
									</a>
								</aside>
							</Reveal>
						</div>
					</div>
				</section>

				<section id="details" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full -mt-10">
					<div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
						<Reveal animation="fadeUp" duration={760}>
							<article class="rounded-[1.75rem] border border-outline-variant/70 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm md:p-8">
								<div class="flex items-center justify-between gap-4">
									<div>
										<p class="font-label-caps text-label-caps text-secondary">Experience overview</p>
										<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight text-on-background">
											Designed for immersion
										</h2>
									</div>
									<div class="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
										<span class="material-symbols-outlined text-3xl">map</span>
									</div>
								</div>
								<p class="mt-6 font-body-lg text-body-lg leading-relaxed text-secondary">
									{event.description}
								</p>
								<div class="mt-8 grid gap-4 sm:grid-cols-2">
									{facts.slice(4).map((fact) => (
										<div class="rounded-2xl border border-outline-variant/70 bg-surface-variant/50 p-5">
											<p class="font-label-caps text-label-caps text-secondary">{fact.label}</p>
											<p class="mt-2 font-body-md text-body-md font-semibold text-on-background">{fact.value}</p>
										</div>
									))}
								</div>
								<div class="mt-8 rounded-[1.5rem] bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-5">
									<p class="font-label-caps text-label-caps text-primary">What you will experience</p>
									<ul class="mt-4 space-y-4">
										{event.highlights.map((highlight, index) => (
											<li class="flex items-start gap-4">
												<div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-md shadow-primary/15">
													<span class="font-button text-button">{index + 1}</span>
												</div>
												<p class="font-body-md text-body-md leading-relaxed text-secondary">{highlight}</p>
											</li>
										))}
									</ul>
								</div>
							</article>
						</Reveal>

						<Reveal animation="driftRight" delay={80} duration={820}>
							<aside class="space-y-6 lg:sticky lg:top-24">
								<div class="rounded-[1.75rem] border border-outline-variant/70 bg-inverse-surface p-6 text-on-primary shadow-xl shadow-black/10">
									<p class="font-label-caps text-label-caps text-on-primary/60">Trip rhythm</p>
									<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight">Day by day flow</h2>
									<div class="mt-6 space-y-4">
										{event.itinerary.map((step, index) => (
											<div class="flex gap-4">
												<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary shadow-lg shadow-primary/20">
													<span class="font-button text-button">{index + 1}</span>
												</div>
												<p class="pt-1 font-body-md text-body-md leading-relaxed text-on-primary/82">{step}</p>
											</div>
										))}
									</div>
								</div>

								<div class="rounded-[1.75rem] border border-outline-variant/70 bg-white/85 p-6 shadow-xl shadow-black/5 backdrop-blur-sm">
									<p class="font-label-caps text-label-caps text-secondary">Quick actions</p>
									<div class="mt-5 grid gap-3">
										<a
											href="/events"
											class="inline-flex items-center justify-center gap-2 rounded-2xl border border-outline-variant px-5 py-4 font-button text-button text-primary transition-all duration-300 hover:bg-primary/10 hover:scale-[1.01] active:scale-95"
										>
											<span class="material-symbols-outlined text-[18px]">arrow_back</span>
											BACK TO LIST
										</a>
										<a
											href="#contact"
											class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-button text-button text-on-primary transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/20 active:scale-95"
										>
											BOOK NOW
											<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
										</a>
									</div>
								</div>
							</aside>
						</Reveal>
					</div>
				</section>

				<section id="related" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mt-20">
					<Reveal animation="fadeUp" duration={760}>
						<div class="flex items-end justify-between gap-4 mb-8">
							<div>
								<p class="font-label-caps text-label-caps text-secondary">Continue exploring</p>
								<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight text-on-background">Related expeditions</h2>
							</div>
							<a href="/events" class="hidden md:inline-flex items-center gap-2 font-button text-button text-primary transition-colors hover:text-primary-container">
								VIEW ALL
								<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
							</a>
						</div>
					</Reveal>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter xl:gap-8">
						{relatedEvents.map((related, index) => (
							<Reveal key={related.slug} animation={index % 2 === 0 ? 'fadeLeft' : 'fadeRight'} delay={index * 80} duration={820}>
								<TourCard {...related} href={`/events/${related.slug}`} />
							</Reveal>
						))}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
