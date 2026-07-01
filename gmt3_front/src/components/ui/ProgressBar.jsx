/**
 * Barre de progression d'upload 0-100, partagée entre Photos.jsx et Dashboard.jsx.
 * @param {{ percent: number; label?: string; class?: string }} props
 */
export function ProgressBar({ percent, label, class: className = '' }) {
	return (
		<div class={`w-full ${className}`}>
			{label && <p class="text-xs text-gray-400 mb-1.5">{label}</p>}
			<div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
				<div class="h-full bg-primary rounded-full transition-[width] duration-150" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
			</div>
			<p class="text-[11px] text-gray-400 mt-1 text-right">{Math.round(percent)}%</p>
		</div>
	);
}
