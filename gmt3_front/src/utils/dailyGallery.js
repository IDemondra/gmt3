export function getLocalDayKey(date = new Date()) {
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
		.map((part, index) => (index === 0 ? String(part) : String(part).padStart(2, '0')))
		.join('-');
}

function hashSeed(value) {
	let hash = 2166136261;
	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619) >>> 0;
	}
	return hash || 1;
}

function seededShuffle(items, seed) {
	const shuffled = [...items];
	let state = hashSeed(seed);

	for (let index = shuffled.length - 1; index > 0; index--) {
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
		const swapIndex = state % (index + 1);
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}

	return shuffled;
}

function getEventPhotos(event, usedUrls) {
	const photos = Array.isArray(event?.photosEvenement) ? event.photosEvenement : [];

	return photos.filter((photo) => {
		const url = typeof photo?.url === 'string' ? photo.url.trim() : '';
		if (!url || usedUrls.has(url)) return false;
		usedUrls.add(url);
		return true;
	});
}

export function buildDailyGallery(events = [], maxItems = 5, dayKey = getLocalDayKey()) {
	if (!Array.isArray(events) || maxItems <= 0) return [];

	const usedUrls = new Set();
	const eventsWithPhotos = events.reduce((result, event) => {
		const photos = getEventPhotos(event, usedUrls);
		if (photos.length > 0) result.push({ event, photos });
		return result;
	}, []);
	const orderedEvents = seededShuffle(eventsWithPhotos, `${dayKey}:events`);
	const firstPhotoByEvent = orderedEvents.flatMap(({ event, photos }) => {
		const photo = seededShuffle(photos, `${dayKey}:event:${event.id}`)[0];
		return photo ? [{ event, photo }] : [];
	}).slice(0, maxItems);
	const selectedKeys = new Set(firstPhotoByEvent.map(({ event, photo }) => `${event.id}:${photo.url}`));
	const remainingPhotos = seededShuffle(
		orderedEvents.flatMap(({ event, photos }) => photos.flatMap((photo) =>
			selectedKeys.has(`${event.id}:${photo.url}`) ? [] : [{ event, photo }])),
		`${dayKey}:photos`,
	);

	return seededShuffle(
		[...firstPhotoByEvent, ...remainingPhotos].slice(0, maxItems),
		`${dayKey}:display`,
	);
}
