import { useState, useEffect, useRef } from 'preact/hooks';
import { Footer } from '../../components/Footer.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
import { OngoingBadge, EventDescription, DesktopParticipationAction, SidebarParticipationAction, MobileParticipationAction, TravelDetails } from '../../components/admin/EventDetailSections.jsx';
import { EventReviews } from '../../components/admin/EventReviews.jsx';
import { Reveal } from '../../components/ui/Reveal.jsx';
import { TourCard } from '../../components/ui/TourCard.jsx';
import { BlurBackgroundImage } from '../../components/ui/BlurBackgroundImage.jsx';
import { BlurImg } from '../../components/ui/BlurImg.jsx';
import { buildPreviewGallery } from '../../utils/gallery.js';
import { img } from '../../utils/images.js';
import { evenementApi } from '../../api/evenements.js';
import { createAvisApi } from '../../api/avis.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';
import { StarRating } from '../../components/ui/StarRating.jsx';
import { useToast } from '../../hooks/useToast.js';
import { formatDateTimeWithHour, getEventStatus, isEventActive, parseFrDate } from '../../utils/dateFormatter.js';
import { compressImageIfNeeded } from '../../utils/imageCompress.js';
import { eventPath } from '../../utils/eventUrl.js';
import { getEventTypeIcon } from '../../utils/eventType.js';

const MAX_REVIEW_PHOTO_BYTES = 5 * 1024 * 1024;
const DESCRIPTION_PREVIEW_LENGTH = 280;

