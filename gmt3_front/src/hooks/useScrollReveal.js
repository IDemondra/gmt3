import { useEffect, useRef, useState } from 'preact/hooks';

const defaultOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px',
	once: true,
};

export function useScrollReveal(options = {}) {
	const ref = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const { threshold, rootMargin, once } = { ...defaultOptions, ...options };

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

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
