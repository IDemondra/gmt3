import { useState } from 'preact/hooks';

export function useToast() {
	const [toasts, setToasts] = useState(/** @type {Array<{id: number, message: string, type: string}>} */ ([]));

	const addToast = (message, type = 'info') => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	return { toasts, addToast, removeToast };
}
