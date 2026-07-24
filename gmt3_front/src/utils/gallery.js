export function buildPreviewGallery(mainImage, gallery = [], maxItems = 10) {
	const seen = new Set();
	const items = [mainImage, ...gallery].reduce((result, url) => {
		if (typeof url === 'string' && url.trim().length > 0 && !seen.has(url)) {
			seen.add(url);
			result.push(url);
		}
		return result;
	}, []);

	return items.slice(0, maxItems);
}
