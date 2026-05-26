import { img } from '../../../utils/images.js';

export function HeroSection() {
	return (
		<section class="relative h-[80vh] min-h-[600px] w-full flex items-center bg-inverse-surface overflow-hidden">
			<div
				class="absolute inset-0 z-0 bg-cover bg-center"
				style={`background-image: url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuBQ8Mzkat96InbZDhxRTEWfRMO3DJyZVyx381Ow-oHU8qsc2GnopwLV5-DXndDK-CiwuyKpr2B5kdmV5m0c1pd6Pt-kjj9xbF-zs2Z1JS2mLDf-la8VursBii-QmJ0uo3Bybk36GrrgllyyghH82ElUsQBa5HuY7tJfWn1HCE-8fWWte5mH9ZlP7hMFmzq3VrSJfHwlks4ZWpdNOZlYEIJoOD2FPpjsfQaum8uYDGxm2TJjVg0nZIrvt82dxbglZ1fN6LoQ-KL9mwo')} `}
			/>
			<div class="absolute inset-0 z-10 hero-overlay" />
			<div class="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
				<div class="max-w-2xl text-on-primary">
					<span class="inline-block bg-primary-container text-on-primary px-4 py-2 font-label-caps text-label-caps mb-6 uppercase rounded-lg">MADAGASCAR 2024</span>
					<h1 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 mb-6 text-on-primary font-black">EXPLOREZ L'ÎLE ROUGE</h1>
					<p class="font-body-lg text-body-lg mb-8 text-on-primary/90 max-w-xl">
						Découvrez les paysages sauvages, la faune unique et la culture vibrante de Madagascar avec nos guides experts. L'aventure d'une vie vous attend.
					</p>
					<button class="font-button text-button bg-primary-container text-on-primary px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 group">
						VOIR NOS EXPÉDITIONS
						<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
					</button>
				</div>
			</div>
		</section>
	);
}