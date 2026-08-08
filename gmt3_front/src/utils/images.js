const GOOGLE_CDN = 'https://lh3.googleusercontent.com/';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
export const BACKEND = API_BASE.replace(/\/api$/, '');

export function img(url) {
	if (typeof url !== 'string' || url.length === 0) {
		return '';
	}

	if (url.startsWith(GOOGLE_CDN)) {
		return url.replace(GOOGLE_CDN, '/google-img/');
	}
	return url;
}

export function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}
