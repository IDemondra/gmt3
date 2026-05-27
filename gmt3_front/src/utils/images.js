const GOOGLE_CDN = 'https://lh3.googleusercontent.com/';

export function img(url) {
	if (typeof url !== 'string' || url.length === 0) {
		return '';
	}

	if (url.startsWith(GOOGLE_CDN)) {
		return url.replace(GOOGLE_CDN, '/google-img/');
	}
	return url;
}
