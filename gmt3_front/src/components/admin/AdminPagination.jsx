export function AdminPagination({ page, pageSize, total, totalPages, onPrev, onNext, emptyLabel = 'Aucun résultat' }) {
	const from = total === 0 ? 0 : page * pageSize + 1;
	const to = Math.min((page + 1) * pageSize, total);
	const label = total === 0 ? emptyLabel : `${from}-${to} sur ${total}`;
	return (
		<div class="p-4 border-t border-gray-50 flex justify-between items-center gap-4 bg-gray-50/20">
			<span class="text-xs text-gray-400 font-medium">{label}</span>
			<div class="flex gap-2">
				<button type="button" aria-label="Page précédente" class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled={page === 0} onClick={onPrev}><span class="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_left</span></button>
				<button type="button" aria-label="Page suivante" class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled={page >= totalPages - 1} onClick={onNext}><span class="material-symbols-outlined text-[18px]" aria-hidden="true">chevron_right</span></button>
			</div>
		</div>
	);
}
