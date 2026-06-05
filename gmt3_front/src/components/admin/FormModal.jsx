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
			<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
			<div class="relative bg-surface rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 border border-outline-variant/30 max-h-[90vh] overflow-y-auto">
				<h3 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight mb-6">{title}</h3>
				<form
					encType={encType}
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit(new FormData(e.currentTarget));
					}}
					class="space-y-5"
				>
					{children}
					<div class="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							class="px-6 py-3 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all font-button text-button"
						>
							Annuler
						</button>
						<button
							type="submit"
							class="px-6 py-3 rounded-xl bg-primary-container text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all font-bold"
						>
							{submitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
