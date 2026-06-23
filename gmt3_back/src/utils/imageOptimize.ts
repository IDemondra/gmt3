import sharp from 'sharp';

const MAX_DIMENSION = 1920; // px — largeur/hauteur max
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

/**
 * Redimensionne (max 1920px, sans agrandir) et ré-encode une image pour le web.
 * Corrige aussi l'orientation EXIF (photos smartphone tournées).
 * GIF laissé tel quel (préserve l'animation). Si l'optimisation alourdit, on garde l'original.
 *
 * @returns le buffer optimisé et l'extension (inchangée).
 */
export async function optimizeImage(input: Buffer, ext: string): Promise<{ buf: Buffer; ext: string }> {
	const normalized = ext.toLowerCase();
	if (normalized === 'gif') return { buf: input, ext };

	try {
		const pipeline = sharp(input)
			.rotate()
			.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true });

		let output: Buffer;
		if (normalized === 'png') {
			output = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
		} else if (normalized === 'webp') {
			output = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
		} else {
			// jpeg / jpg et tout le reste convertible
			output = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
		}

		return output.length < input.length ? { buf: output, ext } : { buf: input, ext };
	} catch {
		// En cas d'échec d'encodage, ne jamais bloquer l'upload : on garde l'original.
		return { buf: input, ext };
	}
}
