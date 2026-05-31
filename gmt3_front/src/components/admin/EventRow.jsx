export function EventRow({ event, index, onDelete, onEdit }) {
	const isEven = index % 2 === 0;

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
					<div class="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
						<span class="material-symbols-outlined text-primary-container text-[18px]">landscape</span>
					</div>
					<span class="font-body-md text-body-md text-on-background font-semibold">{event.title}</span>
				</div>
			</td>
			<td class="px-6 py-4 text-sm text-secondary whitespace-nowrap">{event.date}</td>
			<td class="px-6 py-4">
				<span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
					event.published
						? 'bg-green-50 text-green-700 border border-green-200'
						: 'bg-amber-50 text-amber-700 border border-amber-200'
				}`}>
					<span class={`w-1.5 h-1.5 rounded-full ${event.published ? 'bg-green-500' : 'bg-amber-500'}`} />
					{event.published ? 'Publié' : 'Brouillon'}
				</span>
			</td>
			<td class="px-6 py-4 text-right">
				<div class="flex items-center justify-end gap-1">
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
					<button class="p-2.5 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all duration-150" title="Plus">
						<span class="material-symbols-outlined text-[20px]">more_vert</span>
					</button>
				</div>
			</td>
		</tr>
	);
}
