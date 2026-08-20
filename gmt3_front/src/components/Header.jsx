import { signal } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';

const mobileMenuOpen = signal(false);

export function Header({ theme = 'dark' }) {
	const [scrolled, setScrolled] = useState(false);
	const isLight = theme === 'light';

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		if (mobileMenuOpen.value) {
			const previous = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = previous;
			};
		}
	}, [mobileMenuOpen.value]); // eslint-disable-line react-doctor/exhaustive-deps -- preact signal .value is reactive subscription

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape') mobileMenuOpen.value = false;
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	const toggleMenu = () => {
		mobileMenuOpen.value = !mobileMenuOpen.value;
	};

	const navLinks = [
		{ href: '/events', label: 'EXPÉDITIONS' },
		{ href: '/conseils', label: 'CONSEILS' },
		{ href: '/archives', label: 'GALERIE' },
		{ href: '/faq', label: 'FAQ' },
	];

	return (
		<header class={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
			scrolled ? 'py-2' : 'py-4 md:py-6'
		}`}>
			<div class="max-w-container-max mx-auto px-4 md:px-margin-desktop">
				<div class={`relative flex items-center justify-between px-4 md:px-6 py-3 rounded-2xl border transition-all duration-500 overflow-hidden isolate ${
						scrolled
							? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl'
							: isLight
								? 'bg-surface/90 backdrop-blur-xl border-outline-variant/60 shadow-lg'
								: 'bg-transparent border-transparent'
				}`}>
					{/* Scanning Line Effect (Only when scrolled) */}
					{scrolled && (
						<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer pointer-events-none" />
					)}

					{/* Left: Brand */}
					<a class="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0" href="/">
						<div class="relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg shadow-lg group-hover:rotate-6 transition-transform overflow-hidden">
							<img src="/assets/logo_gmt3.jpeg" alt="GMT+3 Fianarantsoa - Great Madagascar Tours logo" width="40" height="40" loading="eager" decoding="async" class="w-full h-full object-cover" />
						</div>
						<span class={`font-h2 text-base md:text-lg font-black uppercase tracking-tighter transition-colors ${scrolled ? 'text-white' : isLight ? 'text-on-background' : 'text-on-primary'}`}>
							GMT+3 <span class="text-primary-container hidden sm:inline">MADAGASCAR</span>
						</span>
					</a>

					{/* Center: Main Nav — desktop only (lg+) */}
					<nav class="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
						<ul class="flex items-center gap-1">
							{navLinks.map((link) => (
								<li key={link.href}>
									<a
										class={`font-button text-[11px] tracking-[0.2em] transition-all duration-300 py-2 px-3 xl:px-4 rounded-full border border-transparent uppercase font-bold cursor-pointer ${
											isLight && !scrolled ? 'hover:border-outline-variant hover:bg-surface-container' : 'hover:border-white/10 hover:bg-white/5'
										} ${
											scrolled ? 'text-white/70 hover:text-white' : isLight ? 'text-on-background/70 hover:text-on-background' : 'text-white/80 hover:text-white'
										}`}
										href={link.href}
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					{/* Right: Action & Mobile Toggle */}
					<div class="flex items-center gap-2 md:gap-4 shrink-0">
						<a
							href="/#contact"
							class="hidden lg:flex items-center gap-2 bg-primary hover:bg-primary-container text-white px-4 xl:px-5 py-2.5 rounded-full font-button text-[10px] tracking-widest font-black uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 cursor-pointer"
						>
							DEMANDER UN ITINÉRAIRE
							<span class="material-symbols-outlined text-sm">sensors</span>
						</a>

						<button type="button"
							class={`lg:hidden h-10 w-10 flex items-center justify-center rounded-xl transition-colors cursor-pointer ${scrolled ? 'text-white bg-white/5' : isLight ? 'text-on-background bg-black/5 border border-outline-variant/60' : 'text-white bg-black/20'}`}
							onClick={toggleMenu}
							aria-label={mobileMenuOpen.value ? 'Fermer le menu' : 'Ouvrir le menu'}
							aria-expanded={mobileMenuOpen.value}
							aria-controls="mobile-navigation"
						>
							<span class="material-symbols-outlined text-xl leading-none">
								{mobileMenuOpen.value ? 'close' : 'grid_view'}
							</span>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu Overlay — visible below lg */}
			<div id="mobile-navigation" class={`fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
				mobileMenuOpen.value ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
			}`}>
				<div class="flex flex-col h-full p-8">
					<div class="flex justify-between items-center mb-16">
						<span class="font-mono text-[10px] text-primary tracking-[0.4em] uppercase font-bold">Menu</span>
						<button type="button" onClick={toggleMenu} class="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-white cursor-pointer">
							<span class="material-symbols-outlined">close</span>
						</button>
					</div>

					<nav aria-label="Navigation mobile" class="flex-1">
						<ul class="flex flex-col gap-6">
							{navLinks.map((link, i) => (
								<li key={link.href} style={`transition-delay: ${i * 100}ms`} class={`transition-all duration-500 transform ${mobileMenuOpen.value ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
									<a
										class="flex items-baseline gap-4 group cursor-pointer"
										href={link.href}
										onClick={toggleMenu}
									>
										<span class="font-mono text-xs text-primary font-bold">0{i+1}</span>
										<span class="text-4xl font-black text-white uppercase tracking-tighter group-hover:text-primary transition-colors">{link.label}</span>
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div class="pt-12 border-t border-white/10 text-center">
						<a href="/#contact" onClick={toggleMenu} class="flex items-center justify-center gap-3 w-full bg-primary hover:bg-primary-container py-5 rounded-2xl text-white font-black tracking-widest text-xs uppercase shadow-2xl transition-all duration-300">
							DEMANDER UN DEVIS
							<span class="material-symbols-outlined">north_east</span>
						</a>
					</div>
				</div>
			</div>
			
			<style>{`
				@keyframes shimmer {
					0% { transform: translateX(-100%); }
					100% { transform: translateX(100%); }
				}
				.animate-shimmer {
					animation: shimmer 3s infinite linear;
				}
			`}</style>
		</header>
	);
}
