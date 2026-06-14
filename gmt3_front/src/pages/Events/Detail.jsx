import { useState, useEffect } from 'preact/hooks';
import { Footer } from '../../components/Footer.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { TourCard } from '../../components/ui/TourCard.jsx';
import { buildPreviewGallery } from '../../utils/gallery.js';
import { img } from '../../utils/images.js';
import { parseMarkdownInline } from '../../utils/markdown.js';
import { evenementApi } from '../../api/evenements.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';
import { useToast } from '../../hooks/useToast.js';
import { formatDateTimeWithHour } from '../../utils/dateFormatter.js';

export function EventDetail({ params }) {
	const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
	const eventId = parseInt(params.id, 10);

	const transformEventForCard = (evt) => ({
		id: evt.id,
		title: evt.titre,
		description: parseMarkdownInline(evt.description),
		image: evt.imagePrincipale ? `${BACKEND}${evt.imagePrincipale}` : '',
		date: evt.dateDepart || evt.dateEvenement || '—',
		badge: 'EXPEDITION',
		slug: evt.id,
		href: `/events/${evt.id}`
	});

	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);
	const [preview, setPreview] = useState(null);
	const [previewIndex, setPreviewIndex] = useState(0);
	const [bookingModal, setBookingModal] = useState(false);
	const [bookingData, setBookingData] = useState({ nom: '', contact: '', nombrePlaces: 1 });
	const [bookingLoading, setBookingLoading] = useState(false);
	const [relatedEvents, setRelatedEvents] = useState([]);
	const { toasts, addToast, removeToast } = useToast();

	const handleBooking = async (e) => {
		e.preventDefault();
		if (!bookingData.nom || !bookingData.contact || !bookingData.nombrePlaces) {
			addToast('Veuillez remplir tous les champs', 'warning');
			return;
		}
		if (!/^\d{10}$/.test(bookingData.contact)) {
			addToast('Le contact doit être un numéro de 10 chiffres', 'warning');
			return;
		}
		setBookingLoading(true);
		try {
			const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
			const res = await fetch(`${API_BASE}/reservations`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					evenementId: eventId,
					nom: bookingData.nom,
					contact: bookingData.contact,
					nombrePlaces: parseInt(bookingData.nombrePlaces, 10),
				}),
				credentials: 'include',
			});
			const data = await res.json();
			if (!res.ok) {
				addToast(data.message || 'Erreur lors de la réservation', 'error');
				return;
			}
			addToast(data.message || 'Réservation confirmée !', 'success');
			setBookingModal(false);
			setBookingData({ nom: '', contact: '', nombrePlaces: 1 });
		} catch (err) {
			addToast((err instanceof Error ? err.message : 'Erreur inconnue'), 'error');
		} finally {
			setBookingLoading(false);
		}
	};

	useEffect(() => {
		if (!eventId || isNaN(eventId)) {
			setLoading(false);
			return;
		}

		const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
		fetch(`${API_BASE}/evenements/${eventId}`, { credentials: 'include' })
			.then((res) => {
				if (!res.ok) throw new Error('Not found');
				return res.json();
			})
			.then((data) => {
				setEvent(data);
				setLoading(false);

				// Load related events
				fetch(`${API_BASE}/evenements`, { credentials: 'include' })
					.then((r) => r.json())
					.then((response) => {
						const related = (Array.isArray(response.data) ? response.data : [])
							.filter((e) => e.estPublie && e.id !== eventId)
							.slice(0, 2)
							.map(transformEventForCard);
						setRelatedEvents(related);
					})
					.catch((err) => console.error('Error loading related events:', err));
			})
			.catch((err) => {
				console.error('Error loading event:', err);
				setLoading(false);
			});
	}, [eventId]);

	if (loading) {
		return (
			<main class="flex-grow flex items-center justify-center bg-background px-margin-mobile py-20">
				<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
			</main>
		);
	}

	if (!event) {
		return (
			<main class="flex-grow flex items-center justify-center bg-background px-margin-mobile py-20">
				<div class="max-w-xl text-center">
					<div class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
						<span class="material-symbols-outlined text-5xl">explore</span>
					</div>
					<h1 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 font-black uppercase text-primary">Événement non trouvé</h1>
					<p class="mt-4 font-body-lg text-body-lg text-secondary leading-relaxed">
						Cette page d'expédition n'existe plus ou n'a pas encore été publiée.
					</p>
					<p class="mt-2 text-xs text-secondary">(ID: {eventId})</p>
					<a
						href="/events"
						class="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
					>
						<span class="material-symbols-outlined text-[18px]">arrow_back</span>
						RETOUR AUX ÉVÉNEMENTS
					</a>
				</div>
			</main>
		);
	}

	const normalizedEvent = {
		title: event.titre,
		description: event.description,
		image: event.imagePrincipale ? `${BACKEND}${event.imagePrincipale}` : '',
		location: event.lieu || '—',
		price: event.prix ? `${Number(event.prix).toLocaleString('fr-FR')} Ar` : '—',
		duration: event.duration || '—',
		difficulty: event.difficulty || '—',
		groupSize: event.groupSize || '—',
		season: event.season || '—',
		gallery: (event.photosEvenement || []).map(p => `${BACKEND}${p.url}`),
		badge: 'EXPEDITION',
		date: event.dateDepart || event.dateEvenement || '—',
		slug: event.id,
		highlights: event.highlights || [],
		itinerary: event.itinerary || [],
	};

	const gallery = buildPreviewGallery(normalizedEvent.image, normalizedEvent.gallery || []);
	const facts = [
		{ label: 'Localisation', value: normalizedEvent.location || '—' },
		{ label: 'Durée', value: event.duration || normalizedEvent.duration || '—' },
		{ label: 'Difficulté', value: normalizedEvent.difficulty || '—' },
		{ label: 'Taille du groupe', value: normalizedEvent.groupSize || '—' },
		{ label: 'Saison', value: normalizedEvent.season || '—' },
		{ label: 'Prix', value: normalizedEvent.price || '—' },
	];

	const calculateDays = () => {
		if (!event.dateDepart || !event.dateRetour) return 0;
		try {
			const start = new Date(event.dateDepart.split('/').reverse().join('-'));
			const end = new Date(event.dateRetour.split('/').reverse().join('-'));
			return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
		} catch {
			return 0;
		}
	};
	const totalDays = calculateDays();
	const itineraryWithDays = normalizedEvent.itinerary.map((step, idx) => ({
		day: idx + 1,
		description: step,
		totalDays
	}));
	
	const departInfo = event.dateDepart ? {
		date: event.dateDepart,
		time: event.heureDepart
	} : null;
	const retourInfo = event.dateRetour ? {
		date: event.dateRetour,
		time: event.heureRetour
	} : null;

	return (
		<>
			<main class="flex-grow pb-section-gap">
				<section class="relative overflow-hidden bg-on-secondary-fixed">
					<div class="absolute inset-0">
						<div class="absolute inset-0 bg-cover bg-center scale-105" style={`background-image: url('${normalizedEvent.image}')`} />
						<div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
						<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(227,30,36,0.35),_transparent_55%)]" />
					</div>
					<div class="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full py-20 md:py-24">
						<div class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
							<div class="max-w-3xl">
								<Reveal animation="fadeUp" duration={760}>
									<div class="flex flex-wrap items-center gap-3">
										<a href="/events" class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 px-4 py-2 font-label-caps text-label-caps text-on-primary/85 transition-colors hover:bg-white/16">
											<span class="material-symbols-outlined text-[18px]">arrow_back</span>
											TOUS LES ÉVÉNEMENTS
										</a>
										<span class="rounded-full bg-primary-container px-4 py-2 font-label-caps text-label-caps text-on-primary shadow-lg shadow-primary/20">
											{normalizedEvent.badge}
										</span>
										<span class="rounded-full border border-white/15 bg-white/12 px-4 py-2 font-label-caps text-label-caps text-on-primary/85">
											{normalizedEvent.date}
										</span>
									</div>
								</Reveal>
								<Reveal animation="arc" delay={60} duration={840}>
									<h1 class="mt-6 font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 font-black uppercase tracking-tighter leading-[1.02] text-on-primary">
										{normalizedEvent.title}
									</h1>
								</Reveal>
								<Reveal animation="fadeUp" delay={120} duration={760}>
									<p class="mt-6 max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-primary/80" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(normalizedEvent.description) }} />
								</Reveal>
								<Reveal animation="driftRight" delay={180} duration={820}>
									<div class="mt-8 flex flex-col sm:flex-row items-start gap-4">
										<a
											href="#details"
											class="inline-flex items-center gap-2 rounded-2xl bg-primary-container px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-primary/20 cursor-pointer"
										>
											EXPLORER LES DÉTAILS
											<span class="material-symbols-outlined text-[18px]">south</span>
										</a>
										<a
											href="#related"
											class="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:bg-white/12 hover:shadow-lg hover:shadow-black/15 cursor-pointer"
										>
											ÉVÉNEMENTS CONNEXES
										</a>
									</div>
								</Reveal>
							</div>

							<Reveal animation="fadeUp" delay={120} duration={820} className="lg:justify-self-end">
								<aside class="w-full rounded-[1.75rem] border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 text-on-primary shadow-lg shadow-primary/20">
									<div class="flex items-center justify-between gap-4 border-b border-primary/20 pb-5">
										<div>
											<p class="font-label-caps text-label-caps text-primary/80 font-bold uppercase tracking-wider">À partir de</p>
											<p class="mt-3 font-h1 text-4xl md:text-5xl font-black text-primary drop-shadow-lg">{normalizedEvent.price}</p>
											<p class="mt-2 text-sm text-on-primary/60">par personne</p>
										</div>
										<div class="rounded-2xl bg-primary px-5 py-4 text-white shadow-xl shadow-primary/30 flex items-center justify-center h-fit">
											<span class="material-symbols-outlined text-4xl">card_giftcard</span>
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
										<p class="font-label-caps text-label-caps text-on-primary/60">Points forts de l'expérience</p>
										<ul class="mt-3 space-y-3">
											{(event.highlights || []).map((highlight) => (
												<li class="flex items-start gap-3 font-body-md text-body-md text-on-primary/85 leading-relaxed">
													<span class="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary">
														<span class="material-symbols-outlined text-[15px]">check</span>
													</span>
													{highlight}
												</li>
											))}
										</ul>
									</div>

									<button
										type="button"
										onClick={() => setBookingModal(true)}
										class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
									>
										PARTICIPER
										<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
									</button>
								</aside>
							</Reveal>
						</div>
					</div>
				</section>

				<section id="details" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full -mt-10">
					<div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
						<Reveal animation="fadeUp" duration={760}>
							<article class="rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md p-6 shadow-md shadow-black/5 md:p-8">
								<div class="flex items-center justify-between gap-4">
									<div>
										<p class="font-label-caps text-label-caps text-secondary">Aperçu de l'expérience</p>
										<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight text-on-background">
											Conçu pour l'immersion
										</h2>
									</div>
									<div class="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
										<span class="material-symbols-outlined text-3xl">map</span>
									</div>
								</div>
								<p class="mt-6 font-body-lg text-body-lg leading-relaxed text-secondary" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(normalizedEvent.description) }} />
								<div class="mt-8 grid gap-4 sm:grid-cols-2">
									{facts.slice(4).map((fact) => (
										<div class="rounded-2xl border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md p-5">
											<p class="font-label-caps text-label-caps text-secondary">{fact.label}</p>
											<p class="mt-2 font-body-md text-body-md font-semibold text-on-background">{fact.value}</p>
										</div>
									))}
								</div>
								<div class="mt-8 rounded-[1.5rem] bg-gradient-to-br from-primary/8 via-primary/4 to-transparent p-5">
									<p class="font-label-caps text-label-caps text-primary">Ce que vous expérimenterez</p>
									<ul class="mt-4 space-y-4">
										{normalizedEvent.highlights.map((highlight, index) => (
											<li class="flex items-start gap-4">
												<div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary shadow-md shadow-primary/15">
													<span class="font-button text-button text-xs">{index + 1}</span>
											
												</div>
												<p class="font-body-md text-body-md leading-relaxed text-secondary">{highlight}</p>
											</li>
										))}
									</ul>
								</div>
								<div class="mt-8">
									<div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
										<div>
											<p class="font-label-caps text-label-caps text-secondary">Aperçus des photos</p>
											<h3 class="mt-2 font-h3 text-h3 font-black uppercase tracking-tight text-on-background">
												{gallery.length} cadres sélectionnés
											</h3>
										</div>
										<p class="max-w-md font-body-md text-body-md leading-relaxed text-secondary sm:text-right">
											Galerie photo des lieux que vous allez explorer.
										</p>
									</div>
									<div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
										{gallery.map((src, idx) => (
											<button
												key={`${normalizedEvent.slug}-${idx}`}
												type="button"
												onClick={() => { setPreviewIndex(idx); setPreview({ url: img(src), title: `${normalizedEvent.title} photo ${idx + 1}` }); }}
												class="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant/70 bg-surface-container shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/10 cursor-pointer"
											>
												<img
													src={img(src)}
													alt={`${normalizedEvent.title} preview ${idx + 1}`}
													class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
													loading="lazy"
													referrerPolicy="no-referrer"
												/>
												<div class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
											</button>
										))}
									</div>
								</div>
							</article>
						</Reveal>

						<Reveal animation="driftRight" delay={80} duration={820}>
							<aside class="space-y-6 lg:sticky lg:top-24">
								<div class="rounded-[1.75rem] border border-outline-variant/70 bg-on-secondary-fixed p-6 text-on-primary shadow-md shadow-black/10">
									<p class="font-label-caps text-label-caps text-on-primary/60">Rythme du voyage</p>
									<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight">Flux jour par jour</h2>
									<div class="mt-2 text-sm text-on-primary/60">{totalDays > 0 ? `${totalDays} jours` : ""}</div>
										{(departInfo || retourInfo) && (
											<div class="mt-6 space-y-3 pb-6 border-b border-primary/20">
												{departInfo && (
													<div class="flex items-start gap-3">
														<span class="material-symbols-outlined text-xl text-primary flex-shrink-0 mt-0.5">flight_takeoff</span>
														<div>
															<p class="font-label-caps text-label-caps text-on-primary/60 text-xs">Départ</p>
															<p class="mt-1 font-body-md text-body-md font-semibold text-on-primary">{formatDateTimeWithHour(departInfo.date, departInfo.time)}</p>
														</div>
													</div>
												)}
												{retourInfo && (
													<div class="flex items-start gap-3">
														<span class="material-symbols-outlined text-xl text-primary flex-shrink-0 mt-0.5">flight_land</span>
														<div>
															<p class="font-label-caps text-label-caps text-on-primary/60 text-xs">Retour</p>
															<p class="mt-1 font-body-md text-body-md font-semibold text-on-primary">{formatDateTimeWithHour(retourInfo.date, retourInfo.time)}</p>
														</div>
													</div>
												)}
											</div>
										)}
										<div class="mt-6 space-y-4">
										{itineraryWithDays.map(({ day, description, totalDays: total }) => (
											<div class="flex gap-4">
												<div class="flex flex-col h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-on-primary shadow-lg shadow-primary/20">
													<span class="font-button text-button text-xs">{day}</span>
											{total > 0 && <span class="text-[10px] text-on-primary/70">/{total}</span>}
												</div>
												<p class="pt-1 font-body-md text-body-md leading-relaxed text-on-primary/82">{description}</p>
											</div>
										))}
									</div>
								</div>

								<div class="rounded-[1.75rem] border border-white/20 bg-gradient-to-br from-white/90 via-white/65 to-white/30 backdrop-blur-md p-6 shadow-md shadow-black/5">
									<p class="font-label-caps text-label-caps text-secondary">Actions rapides</p>
									<div class="mt-5 grid gap-3">
										<a
											href="/events"
											class="inline-flex items-center justify-center gap-2 rounded-2xl border border-outline-variant px-5 py-4 font-button text-button text-primary transition-all duration-300 hover:bg-primary/10 hover:shadow-md cursor-pointer"
										>
											<span class="material-symbols-outlined text-[18px]">arrow_back</span>
											RETOUR À LA LISTE
										</a>
										<button
											type="button"
											onClick={() => setBookingModal(true)}
											class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
										>
											PARTICIPER
											<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
										</button>
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
								<p class="font-label-caps text-label-caps text-secondary">Continuer l'exploration</p>
								<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight text-on-background">Expéditions connexes</h2>
							</div>
							<a href="/events" class="hidden md:inline-flex items-center gap-2 font-button text-button text-primary transition-colors hover:text-primary-container">
								VOIR TOUT
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
			<ImagePreview
				image={preview}
				onClose={() => setPreview(null)}
				onNext={() => {
					const nextIdx = (previewIndex + 1) % gallery.length;
					setPreviewIndex(nextIdx);
					setPreview({ url: img(gallery[nextIdx]), title: `${normalizedEvent.title} photo ${nextIdx + 1}` });
				}}
				onPrev={() => {
					const prevIdx = (previewIndex - 1 + gallery.length) % gallery.length;
					setPreviewIndex(prevIdx);
					setPreview({ url: img(gallery[prevIdx]), title: `${normalizedEvent.title} photo ${prevIdx + 1}` });
				}}
				hasNext={gallery.length > 1}
				hasPrev={gallery.length > 1}
			/>

			{bookingModal && (
				<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
					<div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
						<h3 class="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Participer</h3>
						<form onSubmit={handleBooking} class="space-y-4">
							<div>
								<label class="text-sm font-semibold text-gray-700 block mb-2" for="nom">Nom</label>
								<input
									id="nom"
									type="text"
									placeholder="Votre nom"
									value={bookingData.nom}
									onInput={(e) => setBookingData({ ...bookingData, nom: e.currentTarget.value })}
									class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
									required
								/>
							</div>
							<div>
								<label class="text-sm font-semibold text-gray-700 block mb-2" for="contact">Contact (10 chiffres)</label>
								<input
									id="contact"
									type="tel"
									inputMode="numeric"
									placeholder="0340000000"
									maxLength="10"
									value={bookingData.contact}
									onInput={(e) => {
										const value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
										setBookingData({ ...bookingData, contact: value });
									}}
									class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
									required
								/>
							</div>
							<div>
								<label class="text-sm font-semibold text-gray-700 block mb-2" for="nombrePlaces">Nombre de personne</label>
								<input
									id="nombrePlaces"
									type="number"
									min="1"
									max="10"
									value={bookingData.nombrePlaces}
									onInput={(e) => setBookingData({ ...bookingData, nombrePlaces: parseInt(e.currentTarget.value, 10) || 1 })}
									class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
									required
								/>
							</div>
							<div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
								<button
									type="button"
									onClick={() => setBookingModal(false)}
									class="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all"
									disabled={bookingLoading}
								>
									Annuler
								</button>
								<button
									type="submit"
									class="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
									disabled={bookingLoading}
								>
									{bookingLoading ? 'En cours...' : 'Confirmer'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</>
	);
}


