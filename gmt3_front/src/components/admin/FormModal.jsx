/**
 * @param {{
 *   open: boolean;
 *   title: string;
 *   submitLabel?: string;
 *   onClose: () => void;
 *   onSubmit: (data: FormData) => void | Promise<void>;
 *   children: import('preact').ComponentChildren;
 *   encType?: string;
 * }} props
 */
export function FormModal({ open, title, submitLabel = 'Enregistrer', onClose, onSubmit, children, encType }) {
	if (!open) return null;

	return (
		<div class="fixed inset-0 z-50 flex items-center justify-center">
			<div class="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={onClose} />
			<div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
				<h3 class="text-xl font-extrabold text-gray-900 mb-6 tracking-tight">{title}</h3>
				<form
					encType={encType}
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(new FormData(e.currentTarget));
					}}
					class="space-y-6"
				>
					{children}
					<div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
						<button
							type="button"
							onClick={onClose}
							class="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all"
						>
							Annuler
						</button>
						<button
							type="submit"
							class="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container font-semibold text-sm transition-all shadow-sm"
						>
							{submitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
