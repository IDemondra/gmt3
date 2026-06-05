// @ts-nocheck
import { useScrollReveal } from '../../hooks/useScrollReveal.js';

const presets = {
	fadeUp: { x: 0, y: 12, scale: 0.992 },
	fadeDown: { x: 0, y: -10, scale: 0.992 },
	fadeLeft: { x: -12, y: 6, scale: 0.996 },
	fadeRight: { x: 12, y: 6, scale: 0.996 },
	fadeIn: { x: 0, y: 0, scale: 0.998 },
	scaleUp: { x: 0, y: 10, scale: 0.975 },
	scaleDown: { x: 0, y: -8, scale: 1.015 },
	arc: { x: 0, y: 16, scale: 0.985 },
	driftLeft: { x: -16, y: 8, scale: 0.993 },
	driftRight: { x: 16, y: 8, scale: 0.993 },
	pulse: { x: 0, y: 8, scale: 0.982 },
};

const baseStyle = {
	transitionProperty: 'transform, opacity',
	transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

export function Reveal({ children, animation = 'fadeUp', delay = 0, duration = 650, className = '' }) {
	const { ref, isVisible } = useScrollReveal();
	const preset = presets[animation] || presets.fadeUp;
	const style = {
		...baseStyle,
		transitionDelay: `${delay}ms`,
		transitionDuration: `${duration}ms`,
		transform: `translate(${isVisible ? 0 : preset.x}px, ${isVisible ? 0 : preset.y}px) scale(${isVisible ? 1 : preset.scale})`,
		opacity: isVisible ? 1 : 0,
	};

	return (
		<div ref={ref} class={`motion-reveal ${isVisible ? 'is-visible' : ''} ${className}`} style={style}>
			{children}
		</div>
	);
}
