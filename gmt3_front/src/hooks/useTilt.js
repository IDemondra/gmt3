import { useEffect, useRef } from 'preact/hooks';

export function useTilt(max = 8) {
	const ref = useRef(null);
	useEffect(() => {
		const el = ref.current;
		if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let raf = 0;
		let resetTimer = 0;
		const onMove = (e) => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(() => {
				const rect = el.getBoundingClientRect();
				const x = (e.clientX - rect.left) / rect.width - 0.5;
				const y = (e.clientY - rect.top) / rect.height - 0.5;
				el.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) rotate(1.5deg)`;
			});
		};
		const onLeave = () => {
			cancelAnimationFrame(raf);
			clearTimeout(resetTimer);
			el.style.transform = 'perspective(900px) rotateY(0) rotateX(0) rotate(1.5deg)';
			el.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
			resetTimer = window.setTimeout(() => (el.style.transition = ''), 600);
		};
		const parent = el.parentElement;
		const target = parent || el;
		target.addEventListener('mousemove', onMove);
		target.addEventListener('mouseleave', onLeave);
		return () => {
			cancelAnimationFrame(raf);
			clearTimeout(resetTimer);
			target.removeEventListener('mousemove', onMove);
			target.removeEventListener('mouseleave', onLeave);
		};
	}, [max]);
	return ref;
}
