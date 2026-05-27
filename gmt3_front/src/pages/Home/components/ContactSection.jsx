export function ContactSection() {
	return (
		<section id="contact" class="relative bg-primary py-20 overflow-hidden">
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.08),_transparent_50%)]" />
			<div class="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
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
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
					<div class="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1">
						<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:scale-110 transition-all duration-300">
							<span class="material-symbols-outlined text-3xl text-on-primary">location_on</span>
						</div>
						<h3 class="font-h3 text-h3 text-on-primary mb-2 font-bold">Adresse</h3>
						<p class="font-body-md text-body-md text-on-primary/70">Antananarivo, Madagascar</p>
					</div>
					<div class="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1">
						<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:scale-110 transition-all duration-300">
							<span class="material-symbols-outlined text-3xl text-on-primary">phone</span>
						</div>
						<h3 class="font-h3 text-h3 text-on-primary mb-2 font-bold">Telephone</h3>
						<p class="font-body-md text-body-md text-on-primary/70">+261 34 00 000 00</p>
					</div>
					<div class="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:-translate-y-1">
						<div class="w-14 h-14 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:bg-primary-container group-hover:scale-110 transition-all duration-300">
							<span class="material-symbols-outlined text-3xl text-on-primary">email</span>
						</div>
						<h3 class="font-h3 text-h3 text-on-primary mb-2 font-bold">Email</h3>
						<p class="font-body-md text-body-md text-on-primary/70">contact@lemuradventures.mg</p>
					</div>
				</div>
			</div>
		</section>
	);
}