function toPlainDescription(value) {
	return String(value || '')
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[`*_~#>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

const INLINE_MARKDOWN_PATTERN = /(\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_)/g;

function DescriptionContent({ value }) {
	const occurrences = new Map();
	return String(value || '').split(INLINE_MARKDOWN_PATTERN).map((part) => {
		const occurrence = occurrences.get(part) || 0;
		occurrences.set(part, occurrence + 1);
		const key = `${part}-${occurrence}`;
		if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
		if (part.startsWith('__') && part.endsWith('__')) return <strong key={key}>{part.slice(2, -2)}</strong>;
		if (part.startsWith('~~') && part.endsWith('~~')) return <del key={key}>{part.slice(2, -2)}</del>;
		if (part.startsWith('*') && part.endsWith('*')) return <em key={key}>{part.slice(1, -1)}</em>;
		if (part.startsWith('_') && part.endsWith('_')) return <em key={key}>{part.slice(1, -1)}</em>;
		return part;
	});
}

const transformEventForCard = (evt, backend) => ({
	id: evt.id,
	title: evt.titre,
	description: evt.description,
	image: evt.imagePrincipale ? `${backend}${evt.imagePrincipale}` : '',
	date: evt.dateDepart || evt.dateEvenement || 'Non précisé',
	badge: evt.typeEvenement?.nom || 'EXPEDITION',
	location: evt.lieu || 'Lieu à préciser',
	eventType: evt.typeEvenement?.nom || 'Expédition',
	eventTypeIcon: getEventTypeIcon(evt.typeEvenement),
	slug: evt.publicCode || evt.id,
	href: eventPath(evt)
});

const normalizeEvent = (event, backend) => ({
	title: event.titre,
	description: event.description,
	image: event.imagePrincipale ? `${backend}${event.imagePrincipale}` : '',
	location: event.lieu || 'Non précisé',
	price: event.prix ? `${Number(event.prix).toLocaleString('fr-FR')} Ar` : 'Non précisé',
	duration: event.duration || 'Non précisé',
	difficulty: event.difficulte || event.difficulty || 'Non précisé',
	gallery: (event.photosEvenement || []).map((p) => `${backend}${p.url}`),
	badge: event.typeEvenement?.nom || 'EXPEDITION',
	date: event.dateDepart || event.dateEvenement || 'Non précisé',
	placesReservees: event.placesReservees ?? 0,
	capaciteMax: event.capaciteMax ?? null,
	slug: event.publicCode || event.id,
});

const buildEventFacts = (normalizedEvent) => ([
	{ label: 'Localisation', value: normalizedEvent.location || 'Non précisé', icon: 'location_on' },
	{ label: 'Durée', value: normalizedEvent.duration, icon: 'schedule' },
	{ label: 'Difficulté', value: normalizedEvent.difficulty || 'Non précisé', icon: 'trending_up' },
]).filter((fact) => fact.value && fact.value !== 'Non précisé');

const buildOngoingProgress = (event, isOngoing) => {
	if (!isOngoing) return null;
	const start = parseFrDate(event.dateDepart || event.dateEvenement);
	if (!start) return null;
	const end = parseFrDate(event.dateRetour) || start;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const day = (ms) => Math.round(ms / 86400000);
	const total = day(end - start) + 1;
	const current = Math.min(Math.max(day(today - start) + 1, 1), total);
	return { current, total, percent: Math.round((current / total) * 100) };
};

const shouldShowAvis = (event, isPast) => isPast || (event?.avis || []).length > 0;

const calcPlacesRestantes = (normalizedEvent) => (
	normalizedEvent.capaciteMax === null ? null : Math.max(0, normalizedEvent.capaciteMax - normalizedEvent.placesReservees)
);

const makeInfo = (date, time) => (date ? { date, time } : null);

const getDisplayDescription = (descriptionRaw, descriptionPlain, descriptionExpanded, hasMoreDescription) => (
	descriptionExpanded || !hasMoreDescription ? descriptionRaw : `${descriptionPlain.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
);

function loadEventDetail({ routeKey, routeId, isPublicCode, BACKEND, setEvent, setLoading, setRelatedEvents }) {
	if (!routeKey || (!isPublicCode && routeId === null)) {
		setLoading(false);
		return undefined;
	}

	const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
	const controller = new AbortController();
	let scrollFrame;

	const eventEndpoint = isPublicCode ? `evenements/code/${encodeURIComponent(routeKey)}` : `evenements/${routeId}`;
	fetch(`${API_BASE}/${eventEndpoint}`, { credentials: 'include', signal: controller.signal })
		.then((res) => {
			if (!res.ok) throw new Error('Not found');
			return res.json();
		})
		.then((data) => {
			setEvent(data);
			setLoading(false);

			// Scroll vers la section avis si l'URL pointe dessus (#avis), une fois rendue.
			if (typeof window !== 'undefined' && window.location.hash === '#avis') {
				scrollFrame = requestAnimationFrame(() => document.getElementById('avis')?.scrollIntoView({ behavior: 'smooth' }));
			}

			// Load related events
			fetch(`${API_BASE}/evenements`, { credentials: 'include', signal: controller.signal })
				.then((r) => {
					if (!r.ok) throw new Error('Related events not found');
					return r.json();
				})
				.then((response) => {
					const related = (Array.isArray(response.data) ? response.data : [])
						.filter((e) => e.estPublie && e.id !== data.id && isEventActive(e.dateDepart, e.dateRetour, e.dateEvenement))
						.slice(0, 2)
						.map((evt) => transformEventForCard(evt, BACKEND));
					setRelatedEvents(related);
				})
				.catch((err) => {
					if (err?.name === 'AbortError') return;
					console.error('Error loading related events:', err);
				});
		})
		.catch((err) => {
			if (err.name === 'AbortError') return;
			console.error('Error loading event:', err);
			setLoading(false);
		});

	return () => {
		cancelAnimationFrame(scrollFrame);
		controller.abort();
	};
}

async function submitEventReview({ e, eventId, reviewForm, reviewPhoto, addToast, setReviewLoading, setReviewForm, setReviewPhoto, setReviewSent }) {
	e.preventDefault();
	if (reviewForm.note < 1) {
		addToast('Indiquez une note', 'warning');
		return;
	}
	setReviewLoading(true);
	try {
		const fd = new FormData();
		fd.append('evenementId', String(eventId));
		if (reviewForm.nom.trim()) fd.append('nom', reviewForm.nom.trim());
		fd.append('note', String(reviewForm.note));
		if (reviewForm.commentaire.trim()) fd.append('commentaire', reviewForm.commentaire.trim());
		if (reviewPhoto) {
			const compressedPhoto = await compressImageIfNeeded(reviewPhoto, MAX_REVIEW_PHOTO_BYTES);
			if (compressedPhoto.size > MAX_REVIEW_PHOTO_BYTES) {
				addToast('Photo trop lourde après compression (maximum 5 Mo)', 'warning');
				return;
			}
			fd.append('photo', compressedPhoto);
		}
		const res = await createAvisApi(fd);
		addToast(res.message || 'Merci pour votre avis !', 'success');
		setReviewForm({ nom: '', note: 0, commentaire: '' });
		setReviewPhoto(null);
		setReviewSent(true);
	} catch (err) {
		addToast(err?.message || 'Erreur lors de l\'envoi', 'error');
	} finally {
		setReviewLoading(false);
	}
}

async function submitEventBooking({ e, event, eventId, bookingData, getEventStatus, addToast, setBookingModal, setBookingLoading, setBookingData }) {
	e.preventDefault();
	if (event && getEventStatus(event.dateDepart, event.dateRetour, event.dateEvenement) !== 'upcoming') {
		addToast('Les inscriptions sont closes pour cet événement', 'warning');
		setBookingModal(false);
		return;
	}
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
		if (!res.ok) {
			const errorData = await res.json();
			addToast(errorData.message || 'Erreur lors de la réservation', 'error');
			return;
		}
		const data = await res.json();
		addToast(data.message || 'Réservation confirmée !', 'success');
		setBookingModal(false);
		setBookingData({ nom: '', contact: '', nombrePlaces: 1 });
	} catch (err) {
		addToast((err instanceof Error ? err.message : 'Erreur inconnue'), 'error');
	} finally {
		setBookingLoading(false);
	}
}

function EventBookingModal({ open, onClose, bookingLoading, placesRestantes, bookingData, setBookingData, onSubmit }) {
	if (!open) return null;
	return (
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
			<div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
				<h3 class="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Participer</h3>
				<form onSubmit={onSubmit} class="space-y-4">
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
						<p class={`text-xs mb-2 ${placesRestantes === 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
							{placesRestantes === null ? 'Places disponibles : illimitées' : placesRestantes === 0 ? 'Événement complet' : `${placesRestantes} place(s) restante(s)`}
						</p>
						<input
							id="nombrePlaces"
							type="number"
							min="1"
							max={placesRestantes ?? 10}
							value={bookingData.nombrePlaces}
							onInput={(e) => setBookingData({ ...bookingData, nombrePlaces: parseInt(e.currentTarget.value, 10) || 1 })}
							class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
							required
						/>
					</div>
					<div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
						<button
							type="button"
							onClick={onClose}
							class="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all"
							disabled={bookingLoading}
						>
							Annuler
						</button>
						<button
							type="submit"
							class="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
							disabled={bookingLoading || placesRestantes === 0}
						>
							{bookingLoading ? 'En cours...' : placesRestantes === 0 ? 'Complet' : 'Confirmer'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export function EventDetail({ params }) {
	const BACKEND = import.meta.env.VITE_BACKEND_URL || '';
	const routeKey = params.code || params.id;
	const parsedRouteId = Number.parseInt(params.id, 10);
	// null plutôt que NaN : NaN !== NaN ferait relancer l'effet à chaque rendu.
	const routeId = Number.isNaN(parsedRouteId) ? null : parsedRouteId;
	const isPublicCode = Boolean(params.code);

	const [event, setEvent] = useState(null);
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);
	const [loading, setLoading] = useState(true);
	const [preview, setPreview] = useState(null);
	const previewIndex = useRef(0);
	const [bookingModal, setBookingModal] = useState(false);
	const [bookingData, setBookingData] = useState({ nom: '', contact: '', nombrePlaces: 1 });
	const [bookingLoading, setBookingLoading] = useState(false);
	const [relatedEvents, setRelatedEvents] = useState([]);
	const { toasts, addToast, removeToast } = useToast();

	const [reviewForm, setReviewForm] = useState({ nom: '', note: 0, commentaire: '' });
	const [reviewPhoto, setReviewPhoto] = useState(/** @type {File|null} */(null));
	const [reviewLoading, setReviewLoading] = useState(false);
	const [reviewSent, setReviewSent] = useState(false);
	const [reviewPreview, setReviewPreview] = useState(null);
	const eventId = event?.id ?? routeId;

	const handleReviewSubmit = (e) => submitEventReview({
		e,
		eventId,
		reviewForm,
		reviewPhoto,
		addToast,
		setReviewLoading,
		setReviewForm,
		setReviewPhoto,
		setReviewSent,
	});


	const handleBooking = (e) => submitEventBooking({
		e,
		event,
		eventId,
		bookingData,
		getEventStatus,
		addToast,
		setBookingModal,
		setBookingLoading,
		setBookingData,
	});


	useEffect(() => loadEventDetail({ routeKey, routeId, isPublicCode, BACKEND, setEvent, setLoading, setRelatedEvents }), [routeKey, routeId, isPublicCode, BACKEND, setEvent, setLoading, setRelatedEvents]);

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
					<p class="mt-2 text-xs text-secondary">(Référence : {routeKey})</p>
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

	const normalizedEvent = normalizeEvent(event, BACKEND);
	const eventType = event.typeEvenement || { nom: 'Événement', icone: 'explore', libelleRythme: 'Rythme de l’événement' };
	const eventTypeIcon = getEventTypeIcon(eventType);
	const eventRhythm = `Rythme de ${(eventType.nom || 'l’événement').toLocaleLowerCase('fr-FR')}`;
	const descriptionRaw = normalizedEvent.description || '';
	const descriptionPlain = toPlainDescription(descriptionRaw);
	const hasMoreDescription = descriptionPlain.length > DESCRIPTION_PREVIEW_LENGTH;
	const collapsedDescription = `${descriptionPlain.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`;
	const descriptionContent = getDisplayDescription(descriptionRaw, descriptionPlain, descriptionExpanded, hasMoreDescription);

	const status = getEventStatus(event.dateDepart, event.dateRetour, event.dateEvenement);
	const isPast = status === 'past';
	const isOngoing = status === 'ongoing';
	const placesRestantes = calcPlacesRestantes(normalizedEvent);
	const isFull = placesRestantes === 0;
	const showAvis = shouldShowAvis(event, isPast);
	const previewAvis = (event.avis || []).slice(0, 3);
	const gallery = buildPreviewGallery(normalizedEvent.image, normalizedEvent.gallery || []);
	const facts = buildEventFacts(normalizedEvent);

	const departInfo = makeInfo(event.dateDepart, event.heureDepart);
	const retourInfo = makeInfo(event.dateRetour, event.heureRetour);

	const ongoingProgress = buildOngoingProgress(event, isOngoing);

	return (
		<>
			<main class="flex-grow pb-28 lg:pb-section-gap">
				<section class="relative overflow-hidden bg-on-secondary-fixed">
					<div class="absolute inset-0">
						<BlurBackgroundImage src={normalizedEvent.image} class="absolute inset-0" />
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
										<OngoingBadge isOngoing={isOngoing} />
									</div>
								</Reveal>
								<Reveal animation="arc" delay={60} duration={840}>
									<h1 class="mt-6 font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 font-black uppercase tracking-tighter leading-[1.02] text-on-primary">
										{normalizedEvent.title}
									</h1>
								</Reveal>
								<Reveal animation="fadeUp" delay={120} duration={760}>
								<EventDescription hasMoreDescription={descriptionPlain.length > DESCRIPTION_PREVIEW_LENGTH} descriptionExpanded={descriptionExpanded} setDescriptionExpanded={setDescriptionExpanded}>
									<DescriptionContent value={descriptionContent} />
								</EventDescription>
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
											<p class="mt-3 font-h1 text-4xl md:text-5xl font-black text-on-primary drop-shadow-lg">{normalizedEvent.price}</p>
											<p class="mt-2 text-sm text-on-primary/60">par personne</p>
										</div>
										<div class="rounded-2xl bg-primary px-5 py-4 text-white shadow-xl shadow-primary/30 flex items-center justify-center h-fit">
											<span class="material-symbols-outlined text-4xl">card_giftcard</span>
										</div>
									</div>

									<div class="mt-5 space-y-3">
										{facts.map((fact) => (
							<div key={fact.label} class="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
												<span class="material-symbols-outlined text-[20px] text-primary flex-shrink-0 mt-0.5">{fact.icon}</span>
												<div class="min-w-0">
													<p class="font-label-caps text-label-caps text-on-primary/60">{fact.label}</p>
													<p class="mt-1 font-body-md text-body-md font-semibold text-on-primary leading-snug break-words">{fact.value}</p>
												</div>
											</div>
										))}
									</div>

									<div class="hidden lg:block">
									<DesktopParticipationAction isPast={isPast} isOngoing={isOngoing} isFull={placesRestantes === 0} onParticipate={() => setBookingModal(true)} />
									</div>
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
										<h2 class="font-h2 text-h2 font-black uppercase tracking-tight text-on-background">
											Aperçu de l'expérience
										</h2>
									</div>
									<div class="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
										<span class="material-symbols-outlined text-3xl">map</span>
									</div>
								</div>
								<div class="mt-6 space-y-3">
									{facts.map((fact) => (
						<div key={fact.label} class="flex items-start gap-3 rounded-2xl border border-outline-variant/60 bg-white/40 p-4">
											<span class="material-symbols-outlined text-[22px] text-primary flex-shrink-0 mt-0.5">{fact.icon}</span>
											<div class="min-w-0">
												<p class="font-label-caps text-label-caps text-secondary">{fact.label}</p>
												<p class="mt-1 font-body-md text-body-md font-semibold text-on-background leading-snug break-words">{fact.value}</p>
											</div>
										</div>
									))}
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
																onClick={() => { previewIndex.current = idx; setPreview({ url: img(src), title: `${normalizedEvent.title} photo ${idx + 1}` }); }}
												class="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant/70 bg-surface-container shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/10 cursor-pointer"
											>
												<BlurImg
													src={img(src)}
													alt={`${normalizedEvent.title} preview ${idx + 1}`}
													class="h-full w-full object-cover group-hover:scale-105"
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
								<TravelDetails eventRhythm={eventRhythm} eventTypeIcon={eventTypeIcon} ongoingProgress={ongoingProgress} departInfo={departInfo} retourInfo={retourInfo} />
								</aside>
							</Reveal>
						</div>
				</section>

				{/* ── Avis / Témoignages (événements passés) ── */}
				<EventReviews showAvis={shouldShowAvis(event, isPast)} event={event} isPast={isPast} previewAvis={previewAvis} BACKEND={BACKEND} reviewForm={reviewForm} setReviewForm={setReviewForm} reviewPhoto={reviewPhoto} setReviewPhoto={setReviewPhoto} reviewLoading={reviewLoading} reviewSent={reviewSent} setReviewPreview={setReviewPreview} handleReviewSubmit={handleReviewSubmit} />

				<section id="related" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mt-20">
					<Reveal animation="fadeUp" duration={760}>
						<div class="flex items-end justify-between gap-4 mb-8">
							<div>
								<h2 class="font-h2 text-h2 font-black uppercase tracking-tight text-on-background">Expéditions connexes</h2>
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
							<TourCard {...related} href={related.href || eventPath(related)} />
							</Reveal>
						))}
					</div>
				</section>
			</main>

			<div class="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant/40 bg-background/95 backdrop-blur-md px-margin-mobile py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
				<div class="flex items-center justify-between gap-3">
					<div class="min-w-0">
						<p class="font-label-caps text-label-caps text-secondary">À partir de</p>
						<p class="font-h3 text-lg font-black text-on-background leading-tight truncate">{normalizedEvent.price}</p>
					</div>
					<MobileParticipationAction isPast={isPast} isOngoing={isOngoing} isFull={placesRestantes === 0} onParticipate={() => setBookingModal(true)} />
				</div>
			</div>

			<Footer />
			<ImagePreview
				image={preview}
				onClose={() => setPreview(null)}
				onNext={() => {
					const nextIdx = (previewIndex.current + 1) % gallery.length;
					previewIndex.current = nextIdx;
					setPreview({ url: img(gallery[nextIdx]), title: `${normalizedEvent.title} photo ${nextIdx + 1}` });
				}}
				onPrev={() => {
					const prevIdx = (previewIndex.current - 1 + gallery.length) % gallery.length;
					previewIndex.current = prevIdx;
					setPreview({ url: img(gallery[prevIdx]), title: `${normalizedEvent.title} photo ${prevIdx + 1}` });
				}}
				hasNext={gallery.length > 1}
				 hasPrev={gallery.length > 1}
			/>
			<ImagePreview image={reviewPreview} onClose={() => setReviewPreview(null)} />

			<EventBookingModal open={bookingModal} onClose={() => setBookingModal(false)} bookingLoading={bookingLoading} placesRestantes={placesRestantes} bookingData={bookingData} setBookingData={setBookingData} onSubmit={handleBooking} />

			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</>
	);
}


