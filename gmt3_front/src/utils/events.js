const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

let eventsPromise = null;

export function fetchEvents() {
	if (!eventsPromise) {
		eventsPromise = fetch(`${API_BASE}/evenements`)
			.then((r) => {
				if (!r.ok) throw new Error('Événements indisponibles');
				return r.json();
			})
			.then((response) => (Array.isArray(response.data) ? response.data : []))
			.catch((err) => {
				eventsPromise = null;
				throw err;
			});
	}
	return eventsPromise;
}
