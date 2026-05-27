import { img } from '../../../utils/images.js';

export function HeroSection() {
	return (
		<section class="relative h-[90vh] min-h-[650px] w-full flex items-center bg-inverse-surface overflow-hidden">
			<div
				class="absolute inset-0 z-0 bg-cover bg-center scale-105"
				style={`background-image: url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuBQ8Mzkat96InbZDhxRTEWfRMO3DJyZVyx381Ow-oHU8qsc2GnopwLV5-DXndDK-CiwuyKpr2B5kdmV5m0c1pd6Pt-kjj9xbF-zs2Z1JS2mLDf-la8VursBii-QmJ0uo3Bybk36GrrgllyyghH82ElUsQBa5HuY7tJfWn1HCE-8fWWte5mH9ZlP7hMFmzq3VrSJfHwlks4ZWpdNOZlYEIJoOD2FPpjsfQaum8uYDGxm2TJjVg0nZIrvt82dxbglZ1fN6LoQ-KL9mwo')} `}
			/>
			<div class="absolute inset-0 z-10 bg-gradient-to-r from-primary/80 via-primary/40 to-inverse-surface/50" />
			<div class="absolute inset-0 z-10 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent" />
			<div class="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
				<div class="max-w-2xl">
					<div class="animate-[fadeInUp_0.6s_ease-out]">
						<span class="inline-block bg-primary-container text-on-primary px-4 py-2 font-label-caps text-label-caps mb-6 uppercase rounded-lg shadow-lg shadow-primary/30">
							MADAGASCAR 2024
						</span>
					</div>
					<h1 class="animate-[fadeInUp_0.6s_ease-out_0.1s_both] font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 mb-6 text-on-primary font-black leading-[1.05] tracking-tighter">
						EXPLOREZ<br />
						<span class="text-gradient inline-block">L'ÎLE ROUGE</span>
					</h1>
					<p class="animate-[fadeInUp_0.6s_ease-out_0.2s_both] font-body-lg text-body-lg mb-10 text-on-primary/85 max-w-xl leading-relaxed">
						Découvrez les paysages sauvages, la faune unique et la culture vibrante de Madagascar avec nos guides experts. L'aventure d'une vie vous attend.
					</p>
					<div class="animate-[fadeInUp_0.6s_ease-out_0.3s_both] flex flex-col sm:flex-row items-start gap-4">
						<a
							href="#expeditions"
							class="font-button text-button bg-primary-container text-on-primary px-8 py-4 rounded-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2 group hover:scale-105 active:scale-95"
						>
							VOIR NOS EXPÉDITIONS
							<span class="material-symbols-outlined group-hover:translate-x-1.5 transition-transform duration-200">arrow_forward</span>
						</a>
						<a
							href="#destinations"
							class="font-button text-button border-2 border-white/30 text-on-primary px-8 py-4 rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center gap-2 group"
						>
							DESTINATIONS
						</a>
					</div>
				</div>
			</div>
			<div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block animate-bounce">
				<span class="material-symbols-outlined text-on-primary/60 text-3xl">keyboard_arrow_down</span>
			</div>
		</section>
	);
}