import { useState, useEffect, useRef } from 'preact/hooks';
import { Footer } from '../../components/Footer.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
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

export function EventDetail({ params }) {
	const BACKEND = import.meta.env.VITE_BACKEND_URL || '';
	const routeKey = params.code || params.id;
	const routeId = Number.parseInt(params.id, 10);
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
	const eventId = event?.id ?? (Number.isNaN(routeId) ? null : routeId);

	const handleReviewSubmit = async (e) => {
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
	};

	const handleBooking = async (e) => {
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
	};

	useEffect(() => {
		if (!routeKey || (!isPublicCode && Number.isNaN(routeId))) {
			setLoading(false);
			return;
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
	}, [routeKey, routeId, isPublicCode, BACKEND]);

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

	const normalizedEvent = {
		title: event.titre,
		description: event.description,
		image: event.imagePrincipale ? `${BACKEND}${event.imagePrincipale}` : '',
		location: event.lieu || 'Non précisé',
		price: event.prix ? `${Number(event.prix).toLocaleString('fr-FR')} Ar` : 'Non précisé',
		duration: event.duration || 'Non précisé',
		difficulty: event.difficulte || event.difficulty || 'Non précisé',
		gallery: (event.photosEvenement || []).map(p => `${BACKEND}${p.url}`),
		badge: event.typeEvenement?.nom || 'EXPEDITION',
		date: event.dateDepart || event.dateEvenement || 'Non précisé',
		placesReservees: event.placesReservees ?? 0,
		capaciteMax: event.capaciteMax ?? null,
		slug: event.publicCode || event.id,
	};
	const eventType = event.typeEvenement || { nom: 'Événement', icone: 'explore', libelleRythme: 'Rythme de l’événement' };
	const eventTypeIcon = getEventTypeIcon(eventType);
	const eventRhythm = `Rythme de ${(eventType.nom || 'l’événement').toLocaleLowerCase('fr-FR')}`;
	const descriptionRaw = normalizedEvent.description || '';
	const descriptionPlain = toPlainDescription(descriptionRaw);
	const hasMoreDescription = descriptionPlain.length > DESCRIPTION_PREVIEW_LENGTH;
	const collapsedDescription = `${descriptionPlain.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`;
	const descriptionContent = descriptionExpanded || !hasMoreDescription ? descriptionRaw : collapsedDescription;

	const status = getEventStatus(event.dateDepart, event.dateRetour, event.dateEvenement);
	const isPast = status === 'past';
	const isOngoing = status === 'ongoing';
	const placesRestantes = normalizedEvent.capaciteMax === null ? null : Math.max(0, normalizedEvent.capaciteMax - normalizedEvent.placesReservees);
	const isFull = placesRestantes === 0;
	const showAvis = isPast || (event.avis || []).length > 0;
	const previewAvis = (event.avis || []).slice(0, 3);
	const gallery = buildPreviewGallery(normalizedEvent.image, normalizedEvent.gallery || []);
	const facts = [
		{ label: 'Localisation', value: normalizedEvent.location || 'Non précisé', icon: 'location_on' },
		{ label: 'Durée', value: normalizedEvent.duration, icon: 'schedule' },
		{ label: 'Difficulté', value: normalizedEvent.difficulty || 'Non précisé', icon: 'trending_up' },
	].filter((f) => f.value && f.value !== 'Non précisé');

	const departInfo = event.dateDepart ? {
		date: event.dateDepart,
		time: event.heureDepart
	} : null;
	const retourInfo = event.dateRetour ? {
		date: event.dateRetour,
		time: event.heureRetour
	} : null;

	const ongoingProgress = (() => {
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
	})();

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
										{isOngoing && (
											<span class="inline-flex items-center gap-2 rounded-full bg-green-500/90 px-4 py-2 font-label-caps text-label-caps text-white shadow-lg shadow-green-500/30">
												<span class="relative flex h-2 w-2">
													<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
													<span class="relative inline-flex h-2 w-2 rounded-full bg-white" />
												</span>
												EN COURS
											</span>
										)}
									</div>
								</Reveal>
								<Reveal animation="arc" delay={60} duration={840}>
									<h1 class="mt-6 font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 font-black uppercase tracking-tighter leading-[1.02] text-on-primary">
										{normalizedEvent.title}
									</h1>
								</Reveal>
								<Reveal animation="fadeUp" delay={120} duration={760}>
								{hasMoreDescription ? (
									<button
										type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							setDescriptionExpanded((expanded) => !expanded);
						}}
										aria-expanded={descriptionExpanded}
										aria-label={descriptionExpanded ? 'Réduire la description' : 'Afficher la description complète'}
										class="mt-6 block max-w-2xl text-left font-body-lg text-body-lg leading-relaxed text-on-primary/80 transition-colors hover:text-on-primary cursor-pointer"
									>
										<span class="whitespace-pre-line"><DescriptionContent value={descriptionContent} /></span>
										<span class="mt-3 block font-button text-[10px] font-black uppercase tracking-widest text-primary-container">
											{descriptionExpanded ? 'Voir moins' : 'Voir plus'}
										</span>
									</button>
								) : (
									<p class="mt-6 max-w-2xl whitespace-pre-line font-body-lg text-body-lg leading-relaxed text-on-primary/80"><DescriptionContent value={descriptionContent} /></p>
								)}
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
									{isPast ? (
										<a
											href="#avis"
											class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:bg-white/10 cursor-pointer"
										>
											EXPÉDITION TERMINÉE, LAISSER UN AVIS
											<span class="material-symbols-outlined text-[18px]">rate_review</span>
										</a>
									) : isOngoing ? (
										<div class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/15 px-6 py-4 font-button text-button text-on-primary">
											EN COURS, INSCRIPTIONS CLOSES
											<span class="material-symbols-outlined text-[18px]">lock</span>
										</div>
									) : isFull ? (
										<div class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/15 px-6 py-4 font-button text-button text-on-primary">
											PLACES COMPLÈTES
											<span class="material-symbols-outlined text-[18px]">block</span>
										</div>
									) : (
										<button
											type="button"
											onClick={() => setBookingModal(true)}
											class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
										>
											PARTICIPER
											<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
										</button>
									)}
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
								<div class="rounded-[1.75rem] border border-outline-variant/70 bg-on-secondary-fixed p-6 text-on-primary shadow-md shadow-black/10">
								<p class="font-label-caps text-label-caps text-on-primary/60">{eventRhythm}</p>
								<h2 class="mt-3 flex items-center gap-3 font-h2 text-h2 font-black uppercase tracking-tight">
									<span class="material-symbols-outlined text-primary text-3xl" aria-hidden="true">{eventTypeIcon}</span>
									Départ &amp; retour
								</h2>
										{ongoingProgress && (
											<div class="mt-5 rounded-2xl border border-green-400/30 bg-green-500/10 p-4">
												<div class="flex items-center justify-between">
													<span class="inline-flex items-center gap-2 font-label-caps text-label-caps text-green-300">
														<span class="relative flex h-2 w-2">
															<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
															<span class="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
														</span>
														En cours
													</span>
													<span class="font-body-md text-body-md font-semibold text-on-primary">Jour {ongoingProgress.current} / {ongoingProgress.total}</span>
												</div>
												<div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
													<div class="h-full rounded-full bg-green-400 transition-all duration-500" style={`width:${ongoingProgress.percent}%`} />
												</div>
											</div>
										)}
										{(departInfo || retourInfo) && (
											<div class="mt-6 space-y-3">
												{departInfo && (
													<div class="flex items-start gap-3">
															<span class="material-symbols-outlined text-xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">{eventTypeIcon}</span>
														<div>
															<p class="font-label-caps text-label-caps text-on-primary/60 text-xs">Départ</p>
															<p class="mt-1 font-body-md text-body-md font-semibold text-on-primary">{formatDateTimeWithHour(departInfo.date, departInfo.time)}</p>
														</div>
													</div>
												)}
												{retourInfo && (
													<div class="flex items-start gap-3">
															<span class="material-symbols-outlined text-xl text-primary flex-shrink-0 mt-0.5" aria-hidden="true">{eventTypeIcon}</span>
														<div>
															<p class="font-label-caps text-label-caps text-on-primary/60 text-xs">Retour</p>
															<p class="mt-1 font-body-md text-body-md font-semibold text-on-primary">{formatDateTimeWithHour(retourInfo.date, retourInfo.time)}</p>
														</div>
													</div>
												)}
											</div>
										)}
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
										{isPast ? (
											<a
												href="#avis"
												class="inline-flex items-center justify-center gap-2 rounded-2xl border border-outline-variant px-5 py-4 font-button text-button text-primary transition-all duration-300 hover:bg-primary/10 cursor-pointer"
											>
												LAISSER UN AVIS
												<span class="material-symbols-outlined text-[18px]">rate_review</span>
											</a>
										) : isOngoing ? (
											<div class="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/10 px-5 py-4 font-button text-button text-secondary">
											EN COURS, INSCRIPTIONS CLOSES
											<span class="material-symbols-outlined text-[18px]">lock</span>
										</div>
										) : isFull ? (
											<div class="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-4 font-button text-button text-secondary">
												PLACES COMPLÈTES
												<span class="material-symbols-outlined text-[18px]">block</span>
											</div>
										) : (
											<button
												type="button"
												onClick={() => setBookingModal(true)}
												class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
											>
												PARTICIPER
												<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
											</button>
										)}
									</div>
								</div>
							</aside>
						</Reveal>
					</div>
				</section>

				{/* ── Avis / Témoignages (événements passés) ── */}
				{showAvis && (
				<section id="avis" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mt-20">
					<Reveal animation="fadeUp" duration={760}>
						<div class="flex items-end justify-between gap-4 mb-8">
							<div>
								<p class="font-label-caps text-label-caps text-secondary">Retours terrain</p>
								<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight text-on-background">Avis des participants</h2>
							</div>
							{event.nombreAvis > 0 && (
								<div class="flex flex-col items-end gap-1">
									<div class="flex items-center gap-2">
										<span class="font-h2 text-3xl font-black text-on-background">{event.noteMoyenne}</span>
										<StarRating value={event.noteMoyenne} size="text-[22px]" />
									</div>
									<span class="font-mono text-[10px] text-secondary tracking-widest uppercase">{event.nombreAvis} avis</span>
								</div>
							)}
							{event.nombreAvis > 3 && (
								<a
									href={`${eventPath(event)}/avis`}
									aria-label={`Voir les ${event.nombreAvis} avis de ${event.titre}`}
									class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-4 py-2 font-button text-[10px] font-black uppercase tracking-widest text-primary transition-colors hover:border-primary hover:bg-primary/5"
								>
									Voir plus
									<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
								</a>
							)}
						</div>
					</Reveal>

					<div class={`grid gap-8 ${isPast ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''}`}>
						{/* Liste des avis */}
						<div class="space-y-4">
							{(event.avis || []).length === 0 && (
								<div class="rounded-2xl border border-outline-variant/60 bg-surface-container/40 p-8 text-center">
									<span class="material-symbols-outlined text-3xl text-secondary/40">reviews</span>
									<p class="mt-2 font-body-md text-secondary">Aucun avis pour le moment. Soyez le premier !</p>
								</div>
							)}
								{previewAvis.map((a) => (
								<article key={a.id} class="rounded-2xl border border-outline-variant/60 bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-sm p-5 shadow-sm">
									<div class="flex items-start justify-between gap-4">
										<div class="flex items-center gap-3">
											<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-black uppercase">
												{a.nom.charAt(0)}
											</div>
											<div>
												<p class="font-body-md font-bold text-on-background leading-tight">{a.nom}</p>
												<StarRating value={a.note} size="text-[15px]" />
											</div>
										</div>
										<span class="font-mono text-[10px] text-secondary/70">{a.dateCreation}</span>
									</div>
									{a.commentaire && <p class="mt-3 font-body-md text-secondary leading-relaxed">{a.commentaire}</p>}
					{a.photoUrl && (
						<button
							type="button"
							onClick={() => setReviewPreview({ url: a.photoUrl, title: `Photo de ${a.nom}` })}
							aria-label={`Agrandir la photo de ${a.nom}`}
							class="group relative mt-3 block w-full overflow-hidden rounded-xl cursor-zoom-in"
						>
							<BlurImg src={`${BACKEND}${a.photoUrl}`} alt={`Photo de ${a.nom}`} class="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" referrerPolicy="no-referrer" />
							<span class="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
								<span class="material-symbols-outlined text-3xl drop-shadow">zoom_in</span>
							</span>
						</button>
					)}
								</article>
							))}
						</div>

						{/* Formulaire — uniquement sur expédition passée */}
						{isPast && (
						<aside class="lg:sticky lg:top-24 h-fit">
							<div class="rounded-[1.5rem] border border-outline-variant/60 bg-on-secondary-fixed p-6 text-on-primary shadow-md">
								<h3 class="font-h3 text-h3 font-black uppercase tracking-tight">Laisser un avis</h3>
								<p class="mt-2 font-body-md text-on-primary/60">Partagez votre expérience. Publié après modération.</p>
								{reviewSent ? (
									<div class="mt-6 rounded-2xl bg-primary/10 border border-primary/30 p-5 text-center">
										<span class="material-symbols-outlined text-3xl text-primary">check_circle</span>
										<p class="mt-2 font-body-md text-on-primary/80">Merci ! Votre avis sera publié après validation.</p>
									</div>
								) : (
									<form onSubmit={handleReviewSubmit} class="mt-5 space-y-4">
										<div>
											<label class="font-label-caps text-label-caps text-on-primary/60 block mb-2">Votre note</label>
											<StarRating value={reviewForm.note} onChange={(n) => setReviewForm({ ...reviewForm, note: n })} size="text-[28px]" />
										</div>
										<div>
			<label class="font-label-caps text-label-caps text-on-primary/60 block mb-2" for="rev-nom">Nom (optionnel)</label>
			<input id="rev-nom" type="text" value={reviewForm.nom} onInput={(e) => setReviewForm({ ...reviewForm, nom: e.currentTarget.value })}
				class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-on-primary placeholder-on-primary/30 outline-none focus:border-primary" placeholder="Votre nom (sinon Anonyme)" />
										</div>
										<div>
											<label class="font-label-caps text-label-caps text-on-primary/60 block mb-2" for="rev-com">Commentaire</label>
											<textarea id="rev-com" rows={4} value={reviewForm.commentaire} onInput={(e) => setReviewForm({ ...reviewForm, commentaire: e.currentTarget.value })}
												class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-on-primary placeholder-on-primary/30 outline-none focus:border-primary resize-none" placeholder="Votre expérience sur le terrain..." />
										</div>
										<div>
											<label class="font-label-caps text-label-caps text-on-primary/60 block mb-2" for="rev-photo">Photo (optionnel)</label>
											<input id="rev-photo" type="file" accept=".jpg,.jpeg,.png,.webp,image/*" onChange={(e) => setReviewPhoto(e.currentTarget.files?.[0] || null)}
												class="w-full text-sm text-on-primary/60 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white" />
										</div>
										<button type="submit" disabled={reviewLoading}
											class="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer">
											{reviewLoading ? 'Envoi...' : 'Publier mon avis'}
											<span class="material-symbols-outlined text-[18px]">send</span>
										</button>
									</form>
								)}
							</div>
						</aside>
						)}
					</div>
				</section>
				)}

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
					{isPast ? (
						<a href="#avis" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-outline-variant px-5 py-3.5 font-button text-button text-primary transition-colors duration-200 hover:bg-primary/10 cursor-pointer">
							LAISSER UN AVIS
							<span class="material-symbols-outlined text-[18px]">rate_review</span>
						</a>
					) : isOngoing ? (
						<div class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/10 px-5 py-3.5 font-button text-button text-secondary">
							INSCRIPTIONS CLOSES
							<span class="material-symbols-outlined text-[18px]">lock</span>
						</div>
					) : isFull ? (
						<div class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/15 px-6 py-4 font-button text-button text-on-primary">
											PLACES COMPLÈTES
							<span class="material-symbols-outlined text-[18px]">block</span>
						</div>
					) : (
						<button type="button" onClick={() => setBookingModal(true)} class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer">
							PARTICIPER
							<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
						</button>
					)}
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
									onClick={() => setBookingModal(false)}
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
			)}

			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</>
	);
}


