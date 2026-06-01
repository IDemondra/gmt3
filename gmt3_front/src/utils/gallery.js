export function buildPreviewGallery(mainImage, gallery = [], maxItems = 10) {
	const items = [mainImage, ...gallery]
		.filter((url) => typeof url === 'string' && url.trim().length > 0)
		.filter((url, index, list) => list.indexOf(url) === index);

	return items.slice(0, maxItems);
}
