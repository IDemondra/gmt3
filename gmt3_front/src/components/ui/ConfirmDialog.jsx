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
 *   children?: import('preact').ComponentChildren,
 *   confirmClass?: string,
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
	children,
	confirmClass = '',
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
			<div
				class="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
				onClick={onCancel}
			/>

			<div class="relative w-full max-w-sm rounded-xl bg-white shadow-xl p-6 border border-gray-100">
				<div class={`mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center ${
					isDanger ? 'bg-red-50' : 'bg-blue-50'
				}`}>
					<span class={`material-symbols-outlined text-2xl ${
						isDanger ? 'text-red-500' : 'text-blue-500'
					}`}>
						{isDanger ? 'warning' : icon}
					</span>
				</div>

				<h3 class="text-center text-lg font-bold text-gray-900 mb-2">
					{title}
				</h3>

				<p class="text-center text-sm text-gray-500 mb-6 leading-relaxed">
					{message}
				</p>

				<div class="flex gap-3">
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						class="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{cancelLabel}
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						disabled={loading}
						class={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
							isDanger
								? 'bg-red-600 text-white hover:bg-red-700'
								: 'bg-primary text-white hover:bg-primary-container'
						}`}
					>
						{loading && <span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
						{loading ? 'Patientez...' : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
