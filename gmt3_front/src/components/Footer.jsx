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
		href: 'https://www.facebook.com/hajarison.raphael',
		viewBox: '0 0 24 24',
		path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
	},
	{
		label: 'Email',
		href: '#contact',
		viewBox: '0 0 24 24',
		path: 'M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z',
	},
];

const navLinks = [
	{ label: 'Expéditions', href: '#expeditions' },
	{ label: 'Destinations', href: '#destinations' },
	{ label: 'Guides', href: '#guides' },
	{ label: 'Offres', href: '/events' },
	{ label: 'Galerie', href: '#gallery' },
];

const infoLinks = [
	{ label: 'Contact', href: '#contact' },
	{ label: 'Sécurité', href: '#' },
	{ label: 'Conditions', href: '#' },
	{ label: 'Confidentialité', href: '#' },
	{ label: 'Partenaires', href: '#' },
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer class="relative bg-on-secondary-fixed overflow-hidden">
			{/* Decorative ambient orbs (Aurora UI effect) */}
			<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
				<div class="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[80px]" />
				<div class="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-primary-container/4 blur-[80px]" />
			</div>

			{/* Top accent line (Aurora UI gradient border) */}
			<div aria-hidden="true" class="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

			<div class="relative z-10 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
				{/* ── Brand + Social ── */}
				<Reveal animation="fadeUp" duration={650}>
					<div class="pt-20 md:pt-24">
						<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
							<div>
								<div class="flex items-center gap-4 mb-5">
									<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg shadow-primary/25">
										<span class="text-on-primary font-h3 text-h3 font-extrabold leading-none">G</span>
									</div>
									<span class="font-h3 text-h3 md:text-h2 md:font-bold font-extrabold text-primary uppercase tracking-tight">
										GMT+3 Madagascar
									</span>
								</div>
								<p class="font-body-md text-body-md text-on-primary/45 max-w-md leading-relaxed">
									Spécialistes de l'aventure et de l'exploration à Madagascar.
									Nous créons des expériences brutes et inoubliables.
								</p>
							</div>
							<div class="flex gap-4">
								{socialLinks.map(({ label, href, viewBox, path }) => (
									<a
										key={label}
										href={href}
										aria-label={label}
										target={href.startsWith('http') ? '_blank' : undefined}
										rel={href.startsWith('http') ? 'noreferrer' : undefined}
										class="group w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/[0.08] hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
									>
										<svg
											class="w-5 h-5 text-on-primary/35 group-hover:text-on-primary transition-colors duration-300"
											viewBox={viewBox}
											fill="currentColor"
										>
											<path d={path} />
										</svg>
									</a>
								))}
							</div>
						</div>
					</div>
				</Reveal>

				{/* ── Divider ── */}
				<Reveal animation="fadeUp" delay={100} duration={650}>
					<div aria-hidden="true" class="my-14 md:my-16 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
				</Reveal>

				{/* ── Links Grid ── */}
				<div class="grid grid-cols-1 md:grid-cols-3 gap-y-14 md:gap-x-16">
					{/* Navigation */}
					<Reveal animation="fadeUp" delay={120} duration={650}>
						<div>
							<h4 class="font-label-caps text-label-caps text-primary mb-8 uppercase tracking-widest font-extrabold">
								Navigation
							</h4>
							<ul class="space-y-5">
								{navLinks.map(({ label, href }) => (
									<li key={label}>
										<a
											href={href}
											class="group inline-flex items-center gap-3 font-body-md text-body-md text-on-primary/45 font-medium hover:text-primary transition-colors duration-300"
										>
											<span aria-hidden="true" class="w-0 group-hover:w-5 h-px bg-primary transition-all duration-300 ease-out" />
											{label}
										</a>
									</li>
								))}
							</ul>
						</div>
					</Reveal>

					{/* Informations */}
					<Reveal animation="fadeUp" delay={160} duration={650}>
						<div>
							<h4 class="font-label-caps text-label-caps text-primary mb-8 uppercase tracking-widest font-extrabold">
								Informations
							</h4>
							<ul class="space-y-5">
								{infoLinks.map(({ label, href }) => (
									<li key={label}>
										<a
											href={href}
											class="group inline-flex items-center gap-3 font-body-md text-body-md text-on-primary/45 font-medium hover:text-primary transition-colors duration-300"
										>
											<span aria-hidden="true" class="w-0 group-hover:w-5 h-px bg-primary transition-all duration-300 ease-out" />
											{label}
										</a>
									</li>
								))}
							</ul>
						</div>
					</Reveal>

					{/* Newsletter + Contact */}
					<Reveal animation="fadeUp" delay={200} duration={650}>
						<div class="space-y-8">
							{/* Newsletter */}
							<div class="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
								<h4 class="font-label-caps text-label-caps text-primary mb-2 uppercase tracking-widest font-extrabold">
									Restez informé
								</h4>
								<p class="font-body-md text-body-md text-on-primary/45 leading-relaxed mb-5">
									Recevez nos dernières expéditions et offres exclusives.
								</p>
								<form
									onSubmit={(e) => e.preventDefault()}
									class="flex flex-col gap-3"
								>
									<input
										type="email"
										placeholder="votre@email.com"
										class="w-full px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-on-primary font-body-md text-body-md placeholder:text-on-primary/20 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
									/>
									<button
										type="submit"
										class="w-full px-5 py-3.5 rounded-xl bg-primary text-on-primary font-button text-button font-bold hover:bg-primary-container hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/20"
									>
										S'abonner
									</button>
								</form>
							</div>

							{/* Quick contact */}
							<div class="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
								<p class="font-label-caps text-label-caps text-primary mb-2">Une question ?</p>
								<a
									href="mailto:contact@gmt3.mg"
									class="font-body-md text-body-md text-on-primary/45 hover:text-primary transition-colors"
								>
									contact@gmt3.mg
								</a>
							</div>
						</div>
					</Reveal>
				</div>

				{/* ── Bottom Bar ── */}
				<Reveal animation="fadeUp" delay={240} duration={650}>
					<div class="mt-16 md:mt-20 pt-7 pb-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-5">
						<p class="font-label-caps text-label-caps text-on-primary/25 text-center md:text-left">
							&copy; {currentYear}{' '}
							<a
								class="text-on-primary/40 hover:text-primary transition-colors"
								href="https://www.facebook.com/hajarison.raphael"
								target="_blank"
								rel="noreferrer"
							>
								DEMONDRA
							</a>
							. Tous droits réservés.
						</p>
						<div class="flex items-center gap-6">
							<a class="font-label-caps text-label-caps text-on-primary/25 hover:text-primary transition-colors" href="#">
								Mentions légales
							</a>
							<span aria-hidden="true" class="text-white/[0.06]">|</span>
							<p class="font-label-caps text-label-caps text-on-primary/15 text-center">
								Conçu avec passion pour Madagascar
							</p>
						</div>
					</div>
				</Reveal>
			</div>
		</footer>
	);
}