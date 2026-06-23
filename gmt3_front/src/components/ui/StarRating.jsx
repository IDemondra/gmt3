/**
 * Étoiles. Mode lecture (value) ou saisie (onChange fourni).
 * @param {{ value?: number, onChange?: (n:number)=>void, size?: string, className?: string }} props
 */
export function StarRating({ value = 0, onChange, size = 'text-[18px]', className = '' }) {
	const interactive = typeof onChange === 'function';
	return (
		<div class={`inline-flex items-center gap-0.5 ${className}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`Note ${value} sur 5`}>
			{[1, 2, 3, 4, 5].map((n) => {
				const filled = n <= Math.round(value);
				const star = (
					<span class={`material-symbols-outlined ${size} ${filled ? 'text-amber-400' : 'text-gray-300'}`} style={filled ? 'font-variation-settings: \'FILL\' 1;' : ''}>
						star
					</span>
				);
				return interactive ? (
					<button
						key={n}
						type="button"
						onClick={() => onChange(n)}
						class="cursor-pointer transition-transform hover:scale-110"
						aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
					>
						{star}
					</button>
				) : <span key={n}>{star}</span>;
			})}
		</div>
	);
}
