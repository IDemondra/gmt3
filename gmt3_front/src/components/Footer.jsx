import { Reveal } from './ui/Reveal.jsx';

const socialLinks = [
	{
		label: 'Instagram',
		href: '#',
		viewBox: '0 0 24 24',
		path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
	},
	{
		label: 'Facebook',
		href: 'https://www.facebook.com/groups/1567275954180870',
		viewBox: '0 0 24 24',
		path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
	},
	{
		label: 'Email',
		href: '/#contact',
		viewBox: '0 0 24 24',
		path: 'M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z',
	},
];

const navLinks = [
	{ label: 'Expéditions', href: '/#expeditions' },
	{ label: 'Destinations', href: '/#destinations' },
	{ label: 'Guides', href: '/#equipes' },
	{ label: 'Offres', href: '/events' },
	{ label: 'Conseils', href: '/conseils' },
	{ label: 'Galerie', href: '/archives' },
];

const infoLinks = [
	{ label: 'Contact', href: '/#contact' },
	{ label: 'FAQ', href: '/faq' },
	{ label: 'Recherche', href: '/recherche' },
	{ label: 'Conditions', href: '#' },
	{ label: 'Confidentialité', href: '#' },
	{ label: 'Partenaires', href: '#' },
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer class="relative bg-[#1c1b1b] overflow-hidden text-white">
			{/* Technical Bridge from Previous Section (Contact or Banner) */}
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
									<p class="font-mono text-[9px] text-primary font-bold tracking-widest mt-1">FIANARANTSOA, MG</p>
								</div>
							</div>
							<p class="font-body-md text-white/40 max-w-sm leading-relaxed mb-10 italic">
								"L'exploration n'est pas une destination, c'est un état d'esprit. Nous cartographions l'invisible au cœur de la Grande Île."
							</p>
							
							<div class="space-y-4">
								<p class="font-mono text-[10px] text-white/20 uppercase tracking-widest border-b border-white/5 pb-2">Operational Metrics</p>
								<div class="flex items-center justify-between">
									<span class="text-[10px] text-white/50 uppercase tracking-tighter">Expedition Success</span>
									<span class="font-mono text-xs text-primary font-bold">99.8%</span>
								</div>
								<div class="flex items-center justify-between">
									<span class="text-[10px] text-white/50 uppercase tracking-tighter">Field Personnel</span>
									<span class="font-mono text-xs text-white">06 ACTIVE</span>
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
								<h4 class="font-mono text-[10px] text-primary mb-8 uppercase tracking-[0.4em] font-black">Intel</h4>
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
								<p class="text-xs text-white/40 leading-relaxed mb-6">Inscrivez-vous pour recevoir les rapports d'exploration et les créneaux d'expédition prioritaires.</p>
								
								<form onSubmit={(e) => e.preventDefault()} class="space-y-3">
									<div class="relative">
										<input
											type="email"
											placeholder="ENTER MISSION EMAIL"
											class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-mono tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-primary transition-colors uppercase"
										/>
									</div>
									<button class="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-button text-[10px] tracking-[0.2em] font-black transition-all hover:shadow-2xl hover:shadow-primary/20 active:scale-95">
										JOIN NETWORK
									</button>
								</form>
							</div>
						</Reveal>
					</div>
				</div>

				{/* ── Technical Footer Bar ── */}
				<div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
					<div class="flex flex-col md:items-start gap-1">
						<p class="font-mono text-[9px] text-white/20 uppercase tracking-widest">
							&copy; {currentYear} GMT+3 OPERATIONAL HQ / DESIGNED BY <a href="https://www.facebook.com/hajarison.raphael" target="_blank" class="text-white/40 hover:text-primary transition-colors">DEMONDRA</a>
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