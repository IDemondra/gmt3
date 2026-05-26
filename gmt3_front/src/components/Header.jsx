import { useLocation } from 'preact-iso';
import { signal } from '@preact/signals';
import { img } from '../utils/images.js';

const mobileMenuOpen = signal(false);

export function Header() {
	const { url } = useLocation();

	const toggleMenu = () => {
		mobileMenuOpen.value = !mobileMenuOpen.value;
	};

	return (
		<header class="bg-primary z-50 sticky top-0 w-full">
			<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
					<a class="flex items-center gap-4 group" href="/">
					<img
						alt="Madagascar Tour Operator Logo"
						class="h-12 w-12 object-contain bg-on-secondary-fixed rounded-lg"
						src={img('https://lh3.googleusercontent.com/aida/ADBb0uiWtkVpP9IygNCk2968P6_P0jCx24rUapBieKIsYxmuEYSxEQyLG0lJ2W17ldJCwq38WBfILboljeiRfMS8UcaL7Slw6F4l7EO9AY-__IkshFFw8wTnwGMLl0LEUIKNj5UMbDxki2Wnav-gfnmYjuDQNhjcVgMjn2aiRlfSypz8UkjmNjLtjG2iJPdQ7VSLCJSZh06cGvRlNv74uYrOmOIYWJe62sJCObpRt9DwlDDviqfV5aGYo4T4gO4')}
					/>
					<span class="font-h2 text-h2 font-black text-on-primary uppercase tracking-tighter">
						GMT+3 MADAGASCAR
					</span>
				</a>

				<nav class="hidden md:flex items-center gap-8">
					<ul class="flex items-center gap-6">
						<li><a class="font-button text-button text-on-primary/80 hover:text-on-primary-container hover:bg-primary-container transition-colors duration-200 py-2 px-3 rounded-lg" href="#expeditions">EXPEDITIONS</a></li>
						<li><a class="font-button text-button text-on-primary/80 hover:text-on-primary-container hover:bg-primary-container transition-colors duration-200 py-2 px-3 rounded-lg" href="#destinations">DESTINATIONS</a></li>
						<li><a class="font-button text-button text-on-primary/80 hover:text-on-primary-container hover:bg-primary-container transition-colors duration-200 py-2 px-3 rounded-lg" href="#guides">GUIDES</a></li>
						<li><a class="font-button text-button text-on-primary/80 hover:text-on-primary-container hover:bg-primary-container transition-colors duration-200 py-2 px-3 rounded-lg" href="/events">OFFERS</a></li>
						<li><a class="font-button text-button text-on-primary/80 hover:text-on-primary-container hover:bg-primary-container transition-colors duration-200 py-2 px-3 rounded-lg" href="#gallery">GALLERY</a></li>
					</ul>
				</nav>

				<button class="md:hidden text-on-primary p-2" onClick={toggleMenu}>
					<span class="material-symbols-outlined text-3xl">
						{mobileMenuOpen.value ? 'close' : 'menu'}
					</span>
				</button>
			</div>

			{mobileMenuOpen.value && (
				<nav class="md:hidden bg-primary border-t border-on-primary/10">
					<ul class="flex flex-col p-4 gap-2">
						<li><a class="block font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-primary-container/30 transition-colors duration-200 py-3 px-4 rounded-lg" href="#expeditions" onClick={toggleMenu}>EXPEDITIONS</a></li>
						<li><a class="block font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-primary-container/30 transition-colors duration-200 py-3 px-4 rounded-lg" href="#destinations" onClick={toggleMenu}>DESTINATIONS</a></li>
						<li><a class="block font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-primary-container/30 transition-colors duration-200 py-3 px-4 rounded-lg" href="#guides" onClick={toggleMenu}>GUIDES</a></li>
						<li><a class="block font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-primary-container/30 transition-colors duration-200 py-3 px-4 rounded-lg" href="/events" onClick={toggleMenu}>OFFERS</a></li>
						<li><a class="block font-button text-button text-on-primary/80 hover:text-on-primary hover:bg-primary-container/30 transition-colors duration-200 py-3 px-4 rounded-lg" href="#gallery" onClick={toggleMenu}>GALLERY</a></li>
						<li class="pt-2">
							<button class="w-full font-button text-button bg-on-primary text-primary px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300">BOOK NOW</button>
						</li>
					</ul>
				</nav>
			)}
		</header>
	);
}
