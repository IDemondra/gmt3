// Partytown forwards gtag to its worker through astro.config.mjs.
export function trackEvent(name, params = {}) {
	if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
	window.gtag('event', name, params);
}
