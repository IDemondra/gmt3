import { useEffect, useRef, useState } from 'preact/hooks';

const defaultOptions = {
	threshold: 0.05,
	rootMargin: '0px 0px 60px 0px',
	once: true,
};

export function useScrollReveal(options = {}) {
	const ref = useRef(null);
	// Visible par défaut : SSR + no-JS + hydratation échouée => contenu jamais masqué (SEO safe).
	const [isVisible, setIsVisible] = useState(true);
	const { threshold, rootMargin, once } = { ...defaultOptions, ...options };

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof IntersectionObserver === 'undefined') return; // reste visible

		// On arme l'animation d'entrée seulement quand l'observer est dispo.
		setIsVisible(false);

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					if (once) observer.unobserve(el);
				} else if (!once) {
					setIsVisible(false);
				}
			},
			{ threshold, rootMargin }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold, rootMargin, once]);

	return { ref, isVisible };
}
