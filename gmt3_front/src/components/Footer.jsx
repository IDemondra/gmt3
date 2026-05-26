export function Footer() {
	return (
		<footer class="bg-on-secondary-fixed border-t-4 border-primary">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-section-gap w-full max-w-container-max mx-auto">
				<div class="col-span-1 md:col-span-2">
					<span class="font-h3 text-h3 font-extrabold text-primary uppercase block mb-4">LEMUR ADVENTURES</span>
					<p class="font-body-md text-body-md text-on-primary/60 max-w-sm mb-6">
						Spécialistes de l'aventure et de l'exploration à Madagascar. Nous créons des expériences brutes et inoubliables.
					</p>
					<div class="flex gap-4">
						<a class="text-primary hover:text-on-primary-fixed-variant transition-colors" href="#"><span class="material-symbols-outlined">camera_alt</span></a>
						<a class="text-primary hover:text-on-primary-fixed-variant transition-colors" href="#"><span class="material-symbols-outlined">mail</span></a>
						<a class="text-primary hover:text-on-primary-fixed-variant transition-colors" href="#"><span class="material-symbols-outlined">public</span></a>
					</div>
				</div>
				<div>
					<h4 class="font-label-caps text-label-caps text-on-primary mb-6">NAVIGATION</h4>
					<ul class="space-y-4">
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#expeditions">EXPEDITIONS</a></li>
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#destinations">DESTINATIONS</a></li>
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#guides">GUIDES</a></li>
					</ul>
				</div>
				<div>
					<h4 class="font-label-caps text-label-caps text-on-primary mb-6">INFORMATIONS</h4>
					<ul class="space-y-4">
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#">CONTACT</a></li>
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#">SAFETY</a></li>
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#">TERMS</a></li>
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#">PRIVACY</a></li>
						<li><a class="font-body-md text-body-md text-primary/90 font-medium hover:text-on-primary-fixed-variant transition-colors uppercase" href="#">PARTNERS</a></li>
					</ul>
				</div>
			</div>
			<div class="border-t-2 border-on-secondary-fixed-variant w-full">
				<div class="px-margin-mobile md:px-margin-desktop py-6 max-w-container-max mx-auto">
					<p class="font-label-caps text-label-caps text-on-primary/40 text-center">
						© 2024 LEMUR ADVENTURES MADAGASCAR. ALL RIGHTS RESERVED.
					</p>
				</div>
			</div>
		</footer>
	);
}