const GOOGLE_CDN = 'https://lh3.googleusercontent.com/';

export function img(url) {
	if (url.startsWith(GOOGLE_CDN)) {
		return url.replace(GOOGLE_CDN, '/google-img/');
	}
	return url;
}
