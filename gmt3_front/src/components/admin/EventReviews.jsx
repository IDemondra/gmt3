import { Reveal } from '../ui/Reveal.jsx';
import { BlurImg } from '../ui/BlurImg.jsx';
import { StarRating } from '../ui/StarRating.jsx';
import { eventPath } from '../../utils/eventUrl.js';

export function EventReviews({
	showAvis,
	event,
	isPast,
	previewAvis,
	BACKEND,
	reviewForm,
	setReviewForm,
	reviewPhoto,
	setReviewPhoto,
	reviewLoading,
	reviewSent,
	setReviewPreview,
	handleReviewSubmit,
}) {
	if (!showAvis) return null;

	return (
		<section id="avis" class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mt-20">
			<Reveal animation="fadeUp" duration={760}>
				<div class="flex items-end justify-between gap-4 mb-8">
					<div>
						<p class="font-label-caps text-label-caps text-secondary">Retours terrain</p>
						<h2 class="mt-3 font-h2 text-h2 font-black uppercase tracking-tight text-on-background">Avis des participants</h2>
					</div>
					<ReviewsRating event={event} />
					<SeeMoreReviewsLink event={event} />
				</div>
			</Reveal>

			<div class={`grid gap-8 ${isPast ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''}`}>
				<div class="space-y-4">
					<EmptyReviewsNotice visible={(event.avis || []).length === 0} />
					<ReviewsList event={event} previewAvis={previewAvis} BACKEND={BACKEND} setReviewPreview={setReviewPreview} />
				</div>

				{isPast && (
					<ReviewForm
						reviewForm={reviewForm}
						setReviewForm={setReviewForm}
						reviewPhoto={reviewPhoto}
						setReviewPhoto={setReviewPhoto}
						reviewLoading={reviewLoading}
						reviewSent={reviewSent}
						handleReviewSubmit={handleReviewSubmit}
					/>
				)}
			</div>
		</section>
	);
}

function ReviewsRating({ event }) {
	if (!(event.nombreAvis > 0)) return null;
	return (
		<div class="flex flex-col items-end gap-1">
			<div class="flex items-center gap-2">
				<span class="font-h2 text-3xl font-black text-on-background">{event.noteMoyenne}</span>
				<StarRating value={event.noteMoyenne} size="text-[22px]" />
			</div>
			<span class="font-mono text-[10px] text-secondary tracking-widest uppercase">{event.nombreAvis} avis</span>
		</div>
	);
}

function SeeMoreReviewsLink({ event }) {
	if (!(event.nombreAvis > 3)) return null;
	return (
		<a
			href={`${eventPath(event)}/avis`}
			aria-label={`Voir les ${event.nombreAvis} avis de ${event.titre}`}
			class="inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-4 py-2 font-button text-[10px] font-black uppercase tracking-widest text-primary transition-colors hover:border-primary hover:bg-primary/5"
		>
			Voir plus
			<span class="material-symbols-outlined text-[16px]">arrow_forward</span>
		</a>
	);
}

function EmptyReviewsNotice({ visible }) {
	if (!visible) return null;
	return (
		<div class="rounded-2xl border border-outline-variant/60 bg-surface-container/40 p-8 text-center">
			<span class="material-symbols-outlined text-3xl text-secondary/40">reviews</span>
			<p class="mt-2 font-body-md text-secondary">Aucun avis pour le moment. Soyez le premier !</p>
		</div>
	);
}

function ReviewsList({ event, previewAvis, BACKEND, setReviewPreview }) {
	return (
		<>
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
		</>
	);
}

function ReviewForm({ reviewForm, setReviewForm, reviewPhoto, setReviewPhoto, reviewLoading, reviewSent, handleReviewSubmit }) {
	return (
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
							<input id="rev-nom" type="text" value={reviewForm.nom} onInput={(e) => setReviewForm({ ...reviewForm, nom: e.currentTarget.value })} class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-on-primary placeholder-on-primary/30 outline-none focus:border-primary" placeholder="Votre nom (sinon Anonyme)" />
						</div>
						<div>
							<label class="font-label-caps text-label-caps text-on-primary/60 block mb-2" for="rev-com">Commentaire</label>
							<textarea id="rev-com" rows={4} value={reviewForm.commentaire} onInput={(e) => setReviewForm({ ...reviewForm, commentaire: e.currentTarget.value })} class="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/15 text-on-primary placeholder-on-primary/30 outline-none focus:border-primary resize-none" placeholder="Votre expérience sur le terrain..." />
						</div>
						<div>
							<label class="font-label-caps text-label-caps text-on-primary/60 block mb-2" for="rev-photo">Photo (optionnel)</label>
							<input id="rev-photo" type="file" accept=".jpg,.jpeg,.png,.webp,image/*" onChange={(e) => setReviewPhoto(e.currentTarget.files?.[0] || null)} class="w-full text-sm text-on-primary/60 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white" />
						</div>
						<button type="submit" disabled={reviewLoading} class="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer">
							{reviewLoading ? 'Envoi...' : 'Publier mon avis'}
							<span class="material-symbols-outlined text-[18px]">send</span>
						</button>
					</form>
				)}
			</div>
		</aside>
	);
}
