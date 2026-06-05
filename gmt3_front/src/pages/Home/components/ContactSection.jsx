import { Reveal } from '../../../components/ui/Reveal.jsx';

export function ContactSection() {
	return (
		<section id="contact" class="relative bg-primary py-20 overflow-hidden">
			{/* Progressive Transition from Previous Red Section */}
			<div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-container to-transparent pointer-events-none z-10" />
			
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
				<div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-start py-3">
					<span class="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase">Communication Bridge: Open</span>
					<span class="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase">Auth: VERIFIED</span>
				</div>
			</div>

			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08),_transparent_50%)]" />
			<div class="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
				<Reveal animation="fadeUp" duration={700}>
					<div class="text-center mb-16">
						<span class="inline-block bg-white/15 text-on-primary backdrop-blur-sm px-5 py-2 font-label-caps text-label-caps mb-5 uppercase rounded-xl border border-white/10">
							CONTACT
						</span>
						<h2 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 text-on-primary mb-4 font-black uppercase tracking-tighter">
							PRET POUR L'AVENTURE?
						</h2>
						<p class="font-body-lg text-body-lg text-on-primary/80 max-w-2xl mx-auto leading-relaxed">
							Contactez-nous pour planifier votre voyage sur mesure ou pour toute question sur nos circuits
						</p>
					</div>
				</Reveal>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
					<Reveal animation="fadeUp" delay={70} duration={700}>
						<div class="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group cursor-pointer">
							<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:scale-110 transition-all duration-300">
								<span class="material-symbols-outlined text-3xl text-on-primary">location_on</span>
							</div>
							<h3 class="font-h3 text-h3 text-on-primary mb-2 font-bold">Adresse</h3>
							<p class="font-body-md text-body-md text-on-primary/70">Antananarivo, Madagascar</p>
						</div>
					</Reveal>
					<Reveal animation="fadeUp" delay={140} duration={700}>
						<div class="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group cursor-pointer">
							<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:scale-110 transition-all duration-300">
								<span class="material-symbols-outlined text-3xl text-on-primary">phone</span>
							</div>
							<h3 class="font-h3 text-h3 text-on-primary mb-2 font-bold">Telephone</h3>
							<p class="font-body-md text-body-md text-on-primary/70">+261 34 00 000 00</p>
						</div>
					</Reveal>
					<Reveal animation="fadeUp" delay={210} duration={700}>
						<div class="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 group cursor-pointer">
							<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:scale-110 transition-all duration-300">
								<span class="material-symbols-outlined text-3xl text-on-primary">email</span>
							</div>
							<h3 class="font-h3 text-h3 text-on-primary mb-2 font-bold">Email</h3>
						<p class="font-body-md text-body-md text-on-primary/70">contact@lemuradventures.mg</p>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}