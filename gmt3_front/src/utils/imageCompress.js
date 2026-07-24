const MAX_DIMENSION = 2000;

function loadImage(file) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error('IMAGE_ILLISIBLE'));
		};
		img.src = objectUrl;
	});
}

/**
 * Recompresse une image côté client si elle dépasse maxBytes.
 * Réduit la résolution puis la qualité JPEG jusqu'à passer sous la limite.
 * Retombe sur le fichier d'origine si la compression échoue (ex: format illisible par le navigateur).
 * @param {File} file
 * @param {number} maxBytes
 * @returns {Promise<File>}
 */
export async function compressImageIfNeeded(file, maxBytes) {
	if (!file.type.startsWith('image/') || file.size <= maxBytes) return file;

	try {
		const img = await loadImage(file);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		let { width, height } = img;
		const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
		width = Math.round(width * scale);
		height = Math.round(height * scale);
		canvas.width = width;
		canvas.height = height;
		ctx.drawImage(img, 0, 0, width, height);
		URL.revokeObjectURL(img.src);

		let quality = 0.9;
		for (let attempt = 0; attempt < 6; attempt++) {
			const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
			if (!blob) break;
			if (blob.size <= maxBytes || quality <= 0.4) {
				const newName = file.name.replace(/\.[^.]+$/, '.jpg');
				return new File([blob], newName, { type: 'image/jpeg' });
			}
			quality -= 0.15;
		}
		return file;
	} catch {
		return file;
	}
}
