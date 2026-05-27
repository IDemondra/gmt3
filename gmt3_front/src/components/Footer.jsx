export function Footer() {
	const currentYear = new Date().getFullYear();
	const copyrightYear = currentYear;

	return (
		<footer class="bg-on-secondary-fixed border-t-4 border-primary">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-20 w-full max-w-container-max mx-auto">
				<div class="col-span-1 md:col-span-2">
					<span class="font-h3 text-h3 font-extrabold text-primary uppercase block mb-5">GMT+3 MADAGASCAR</span>
					<p class="font-body-md text-body-md text-on-primary/60 max-w-sm mb-8 leading-relaxed">
						Specialistes de l'aventure et de l'exploration a Madagascar. Nous creons des experiences brutes et inoubliables.
					</p>
					<div class="flex gap-4">
						<a class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300" href="#" aria-label="Instagram">
							<span class="material-symbols-outlined">camera_alt</span>
						</a>
						<a class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300" href="#" aria-label="Email">
							<span class="material-symbols-outlined">mail</span>
						</a>
						<a class="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-300" href="https://www.facebook.com/hajarison.raphael" aria-label="Facebook" target="_blank" rel="noreferrer">
							<span class="material-symbols-outlined">public</span>
						</a>
					</div>
				</div>
				<div>
					<h4 class="font-label-caps text-label-caps text-primary mb-7 uppercase tracking-wider font-bold">NAVIGATION</h4>
					<ul class="space-y-4">
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#expeditions">EXPEDITIONS</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#destinations">DESTINATIONS</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#guides">GUIDES</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="/events">OFFERS</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#gallery">GALLERY</a></li>
					</ul>
				</div>
				<div>
					<h4 class="font-label-caps text-label-caps text-primary mb-7 uppercase tracking-wider font-bold">INFORMATIONS</h4>
					<ul class="space-y-4">
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#contact">CONTACT</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#">SAFETY</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#">TERMS</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#">PRIVACY</a></li>
						<li><a class="font-body-md text-body-md text-on-primary/70 font-medium hover:text-primary transition-colors" href="#">PARTNERS</a></li>
					</ul>
				</div>
			</div>
			<div class="border-t border-on-primary/10 w-full">
				<div class="px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
					<p class="font-label-caps text-label-caps text-on-primary/40 text-center md:text-left">
						&copy; {copyrightYear}{' '}
						<a
							class="text-on-primary/70 hover:text-primary transition-colors"
							href="https://www.facebook.com/hajarison.raphael"
							target="_blank"
							rel="noreferrer"
						>
							DEMONDRA
						</a>
						. ALL RIGHTS RESERVED.
					</p>
					<p class="font-label-caps text-label-caps text-on-primary/30 text-center">
						Concu avec passion pour Madagascar
					</p>
				</div>
			</div>
		</footer>
	);
}
