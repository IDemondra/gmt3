import { Reveal } from '../../../components/ui/Reveal.jsx';
import { trackEvent } from '../../../utils/analytics.js';

const contacts = [
	{
		icon: 'location_on',
		label: 'Adresse',
		value: 'Anolaka Fianarantsoa, Madagascar',
		sub: '21.4536° S, 47.0858° E',
		delay: 70,
	},
	{
		icon: 'phone',
		label: 'Téléphone',
		value: '+261 34 03 124 01',
		sub: 'Lun–Sam / 08h–18h',
		delay: 140,
	},
	{
		icon: 'email',
		label: 'Email',
		value: 'hanitra@great-madagascar-tours.com',
		sub: 'Réponse sous 24h',
		delay: 210,
	},
];

export function ContactSection() {
	return (
		<section id="contact" class="relative bg-primary py-24 overflow-hidden" style="content-visibility:auto; contain-intrinsic-size:auto 500px">
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
			</div>

			{/* Dot grid */}
			<div class="absolute inset-0 opacity-[0.06] pointer-events-none"
				style="background-image: radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px); background-size: 28px 28px;" />

			{/* Ambient glows */}
			<div class="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-[80px] pointer-events-none" />
			<div class="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-black/10 blur-[100px] pointer-events-none" />

			{/* Bottom scan line */}
			<div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

			<div class="relative z-10 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
				<Reveal animation="fadeUp" duration={700}>
					<div class="text-center mb-16">
						<h2 class="font-h2 text-h2 md:text-6xl text-white font-black uppercase tracking-tighter leading-none mb-6">
							Prêt à <span class="text-white/50">partir ?</span>
						</h2>
						<p class="font-body-lg text-white/70 max-w-xl mx-auto leading-relaxed">
							Parlez-nous de vos envies. Nous vous répondrons directement pour imaginer un voyage qui vous ressemble.
						</p>
					</div>
				</Reveal>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
					{contacts.map((c) => (
						<Reveal key={c.label} animation="fadeUp" delay={c.delay} duration={700}>
							<div class="group relative backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 cursor-pointer text-center overflow-hidden">
								{/* Corner accents */}
								<div class="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 group-hover:border-white/30 transition-colors duration-300" />
								<div class="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/10 group-hover:border-white/30 transition-colors duration-300" />

								{/* Glow on hover */}
								<div class="absolute inset-0 bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

								<div class="relative z-10">
									<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-white/20 group-hover:scale-110 group-hover:border-white/25 transition-all duration-300">
										<span class="material-symbols-outlined text-2xl text-white">{c.icon}</span>
									</div>
									<span class="font-mono text-[10px] text-white/30 tracking-[0.3em] uppercase font-bold block mb-2">{c.label}</span>
									<p class="font-body-md text-white font-semibold mb-1">{c.value}</p>
									<p class="font-mono text-[10px] text-white/30 tracking-widest uppercase">{c.sub}</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>

				{/* CTA row */}
				<Reveal animation="fadeUp" delay={350} duration={700}>
					<div class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
						<a
							href="mailto:hanitra@great-madagascar-tours.com"
							onClick={() => trackEvent('cta_contact', { location: 'contact_email' })}
							class="group inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-button text-xs tracking-widest font-black uppercase transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:scale-105 active:scale-95 cursor-pointer"
						>
							PRÉPARER MON VOYAGE
							<span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">north_east</span>
						</a>
						<a
							href="tel:+261340312401"
							onClick={() => trackEvent('phone_click', { location: 'contact' })}
							class="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-8 py-4 rounded-full font-button text-[10px] tracking-widest font-bold uppercase transition-all duration-300 cursor-pointer"
						>
							<span class="material-symbols-outlined text-sm">phone</span>
							APPELER
						</a>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
