/**
 * @param {{
 *   columns: { key: string, label: string, render?: (row: any) => import('preact').ComponentChild }[],
 *   data: any[],
 *   search?: string,
 *   onSearch?: (v: string) => void,
 *   onEdit?: (row: any) => void,
 *   onDelete?: (row: any) => void,
 *   total?: number,
 *   pageSize?: number,
 *   loading?: boolean,
 *   emptyMessage?: string,
 * }} props
 */
export function DataTable({ columns, data, search, onSearch, onEdit, onDelete, total, pageSize = 10, loading, emptyMessage = 'Aucun résultat' }) {
	return (
		<div class="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden shadow-sm">
			{onSearch && (
				<div class="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20">
					<div>
						<p class="text-sm text-secondary">{data.length} résultat{data.length !== 1 ? 's' : ''}</p>
					</div>
					<div class="relative">
						<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
						<input
							class="pl-10 pr-4 py-2.5 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary w-full sm:w-64 rounded-xl"
							placeholder="Rechercher..."
							type="text"
							value={search}
							onInput={(e) => onSearch(e.currentTarget.value)}
						/>
					</div>
				</div>
			)}

			<div class="overflow-x-auto custom-scrollbar">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="border-b border-outline-variant/20 bg-surface-container/30">
							{columns.map((col) => (
								<th key={col.key} class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">{col.label}</th>
							))}
							{(onEdit || onDelete) && <th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right">Actions</th>}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr><td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} class="px-6 py-12 text-center text-secondary">Chargement…</td></tr>
						) : data.length === 0 ? (
							<tr><td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} class="px-6 py-12 text-center text-secondary">{emptyMessage}</td></tr>
						) : data.map((row, i) => (
							<tr key={row.id || i} class={`border-b border-outline-variant/30 transition-colors duration-150 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-container/40'} hover:bg-primary/5`}>
								{columns.map((col) => (
									<td key={col.key} class="px-6 py-4 text-sm text-on-background">
										{col.render ? col.render(row) : row[col.key]}
									</td>
								))}
								{(onEdit || onDelete) && (
									<td class="px-6 py-4 text-right">
										<div class="flex items-center justify-end gap-1">
											{onEdit && (
												<button onClick={() => onEdit(row)} class="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/5 transition-all" title="Modifier">
													<span class="material-symbols-outlined text-[20px]">edit</span>
												</button>
											)}
											{onDelete && (
												<button onClick={() => onDelete(row)} class="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/5 transition-all" title="Supprimer">
													<span class="material-symbols-outlined text-[20px]">delete</span>
												</button>
											)}
										</div>
									</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{total !== undefined && total > pageSize && (
				<div class="p-4 border-t border-outline-variant/20 flex justify-between items-center gap-4">
					<span class="text-sm text-secondary">1-{Math.min(data.length, pageSize)} sur {total}</span>
					<div class="flex gap-2">
						<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed" disabled>
							<span class="material-symbols-outlined text-[20px]">chevron_left</span>
						</button>
						<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all">
							<span class="material-symbols-outlined text-[20px]">chevron_right</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
