/**
 * État de chargement uniforme pour les listes admin — remplace les "Chargement..."
 * ad-hoc dupliqués dans chaque vue.
 * @param {{ label?: string; class?: string }} props
 */
export function Skeleton({ label = 'Chargement...', class: className = '' }) {
	return (
		<div class={`flex flex-col items-center justify-center gap-3 py-16 text-gray-400 ${className}`}>
			<span class="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
			<span class="text-sm">{label}</span>
		</div>
	);
}
