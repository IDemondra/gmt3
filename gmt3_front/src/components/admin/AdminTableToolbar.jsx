export function AdminTableToolbar({ title, count, search, onSearch }) {
	return (
		<div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-50">
			<div class="flex items-center gap-3">
				<h2 class="text-base font-bold text-gray-900">{title}</h2>
				<span class="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[11px] font-bold border border-gray-100">{count}</span>
			</div>
			<div class="relative w-full sm:w-auto">
				<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
				<input class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 w-full sm:w-72 rounded-lg" aria-label="Rechercher" placeholder="Rechercher..." type="text" value={search} onInput={(e) => onSearch(e.currentTarget.value)} />
			</div>
		</div>
	);
}
