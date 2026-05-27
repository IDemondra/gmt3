export function BannerSection() {
	return (
		<section class="relative bg-primary-container text-on-primary w-full overflow-hidden">
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_60%)]" />
			<div class="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
				<div class="max-w-3xl">
					<h2 class="font-h1-mobile text-h1-mobile md:font-h2 md:text-h2 font-black uppercase mb-5 tracking-tighter">VOYAGE SUR MESURE</h2>
					<p class="font-body-lg text-body-lg text-on-primary/85 leading-relaxed">Organisez votre aventure personnalisee. Laissez nos experts concevoir un itineraire qui correspond exactement a votre soif de decouverte.</p>
				</div>
				<a
					href="#contact"
					class="shrink-0 font-button text-button bg-on-primary text-primary px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-black/20 transition-all duration-300 uppercase w-full md:w-auto text-center font-bold hover:scale-[1.03] active:scale-95"
				>
					NOUS CONTACTER
				</a>
			</div>
		</section>
	);
}