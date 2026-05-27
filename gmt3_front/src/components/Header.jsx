import { useLocation } from 'preact-iso';
import { signal, effect } from '@preact/signals';
import { img } from '../utils/images.js';
import { useEffect, useState } from 'preact/hooks';

const mobileMenuOpen = signal(false);

export function Header() {
	const { url } = useLocation();
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const toggleMenu = () => {
		mobileMenuOpen.value = !mobileMenuOpen.value;
	};

	const navLinks = [
		{ href: '#expeditions', label: 'EXPEDITIONS' },
		{ href: '#destinations', label: 'DESTINATIONS' },
		{ href: '#guides', label: 'GUIDES' },
		{ href: '/events', label: 'OFFERS' },
		{ href: '#gallery', label: 'GALLERY' },
	];

	return (
		<header class={`z-50 sticky top-0 w-full transition-all duration-300 ${
			scrolled
				? 'bg-primary/95 shadow-lg shadow-black/10'
				: 'bg-primary'
		}`}>
			<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
				<a class="flex items-center gap-3 group" href="/">
					<img
						alt="Madagascar Tour Operator Logo"
						class="h-11 w-11 object-contain bg-on-secondary-fixed rounded-lg group-hover:scale-105 transition-transform duration-300"
						src={img('https://lh3.googleusercontent.com/aida/ADBb0uiWtkVpP9IygNCk2968P6_P0jCx24rUapBieKIsYxmuEYSxEQyLG0lJ2W17ldJCwq38WBfILboljeiRfMS8UcaL7Slw6F4l7EO9AY-__IkshFFw8wTnwGMLl0LEUIKNj5UMbDxki2Wnav-gfnmYjuDQNhjcVgMjn2aiRlfSypz8UkjmNjLtjG2iJPdQ7VSLCJSZh06cGvRlNv74uYrOmOIYWJe62sJCObpRt9DwlDDviqfV5aGYo4T4gO4')}
					/>
					<span class="font-h2 text-h2 font-black text-on-primary uppercase tracking-tighter">
						GMT+3 MADAGASCAR
					</span>
				</a>

				<nav class="hidden md:flex items-center gap-1" aria-label="Navigation principale">
					<ul class="flex items-center gap-1">
						{navLinks.map((link) => (
							<li key={link.href}>
								<a
									class="font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-all duration-200 py-2 px-4 rounded-lg"
									href={link.href}
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
					<div class="ml-4 pl-4 border-l border-white/20">
						<a
							href="#contact"
							class="font-button text-button bg-on-primary text-primary px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 inline-block"
						>
							BOOK NOW
						</a>
					</div>
				</nav>

				<button
					class="md:hidden text-on-primary p-2"
					onClick={toggleMenu}
					aria-label={mobileMenuOpen.value ? 'Fermer le menu' : 'Ouvrir le menu'}
					aria-expanded={mobileMenuOpen.value}
				>
					<span class="material-symbols-outlined text-3xl">
						{mobileMenuOpen.value ? 'close' : 'menu'}
					</span>
				</button>
			</div>

			{mobileMenuOpen.value && (
				<nav class="md:hidden bg-primary/98 border-t border-white/10" aria-label="Navigation mobile">
					<ul class="flex flex-col p-4 gap-1">
						{navLinks.map((link) => (
							<li key={link.href}>
								<a
									class="block font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-colors duration-200 py-3 px-4 rounded-lg"
									href={link.href}
									onClick={toggleMenu}
								>
									{link.label}
								</a>
							</li>
						))}
						<li class="pt-3 border-t border-white/10 mt-3">
							<a
								href="#contact"
								class="block w-full font-button text-button bg-on-primary text-primary px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 text-center"
								onClick={toggleMenu}
							>
								BOOK NOW
							</a>
						</li>
					</ul>
				</nav>
			)}
		</header>
	);
}
