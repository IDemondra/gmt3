import { useState } from 'preact/hooks';

/**
 * @param {{
 *   open: boolean,
 *   title?: string,
 *   message?: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   variant?: 'danger' | 'default',
 *   icon?: string,
 *   onConfirm: () => void | Promise<void>,
 *   onCancel?: () => void,
 * }} _
 */
export function ConfirmDialog({
	open,
	title = 'Confirmer',
	message = 'Êtes-vous sûr de vouloir continuer ?',
	confirmLabel = 'Confirmer',
	cancelLabel = 'Annuler',
	variant = 'default',
	icon = 'help',
	onConfirm,
	onCancel,
}) {
	const [loading, setLoading] = useState(false);

	if (!open) return null;

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await onConfirm();
		} finally {
			setLoading(false);
		}
	};

	const isDanger = variant === 'danger';

	return (
		<div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				class="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onCancel}
			/>

			{/* Dialog */}
			<div class="relative w-full max-w-sm rounded-2xl bg-surface border border-outline-variant/40 shadow-2xl p-6 animate-[scaleUp_200ms_ease-out]">
				{/* Icon */}
				<div class={`mx-auto mb-4 h-14 w-14 rounded-full flex items-center justify-center ${
					isDanger ? 'bg-red-50' : 'bg-primary/5'
				}`}>
					<span class={`material-symbols-outlined text-3xl ${
						isDanger ? 'text-red-500' : 'text-primary-container'
					}`}>
						{isDanger ? 'warning' : icon}
					</span>
				</div>

				{/* Title */}
				<h3 class="text-center font-h3 text-h3 text-on-background font-black mb-2">
					{title}
				</h3>

				{/* Message */}
				<p class="text-center font-body-md text-body-md text-secondary mb-6 leading-relaxed">
					{message}
				</p>

				{/* Actions */}
				<div class="flex flex-col-reverse sm:flex-row gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						class="flex-1 px-5 py-3 rounded-xl border border-outline-variant/40 text-secondary font-button text-button hover:bg-surface-container transition-all duration-200 disabled:opacity-50"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						disabled={loading}
						class={`flex-1 px-5 py-3 rounded-xl font-button text-button transition-all duration-200 disabled:opacity-50 inline-flex items-center justify-center gap-2 ${
							isDanger
								? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/20'
								: 'bg-primary-container text-on-primary hover:shadow-lg hover:shadow-primary/20'
						}`}
					>
						{loading && (
							<span class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
						)}
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
