import { Reveal } from './ui/Reveal.jsx';

const socialLinks = [
	{
		label: 'WhatsApp',
		href: 'https://wa.me/261340312401',
		viewBox: '0 0 32 32',
		path: 'M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.38L1.05 31.33l6.156-1.968A15.9 15.9 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0Zm9.318 22.594c-.386 1.09-1.92 1.994-3.142 2.258-.836.178-1.928.32-5.604-1.204-4.7-1.948-7.726-6.724-7.962-7.034-.226-.31-1.9-2.53-1.9-4.826s1.168-3.42 1.638-3.89c.386-.386.842-.562 1.122-.562.14 0 .266.007.38.013.328.014.492.034.708.55.27.648.928 2.244 1.006 2.408.08.164.134.356.024.566-.102.21-.192.328-.356.518-.164.19-.346.424-.494.57-.164.164-.336.342-.144.67.19.328.852 1.404 1.83 2.274 1.26 1.122 2.32 1.47 2.69 1.624.276.114.604.086.81-.13.262-.28.586-.744.916-1.2.234-.328.53-.368.84-.252.316.11 1.998.942 2.34 1.112.342.17.568.252.652.394.082.142.082.812-.304 1.902Z',
	},
	{
		label: 'Facebook',
		href: 'https://www.facebook.com/groups/1567275954180870',
		viewBox: '0 0 24 24',
		path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
	},
	{
		label: 'Email',
		href: 'mailto:hanitra@great-madagascar-tours.com',
		viewBox: '0 0 24 24',
		path: 'M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z',
	},
];

const navLinks = [
	{ label: 'Expéditions', href: '/events' },
	{ label: 'Conseils', href: '/conseils' },
	{ label: 'Galerie', href: '/archives' },
	{ label: 'FAQ', href: '/faq' },
];

