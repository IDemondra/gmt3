export function AdminListHeader({ title, subtitle, actionLabel = 'Ajouter', onAction }) {
	return (
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
			<div>
				<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">{title}</h1>
				<p class="text-gray-500 mt-2 text-base">{subtitle}</p>
			</div>
			<button type="button" onClick={onAction} class="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer">
				<span class="material-symbols-outlined text-[20px]">add</span> {actionLabel}
			</button>
		</div>
	);
}
