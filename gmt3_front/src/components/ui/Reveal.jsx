import { useScrollReveal } from '../../hooks/useScrollReveal.js';

const presets = {
	fadeUp: { x: 0, y: 20, scale: 0.985, rotate: 0, blur: 4 },
	fadeDown: { x: 0, y: -16, scale: 0.985, rotate: 0, blur: 4 },
	fadeLeft: { x: -20, y: 10, scale: 0.99, rotate: 0.25, blur: 4 },
	fadeRight: { x: 20, y: 10, scale: 0.99, rotate: -0.25, blur: 4 },
	fadeIn: { x: 0, y: 0, scale: 0.992, rotate: 0, blur: 2 },
	scaleUp: { x: 0, y: 14, scale: 0.955, rotate: 0, blur: 4 },
	scaleDown: { x: 0, y: -10, scale: 1.03, rotate: 0, blur: 3 },
	arc: { x: 0, y: 24, scale: 0.97, rotate: -0.6, blur: 5 },
	driftLeft: { x: -26, y: 14, scale: 0.98, rotate: 0.45, blur: 4 },
	driftRight: { x: 26, y: 14, scale: 0.98, rotate: -0.45, blur: 4 },
	pulse: { x: 0, y: 12, scale: 0.965, rotate: 0, blur: 5 },
};

const baseStyle = {
	transitionProperty: 'transform, opacity, filter',
	transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

export function Reveal({ children, animation = 'fadeUp', delay = 0, duration = 680, className = '' }) {
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
