export function OngoingBadge({ isOngoing }) {
	if (!isOngoing) return null;
	return (
		<span class="inline-flex items-center gap-2 rounded-full bg-green-500/90 px-4 py-2 font-label-caps text-label-caps text-white shadow-lg shadow-green-500/30">
			<span class="relative flex h-2 w-2">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
				<span class="relative inline-flex h-2 w-2 rounded-full bg-white" />
			</span>
			EN COURS
		</span>
	);
}

export function EventDescription({ hasMoreDescription, descriptionExpanded, setDescriptionExpanded, children }) {
	if (hasMoreDescription) {
		return (
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
				<span class="whitespace-pre-line">{children}</span>
				<span class="mt-3 block font-button text-[10px] font-black uppercase tracking-widest text-primary-container">
					{descriptionExpanded ? 'Voir moins' : 'Voir plus'}
				</span>
			</button>
		);
	}
	return (
		<p class="mt-6 max-w-2xl whitespace-pre-line font-body-lg text-body-lg leading-relaxed text-on-primary/80">{children}</p>
	);
}


export function DesktopParticipationAction({ isPast, isOngoing, isFull, onParticipate }) {
	if (isPast) return <a href="#avis" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:bg-white/10 cursor-pointer">EXPÉDITION TERMINÉE, LAISSER UN AVIS <span class="material-symbols-outlined text-[18px]">rate_review</span></a>;
	if (isOngoing) return <div class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/15 px-6 py-4 font-button text-button text-on-primary">EN COURS, INSCRIPTIONS CLOSES <span class="material-symbols-outlined text-[18px]">lock</span></div>;
	if (isFull) return <div class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/15 px-6 py-4 font-button text-button text-on-primary">PLACES COMPLÈTES <span class="material-symbols-outlined text-[18px]">block</span></div>;
	return <button type="button" onClick={onParticipate} class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer">PARTICIPER <span class="material-symbols-outlined text-[18px]">arrow_forward</span></button>;
}

export function SidebarParticipationAction({ isPast, isOngoing, isFull, onParticipate }) {
	if (isPast) return <a href="#avis" class="inline-flex items-center justify-center gap-2 rounded-2xl border border-outline-variant px-5 py-4 font-button text-button text-primary transition-all duration-300 hover:bg-primary/10 cursor-pointer">LAISSER UN AVIS <span class="material-symbols-outlined text-[18px]">rate_review</span></a>;
	if (isOngoing) return <div class="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/10 px-5 py-4 font-button text-button text-secondary">EN COURS, INSCRIPTIONS CLOSES <span class="material-symbols-outlined text-[18px]">lock</span></div>;
	if (isFull) return <div class="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-5 py-4 font-button text-button text-secondary">PLACES COMPLÈTES <span class="material-symbols-outlined text-[18px]">block</span></div>;
	return <button type="button" onClick={onParticipate} class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-button text-button text-on-primary transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer">PARTICIPER <span class="material-symbols-outlined text-[18px]">arrow_forward</span></button>;
}

export function MobileParticipationAction({ isPast, isOngoing, isFull, onParticipate }) {
	if (isPast) return <a href="#avis" class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-outline-variant px-5 py-3.5 font-button text-button text-primary transition-colors duration-200 hover:bg-primary/10 cursor-pointer">LAISSER UN AVIS <span class="material-symbols-outlined text-[18px]">rate_review</span></a>;
	if (isOngoing) return <div class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-green-400/40 bg-green-500/10 px-5 py-3.5 font-button text-button text-secondary">INSCRIPTIONS CLOSES <span class="material-symbols-outlined text-[18px]">lock</span></div>;
	if (isFull) return <div class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/40 bg-red-500/15 px-6 py-4 font-button text-button text-on-primary">PLACES COMPLÈTES <span class="material-symbols-outlined text-[18px]">block</span></div>;
	return <button type="button" onClick={onParticipate} class="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-button text-button text-on-primary transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer">PARTICIPER <span class="material-symbols-outlined text-[18px]">arrow_forward</span></button>;
}

import { formatDateTimeWithHour } from '../../utils/dateFormatter.js';

export function TravelDetails({ eventRhythm, eventTypeIcon, ongoingProgress, departInfo, retourInfo }) {
	return (
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
	);
}
