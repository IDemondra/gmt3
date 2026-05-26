export function BannerSection() {
	return (
		<section class="bg-primary-container text-on-primary w-full border-y-4 border-on-secondary-fixed">
			<div class="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-8">
				<div class="max-w-3xl">
					<h2 class="font-h1-mobile text-h1-mobile md:font-h2 md:text-h2 font-black uppercase mb-4 tracking-tighter">VOYAGE SUR MESURE</h2>
					<p class="font-body-lg text-body-lg text-on-primary/90">Organisez votre aventure personnalisée. Laissez nos experts concevoir un itinéraire qui correspond exactement à votre soif de découverte.</p>
				</div>
				<button class="shrink-0 font-button text-button bg-on-secondary-fixed text-on-primary px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300 uppercase w-full md:w-auto text-center">
					NOUS CONTACTER
				</button>
			</div>
		</section>
	);
}