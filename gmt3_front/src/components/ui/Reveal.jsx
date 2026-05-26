import { useScrollReveal } from '../../hooks/useScrollReveal.js';

const animations = {
	fadeUp: 'opacity-0 translate-y-8',
	fadeDown: 'opacity-0 -translate-y-8',
	fadeLeft: 'opacity-0 -translate-x-16',
	fadeRight: 'opacity-0 translate-x-16',
	fadeIn: 'opacity-0',
	scaleUp: 'opacity-0 scale-75',
};

const visibleStyles = 'opacity-100 translate-y-0 translate-x-0 scale-100';

export function Reveal({ children, animation = 'fadeUp', delay = 0, className = '' }) {
	const { ref, isVisible } = useScrollReveal();
	const animClass = animations[animation] || animations.fadeUp;

	const combinedClass = `transition-all duration-700 ease-out ${isVisible ? visibleStyles : animClass} ${className}`;
	const style = {
		transitionDelay: `${delay}ms`,
		transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
	};

	return (
		<div ref={ref} class={combinedClass} style={style}>
			{children}
		</div>
	);
}
