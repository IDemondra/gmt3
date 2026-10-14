// @ts-nocheck
import { useScrollReveal } from '../../hooks/useScrollReveal.js';

const presets = {
	fadeUp: { x: 0, y: 12, scale: 0.992, filter: 'blur(0px)' },
	fadeDown: { x: 0, y: -10, scale: 0.992, filter: 'blur(0px)' },
	fadeLeft: { x: -12, y: 6, scale: 0.996, filter: 'blur(0px)' },
	fadeRight: { x: 12, y: 6, scale: 0.996, filter: 'blur(0px)' },
	fadeIn: { x: 0, y: 0, scale: 0.998, filter: 'blur(0px)' },
	scaleUp: { x: 0, y: 10, scale: 0.975, filter: 'blur(0px)' },
	scaleDown: { x: 0, y: -8, scale: 1.015, filter: 'blur(0px)' },
	arc: { x: 0, y: 16, scale: 0.985, filter: 'blur(0px)' },
	driftLeft: { x: -16, y: 8, scale: 0.993, filter: 'blur(0px)' },
	driftRight: { x: 16, y: 8, scale: 0.993, filter: 'blur(0px)' },
	pulse: { x: 0, y: 8, scale: 0.982, filter: 'blur(0px)' },
	// Creative 2026 — clip + blur + warp (éditorial, pas vu partout)
	clip: { x: 0, y: 18, scale: 0.96, filter: 'blur(8px)', clip: 'inset(0 100% 0 0)' },
	warp: { x: 0, y: 14, scale: 0.92, filter: 'blur(6px)', rotate: '-0.8deg' },
	blurScale: { x: 0, y: 10, scale: 0.94, filter: 'blur(10px)' },
	kinetic: { x: 0, y: 20, scale: 0.97, filter: 'blur(6px)' },
	magnetic: { x: 0, y: 8, scale: 0.99, filter: 'blur(0px)' },
};

const creativeAnimations = new Set(['clip', 'warp', 'blurScale', 'kinetic']);

const baseStyle = {
	transitionProperty: 'transform, opacity, filter, clip-path',
	transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
};


const getRevealStyle = (preset, isVisible, staggerDelay, duration) => ({
	...baseStyle,
	transitionDelay: `${staggerDelay}ms`,
	transitionDuration: `${duration}ms`,
	transform: `translate(${isVisible ? 0 : preset.x}px, ${isVisible ? 0 : preset.y}px) scale(${isVisible ? 1 : preset.scale}) ${preset.rotate ? `rotate(${isVisible ? '0deg' : preset.rotate})` : ''}`,
	opacity: isVisible ? 1 : 0,
	filter: isVisible ? 'blur(0px)' : preset.filter,
	clipPath: preset.clip ? (isVisible ? 'inset(0 0% 0 0)' : preset.clip) : undefined,
});

export function Reveal({ children, animation = 'fadeUp', delay = 0, duration = 650, className = '', creative = false, stagger = 0, index = 0 }) {
	const { ref, isVisible } = useScrollReveal();
	const preset = presets[animation] || presets.fadeUp;
	const isCreative = creative || creativeAnimations.has(animation);
	const staggerDelay = stagger ? index * stagger : delay;

	const style = getRevealStyle(preset, isVisible, staggerDelay, duration);

	const creativeClass = isCreative ? 'creative-reveal' : '';

	return (
		<div
			ref={ref}
			class={`motion-reveal ${isVisible ? 'is-visible' : ''} ${creativeClass} ${className}`}
			style={style}
			data-creative={isCreative ? animation : undefined}
			data-index={index}
		>
			{children}
		</div>
	);
}