const infoLinks = [
	{ label: 'Contact', href: '/#contact' },
	{ label: 'FAQ', href: '/faq' },
	{ label: 'Conditions', href: '/conditions-utilisation' },
	{ label: 'Recherche', href: '/recherche' },
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer class="relative bg-[#1c1b1b] overflow-hidden text-white">
				{/* Transition depuis la section contact */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
			</div>

			{/* Decorative ambient orbs */}
			<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
				<div class="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
				<div class="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] animate-pulse" />
			</div>

			{/* Grid Pattern */}
			<div class="absolute inset-0 opacity-[0.02] pointer-events-none" 
				 style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 40px 40px;" />

			<div class="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto pt-24 pb-12">
				
				<div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr_1fr] gap-16 lg:gap-24 mb-20">
					
					{/* ── Column 1: Brand & Intel ── */}
					<div>
						<Reveal animation="fadeUp">
							<div class="flex items-center gap-4 mb-8">
								<div class="h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
									<span class="material-symbols-outlined text-white text-2xl">radar</span>
								</div>
								<div>
									<h2 class="font-h3 text-xl font-black uppercase tracking-tighter leading-none">
										GMT+3 <span class="text-primary-container">MADAGASCAR</span>
									</h2>
									<p class="font-mono text-[10px] text-primary font-bold tracking-widest mt-1">FIANARANTSOA, MG</p>
								</div>
							</div>
							<p class="font-body-md text-white/40 max-w-sm leading-relaxed mb-10 italic">
								"L'exploration n'est pas une destination, c'est un état d'esprit. Nous cartographions l'invisible au cœur de la Grande Île."
							</p>
							
							<div class="space-y-4">
								<p class="font-mono text-[10px] text-white/20 uppercase tracking-widest border-b border-white/5 pb-2">GMT+3 en quelques mots</p>
								<div class="flex items-center justify-between">
									<span class="text-[10px] text-white/50 uppercase tracking-tighter">Expedition Success</span>
									<span class="font-mono text-xs text-primary font-bold">100%</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-[10px] text-white/50 uppercase tracking-tighter">Field Personnel</span>
									<span class="font-mono text-xs text-white">06 GUIDES</span>
								</div>
							</div>
						</Reveal>
					</div>

					{/* ── Column 2: Navigation Hub ── */}
					<div class="grid grid-cols-2 gap-8">
						<Reveal animation="fadeUp" delay={100}>
							<div>
								<h4 class="font-mono text-[10px] text-primary mb-8 uppercase tracking-[0.4em] font-black">Links</h4>
								<ul class="space-y-4">
									{navLinks.map(({ label, href }) => (
										<li key={label}>
											<a href={href} class="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-2 group py-2 min-h-[44px]">
												<span class="h-1 w-1 bg-white/10 group-hover:bg-primary rounded-full transition-colors" />
												{label.toUpperCase()}
											</a>
										</li>
									))}
								</ul>
							</div>
						</Reveal>
						<Reveal animation="fadeUp" delay={150}>
							<div>
							<h4 class="font-mono text-[10px] text-primary mb-8 uppercase tracking-[0.4em] font-black">Infos pratiques</h4>
								<ul class="space-y-4">
									{infoLinks.map(({ label, href }) => (
										<li key={label}>
											<a href={href} class="text-xs text-white/40 hover:text-primary transition-colors flex items-center gap-2 group py-2 min-h-[44px]">
												<span class="h-1 w-1 bg-white/10 group-hover:bg-primary rounded-full transition-colors" />
												{label.toUpperCase()}
											</a>
										</li>
									))}
								</ul>
							</div>
						</Reveal>
					</div>

					{/* ── Column 3: Secure Dispatch ── */}
					<div>
						<Reveal animation="fadeUp" delay={200}>
							<div class="bg-white/[0.03] border border-white/5 rounded-2xl p-8 backdrop-blur-md relative overflow-hidden group">
								<div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
									<span class="material-symbols-outlined text-6xl text-white">mail</span>
								</div>
								
								<h4 class="font-h3 text-lg font-bold text-white mb-2 uppercase tracking-tight">Mission Briefings</h4>
								<p class="text-xs text-white/40 leading-relaxed mb-6">Des questions sur une expédition ? Contactez-nous directement, réponse sous 24 h.</p>
								
								<div class="space-y-3">
									<a
										href="https://wa.me/261340312401?text=Bonjour%20GMT3%2C%20je%20souhaite%20des%20informations%20sur%20vos%20exp%C3%A9ditions."
										target="_blank"
										rel="noopener noreferrer"
										class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-button text-[10px] tracking-[0.2em] font-black transition-all hover:shadow-2xl hover:shadow-primary/20 active:scale-95"
									>
										<span class="material-symbols-outlined text-base">chat</span>
										PARLER SUR WHATSAPP
									</a>
									<a
										href="mailto:hanitra@great-madagascar-tours.com"
										class="w-full flex items-center justify-center gap-2 border border-white/15 hover:border-white/40 text-white/70 hover:text-white py-3 rounded-xl font-button text-[10px] tracking-[0.2em] font-black transition-all active:scale-95"
									>
										<span class="material-symbols-outlined text-base">mail</span>
										NOUS ÉCRIRE
									</a>
								</div>
							</div>
						</Reveal>
					</div>
				</div>

				{/* Liens légaux et crédits */}
				<div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
					<div class="flex flex-col md:items-start gap-1">
						<p class="font-mono text-[10px] text-white/20 uppercase tracking-widest">
							&copy; {currentYear} GMT+3 MADAGASCAR / CONÇU PAR <a href="https://www.facebook.com/hajarison.raphael" target="_blank" class="text-white/40 hover:text-primary transition-colors">DEMONDRA</a>
						</p>
					</div>

					<div class="flex items-center gap-6">
						{socialLinks.map(({ label, href, viewBox, path }) => (
							<a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} class="flex h-11 w-11 items-center justify-center text-white/20 hover:text-primary transition-all duration-300 hover:scale-110">
								<svg class="w-4 h-4 fill-current" viewBox={viewBox} aria-hidden="true"><path d={path} /></svg>
							</a>
						))}
						<div class="h-8 w-px bg-white/5 hidden md:block" />
						</div>
				</div>
			</div>
		</footer>
	);
}
