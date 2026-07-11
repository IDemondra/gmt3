declare module 'heic-convert' {
	type Options = { buffer: Buffer; format: 'JPEG' | 'PNG'; quality?: number };
	export default function heicConvert(options: Options): Promise<ArrayBuffer>;
}
