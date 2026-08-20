import { useEffect, useRef } from 'preact/hooks';

export function useMagnetic(strength = 0.35) {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		const onMove = (e) => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const rect = el.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				const mx = ((x / rect.width) - 0.5) * strength * 24;
				const my = ((y / rect.height) - 0.5) * strength * 16;
				el.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
				el.style.setProperty('--my', `${(y / rect.height) * 100}%`);
				el.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
			});
		};
		const onLeave = () => {
			cancelAnimationFrame(raf);
			el.style.transform = 'translate3d(0,0,0)';
		};
		el.addEventListener('mousemove', onMove);
		el.addEventListener('mouseleave', onLeave);
		return () => {
			cancelAnimationFrame(raf);
			el.removeEventListener('mousemove', onMove);
			el.removeEventListener('mouseleave', onLeave);
		};
	}, [strength]);

	return ref;
}
