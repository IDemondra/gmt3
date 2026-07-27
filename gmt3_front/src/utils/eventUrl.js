export function eventPath(event) {
	if (event?.publicCode) return `/${encodeURIComponent(event.publicCode)}`;
	return `/events/${event?.id ?? ''}`;
}
