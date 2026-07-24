import { useState } from 'preact/hooks';
import { compressImageIfNeeded } from '../utils/imageCompress.js';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const MAX_PHOTOS = 10;

export function formatMo(bytes) {
	return (bytes / 1024 / 1024).toFixed(1);
}

/**
 * Gère l'ajout, la compression, la prévisualisation et la suppression d'un lot
 * de photos de galerie — partagé entre Photos.jsx et Dashboard.jsx pour éviter
 * de dupliquer la logique de limite (nombre + poids total) et de compression.
 */
export function useGalleryUpload({ maxPhotos = MAX_PHOTOS, maxTotalBytes = MAX_TOTAL_BYTES, addToast } = {}) {
	const [files, setFiles] = useState(/** @type {File[]} */([]));
	const [previews, setPreviews] = useState(/** @type {string[]} */([]));
	const [compressingCount, setCompressingCount] = useState(0);

	const count = files.length;
	const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

	const addFiles = async (picked) => {
		if (!picked || picked.length === 0) return;
		const room = maxPhotos - count;
		if (room <= 0) {
			addToast?.(`Maximum ${maxPhotos} photos par événement`, 'warning');
			return;
		}
		const candidates = picked.slice(0, room);
		if (picked.length > room) {
			addToast?.(`Seules ${room} photo(s) ajoutée(s) (limite ${maxPhotos})`, 'warning');
		}

		// Compression immédiate (poids réel envoyé) pour un total fiable en temps réel.
		setCompressingCount(candidates.length);
		let runningTotal = totalBytes;
		const compressedCandidates = await Promise.all(candidates.map(async (file) => ({
			file,
			compressed: await compressImageIfNeeded(file, MAX_UPLOAD_BYTES),
		})));
		for (const { file, compressed } of compressedCandidates) {
			if (runningTotal >= maxTotalBytes) {
				addToast?.(`Limite de ${formatMo(maxTotalBytes)} Mo au total atteinte — photo(s) restante(s) ignorée(s)`, 'warning');
				setCompressingCount((c) => c - 1);
				break;
			}
			if (runningTotal + compressed.size > maxTotalBytes) {
				addToast?.(`"${file.name}" dépasserait la limite de ${formatMo(maxTotalBytes)} Mo — ignorée`, 'warning');
				setCompressingCount((c) => c - 1);
				continue;
			}
			runningTotal += compressed.size;
			setFiles((prev) => [...prev, compressed]);
			setPreviews((prev) => [...prev, URL.createObjectURL(compressed)]);
			setCompressingCount((c) => c - 1);
		}
		setCompressingCount(0);
	};

	const removeFile = (idx) => {
		setPreviews((prev) => {
			if (prev[idx]) URL.revokeObjectURL(prev[idx]);
			return prev.filter((_, i) => i !== idx);
		});
		setFiles((prev) => prev.filter((_, i) => i !== idx));
	};

	const reset = () => {
		previews.forEach((p) => URL.revokeObjectURL(p));
		setFiles([]);
		setPreviews([]);
	};

	return { files, previews, count, totalBytes, compressingCount, maxPhotos, maxTotalBytes, addFiles, removeFile, reset };
}
