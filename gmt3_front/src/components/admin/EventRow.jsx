// @ts-ignore
import { formatIsoDateFr } from '../../utils/dateFormatter.js';
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const resolveUrl = (url) => {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('/google-img/') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
};

export function EventRow({ event, index, onDelete, onEdit, onImageClick, onViewDetails }) {
	const isEven = index % 2 === 0;

	const hasImage = event.imagePrincipale && typeof event.imagePrincipale === 'string' && event.imagePrincipale.length > 0;

	return (
		<tr class={`border-b border-outline-variant/30 transition-colors duration-150 ${
			isEven ? 'bg-transparent' : 'bg-surface-container/40'
		} hover:bg-primary/5`}>
			<td class="px-6 py-4">
				<span class="font-mono text-xs text-secondary bg-surface-container px-2.5 py-1 rounded-lg font-semibold">
					{event.id}
				</span>
			</td>
			<td class="px-6 py-4">
				<div class="flex items-center gap-3">
					{hasImage ? (
						<button
							type="button"
							onClick={() => onImageClick?.(resolveUrl(event.imagePrincipale))}
							class="h-9 w-9 rounded-lg overflow-hidden shrink-0 border border-outline-variant/20 hover:ring-2 hover:ring-primary-container/40 transition-all cursor-pointer"
							title="Voir l'image"
						>
							<img
								src={resolveUrl(event.imagePrincipale)}
								alt=""
								class="w-full h-full object-cover"
								referrerPolicy="no-referrer"
								loading="lazy"
							/>
						</button>
					) : (
						<div class="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
							<span class="material-symbols-outlined text-primary-container text-[18px]">landscape</span>
						</div>
					)}
					<span class="font-body-md text-body-md text-on-background font-semibold">{event.titre || event.title}</span>
				</div>
			</td>
			<td class="px-6 py-4 text-sm text-secondary whitespace-nowrap">
			{event.dateDepart ? (
				<span class="flex flex-col gap-0.5">
					<span class="flex items-center gap-1">
						<span class="material-symbols-outlined text-[14px] text-primary-container">flight_takeoff</span>
						{formatIsoDateFr(event.dateDepart)}{event.heureDepart ? ` ${event.heureDepart}` : ''}
					</span>
					{event.dateRetour ? (
						<span class="flex items-center gap-1">
							<span class="material-symbols-outlined text-[14px] text-secondary">flight_land</span>
							{formatIsoDateFr(event.dateRetour)}{event.heureRetour ? ` ${event.heureRetour}` : ''}
						</span>
					) : null}
				</span>
			) : formatIsoDateFr(event.date || event.dateEvenement) || '—'}
		</td>
			<td class="px-6 py-4">
				<span class="font-mono text-sm font-semibold text-on-background bg-surface-container px-3 py-1 rounded-lg">
					{event.prix ? `${Number(event.prix).toLocaleString()} Ar` : '—'}
				</span>
			</td>
			<td class="px-6 py-4">
				<span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
					(event.estPublie || event.published)
						? 'bg-green-50 text-green-700 border border-green-200'
						: 'bg-amber-50 text-amber-700 border border-amber-200'
				}`}>
					<span class={`w-1.5 h-1.5 rounded-full ${event.published ? 'bg-green-500' : 'bg-amber-500'}`} />
					{(event.estPublie || event.published) ? 'Publié' : 'Brouillon'}
				</span>
			</td>
			<td class="px-6 py-4 text-right">
					<div class="flex items-center justify-end gap-1">
						<button onClick={() => onViewDetails?.(event)} class="p-2.5 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all duration-150" title="Détails">
							<span class="material-symbols-outlined text-[20px]">visibility</span>
						</button>
						<button onClick={() => onEdit?.(event)} class="p-2.5 rounded-xl text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-150" title="Modifier">
							<span class="material-symbols-outlined text-[20px]">edit</span>
						</button>
					<button
						onClick={() => onDelete?.(event.id)}
						class="p-2.5 rounded-xl text-secondary hover:text-red-600 hover:bg-red-50 transition-all duration-150"
						title="Supprimer"
					>
						<span class="material-symbols-outlined text-[20px]">delete</span>
					</button>
						<button type="button" class="p-2.5 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all duration-150" title="Plus">
							<span class="material-symbols-outlined text-[20px]">more_vert</span>
						</button>
				</div>
			</td>
		</tr>
	);
}
