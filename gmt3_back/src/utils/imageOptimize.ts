import sharp from 'sharp';

const MAX_DIMENSION = 1920; // px — largeur/hauteur max
const WEBP_QUALITY = 80;

/**
 * Redimensionne (max 1920px, sans agrandir) et convertit en WebP pour le web.
 * Corrige aussi l'orientation EXIF (photos smartphone tournées).
 * GIF laissé tel quel (préserve l'animation).
 *
 * @returns le buffer optimisé et l'extension (webp, sauf gif).
 */
export async function optimizeImage(input: Buffer, ext: string): Promise<{ buf: Buffer; ext: string }> {
	const normalized = ext.toLowerCase();
	if (normalized === 'gif') return { buf: input, ext };

	try {
		const output = await sharp(input)
			.rotate()
			.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
			.webp({ quality: WEBP_QUALITY })
			.toBuffer();

		return { buf: output, ext: 'webp' };
	} catch {
		// En cas d'échec d'encodage, ne jamais bloquer l'upload : on garde l'original.
		return { buf: input, ext };
	}
}
