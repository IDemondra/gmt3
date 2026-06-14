import { useEffect } from 'preact/hooks';

export function Toast({ message, type = 'info', onClose, autoClose = true }) {
	useEffect(() => {
		if (autoClose) {
			const timer = setTimeout(onClose, 4000);
			return () => clearTimeout(timer);
		}
	}, [autoClose, onClose]);

	const bgColor = {
		success: 'bg-green-50 border-green-200',
		error: 'bg-red-50 border-red-200',
		warning: 'bg-amber-50 border-amber-200',
		info: 'bg-blue-50 border-blue-200',
	}[type];

	const textColor = {
		success: 'text-green-800',
		error: 'text-red-800',
		warning: 'text-amber-800',
		info: 'text-blue-800',
	}[type];

	const iconBg = {
		success: 'bg-green-100 text-green-600',
		error: 'bg-red-100 text-red-600',
		warning: 'bg-amber-100 text-amber-600',
		info: 'bg-blue-100 text-blue-600',
	}[type];

	const icons = {
		success: 'check_circle',
		error: 'error',
		warning: 'warning',
		info: 'info',
	};

	return (
		<div
			class={`fixed bottom-6 right-6 max-w-md rounded-xl border ${bgColor} p-4 shadow-lg animate-slide-up z-[100]`}
			role="alert"
		>
			<div class="flex items-start gap-3">
				<div class={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
					<span class="material-symbols-outlined text-lg">{icons[type]}</span>
				</div>
				<div class="flex-1">
					<p class={`font-semibold ${textColor}`}>{message}</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					class={`shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5 transition-colors ${textColor}`}
				>
					<span class="material-symbols-outlined text-lg">close</span>
				</button>
			</div>
		</div>
	);
}

export function ToastContainer({ toasts, onRemove }) {
	return (
		<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} onClose={() => onRemove(toast.id)} />
			))}
		</div>
	);
}
