import { useScrollReveal } from '../../hooks/useScrollReveal.js';

const presets = {
	fadeUp: { x: 0, y: 34, scale: 0.98, rotate: 0, blur: 10 },
	fadeDown: { x: 0, y: -26, scale: 0.98, rotate: 0, blur: 8 },
	fadeLeft: { x: -34, y: 18, scale: 0.975, rotate: 0.6, blur: 9 },
	fadeRight: { x: 34, y: 18, scale: 0.975, rotate: -0.6, blur: 9 },
	fadeIn: { x: 0, y: 0, scale: 0.985, rotate: 0, blur: 12 },
	scaleUp: { x: 0, y: 24, scale: 0.9, rotate: 0, blur: 12 },
	scaleDown: { x: 0, y: -18, scale: 1.06, rotate: 0, blur: 8 },
	arc: { x: 0, y: 42, scale: 0.94, rotate: -1.4, blur: 14 },
	driftLeft: { x: -46, y: 24, scale: 0.965, rotate: 1.2, blur: 12 },
	driftRight: { x: 46, y: 24, scale: 0.965, rotate: -1.2, blur: 12 },
	pulse: { x: 0, y: 20, scale: 0.92, rotate: 0, blur: 16 },
};

const baseStyle = {
	transitionProperty: 'transform, opacity, filter',
	transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

export function Reveal({ children, animation = 'fadeUp', delay = 0, duration = 900, className = '' }) {
	const { ref, isVisible } = useScrollReveal();
	const preset = presets[animation] || presets.fadeUp;
	const style = {
		...baseStyle,
		'--reveal-delay': `${delay}ms`,
		'--reveal-duration': `${duration}ms`,
		'--reveal-x': `${isVisible ? 0 : preset.x}px`,
		'--reveal-y': `${isVisible ? 0 : preset.y}px`,
		'--reveal-scale': isVisible ? 1 : preset.scale,
		'--reveal-rotate': `${isVisible ? 0 : preset.rotate}deg`,
		'--reveal-blur': `${isVisible ? 0 : preset.blur}px`,
	};

	return (
		<div ref={ref} class={`motion-reveal ${isVisible ? 'is-visible' : ''} ${className}`} style={style}>
			{children}
		</div>
	);
}
