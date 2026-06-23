import { useEffect, useState } from 'preact/hooks';

/** Barre de progression de lecture, fixée en haut de la page. */
export function ScrollProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			const scrollable = document.documentElement.scrollHeight - window.innerHeight;
			setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	}, []);

	return (
		<div class="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none" aria-hidden="true">
			<div
				class="h-full bg-primary transition-[width] duration-150 ease-out"
				style={`width: ${progress}%`}
			/>
		</div>
	);
}
