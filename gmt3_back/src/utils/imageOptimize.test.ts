import { describe, expect, test } from 'bun:test';
import sharp from 'sharp';
import { optimizeImage } from './imageOptimize.js';

describe('optimizeImage', () => {
	test('redimensionne au-delà de 1920px et allège', async () => {
		const big = await sharp({ create: { width: 4000, height: 3000, channels: 3, background: { r: 120, g: 80, b: 40 } } })
			.jpeg({ quality: 100 }).toBuffer();
		const { buf, ext } = await optimizeImage(big, 'jpg');
		const meta = await sharp(buf).metadata();
		expect(ext).toBe('webp');
		expect(meta.format).toBe('webp');
		expect(Math.max(meta.width ?? 0, meta.height ?? 0)).toBeLessThanOrEqual(1920);
		expect(buf.length).toBeLessThanOrEqual(big.length);
	});

	test('laisse les GIF intacts', async () => {
		const fake = Buffer.from('GIF89a-not-real');
		const { buf, ext } = await optimizeImage(fake, 'gif');
		expect(ext).toBe('gif');
		expect(buf).toBe(fake);
	});

	test('ne plante pas sur un buffer invalide (retourne l\'original)', async () => {
		const garbage = Buffer.from('pas-une-image');
		const { buf } = await optimizeImage(garbage, 'jpg');
		expect(buf).toBe(garbage);
	});
});
