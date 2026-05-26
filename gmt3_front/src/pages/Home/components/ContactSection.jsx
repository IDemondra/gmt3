export function ContactSection() {
	return (
		<section id="contact" class="bg-primary py-16">
			<div class="w-full max-w-7xl mx-auto px-4 md:px-8">
				<div class="text-center mb-12">
					<span class="inline-block bg-on-primary text-primary px-4 py-2 font-label-caps text-label-caps mb-4 uppercase rounded-lg">
						CONTACT
					</span>
					<h2 class="font-h1-mobile text-3xl md:font-h1 md:text-5xl text-on-primary mb-4">
						PRÊT POUR L'AVENTURE?
					</h2>
					<p class="font-body-lg text-lg text-on-primary/90 max-w-2xl mx-auto">
						Contactez-nous pour planifier votre voyage sur mesure ou pour toute
						question sur nos circuits
					</p>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					<div class="bg-on-primary/10 rounded-lg p-8">
						<span class="material-symbols-outlined text-5xl text-on-primary mb-4">
							location_on
						</span>
						<h3 class="font-h3 text-xl text-on-primary mb-2">Adresse</h3>
						<p class="font-body-md text-on-primary/80">
							Antananarivo, Madagascar
						</p>
					</div>
					<div class="bg-on-primary/10 rounded-lg p-8">
						<span class="material-symbols-outlined text-5xl text-on-primary mb-4">
							phone
						</span>
						<h3 class="font-h3 text-xl text-on-primary mb-2">Téléphone</h3>
						<p class="font-body-md text-on-primary/80">
							+261 34 00 000 00
						</p>
					</div>
					<div class="bg-on-primary/10 rounded-lg p-8">
						<span class="material-symbols-outlined text-5xl text-on-primary mb-4">
							email
						</span>
						<h3 class="font-h3 text-xl text-on-primary mb-2">Email</h3>
						<p class="font-body-md text-on-primary/80">
							contact@lemuradventures.mg
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}