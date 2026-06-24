export function trackEvent(eventName, eventParams = {}) {
	if (typeof window !== 'undefined' && window.gtag) {
		window.gtag('event', eventName, eventParams);
	}
}

export function trackPageView(pageTitle, pagePath) {
	if (typeof window !== 'undefined' && window.gtag) {
		window.gtag('config', {
			page_title: pageTitle,
			page_path: pagePath,
		});
	}
}

export function trackConversion(value, currency = 'MGA') {
	trackEvent('purchase', {
		value: value,
		currency: currency,
	});
}
