import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';

export function HeroSection() {
	return (
		<section class="relative h-screen min-h-[700px] w-full flex items-center bg-on-secondary-fixed overflow-hidden select-none">
			{/* Cinematic Background with Zoom Effect */}
			<div
				class="absolute inset-0 z-0 bg-cover bg-center animate-pulse-slow scale-110"
				style={`background-image: url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuBQ8Mzkat96InbZDhxRTEWfRMO3DJyZVyx381Ow-oHU8qsc2GnopwLV5-DXndDK-CiwuyKpr2B5kdmV5m0c1pd6Pt-kjj9xbF-zs2Z1JS2mLDf-la8VursBii-QmJ0uo3Bybk36GrrgllyyghH82ElUsQBa5HuY7tJfWn1HCE-8fWWte5mH9ZlP7hMFmzq3VrSJfHwlks4ZWpdNOZlYEIJoOD2FPpjsfQaum8uYDGxm2TJjVg0nZIrvt82dxbglZ1fN6LoQ-KL9mwo')} `}
			/>
			
			{/* Multi-layered Overlays */}
			<div class="absolute inset-0 z-10 bg-gradient-to-r from-on-secondary-fixed via-on-secondary-fixed/60 to-transparent" />
			<div class="absolute inset-0 z-10 bg-gradient-to-t from-on-secondary-fixed via-transparent to-on-secondary-fixed/30" />
			
			{/* Decorative Grids & Lines */}
			<div class="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" 
				style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 40px 40px;" />
			
			<div class="relative z-20 w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
				<div class="max-w-4xl">
					<Reveal animation="fadeUp" duration={800}>
						<div class="flex items-center gap-4 mb-8">
							<div class="h-px w-12 bg-primary-container" />
							<span class="font-label-caps text-[11px] tracking-[0.3em] text-primary-container font-bold uppercase">
								Discovery Log: Mada 2026
							</span>
						</div>
					</Reveal>

					<Reveal animation="arc" delay={100} duration={1000}>
						<h1 class="font-h1 text-h1 md:text-[clamp(3.5rem,7vw,7rem)] mb-8 text-on-primary font-black leading-[0.9] tracking-tighter uppercase italic overflow-visible">
							Explorez <br />
							<span class="relative inline-block pr-12">
								<span class="text-gradient">L'Île Rouge</span>
								<div class="absolute -right-16 -top-4 hidden lg:block">
									<div class="h-16 w-16 rotate-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center">
										<span class="material-symbols-outlined text-primary-container text-2xl animate-spin-slow">explore</span>
									</div>
								</div>
							</span>
						</h1>
					</Reveal>

					<Reveal animation="fadeUp" delay={250} duration={800}>
						<p class="font-body-lg text-lg md:text-2xl mb-12 text-white/70 max-w-2xl leading-relaxed border-l-2 border-primary/20 pl-6">
							Oubliez les sentiers battus. Plongez dans une aventure brute au cœur de la Grande Île, guidée par ceux qui l'appellent "maison".
						</p>
					</Reveal>

					<Reveal animation="driftRight" delay={400} duration={900}>
						<div class="flex flex-wrap items-center gap-6">
							<a
								href="#expeditions"
								class="relative h-16 px-10 flex items-center justify-center bg-primary-container text-white font-button text-sm tracking-widest rounded-full group overflow-hidden shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0"
							>
								<span class="relative z-10 flex items-center gap-3">
									LANCER L'EXPÉDITION
									<span class="material-symbols-outlined group-hover:translate-x-1.5 transition-transform duration-300">double_arrow</span>
								</span>
								<div class="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
							</a>
							
							<div class="flex items-center gap-3 text-white/50 group cursor-pointer hover:text-white transition-colors">
								<div class="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
									<span class="material-symbols-outlined text-sm">play_arrow</span>
								</div>
								<span class="font-label-caps text-[10px] tracking-widest font-bold">VOIR LE TRAILER</span>
							</div>
						</div>
					</Reveal>
				</div>
			</div>

			{/* Vertical Coordinates Decoration */}
			<div class="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-12 z-20">
				<div class="h-24 w-px bg-gradient-to-t from-white/30 to-transparent" />
				<p class="vertical-text font-label-caps text-[9px] tracking-[0.5em] text-white/20 whitespace-nowrap">
					S 18.7669° / E 46.8691° — ANTANANARIVO
				</p>
				<div class="h-24 w-px bg-gradient-to-b from-white/30 to-transparent" />
			</div>

			<div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer flex flex-col items-center gap-2">
				<span class="text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">Scroll Down</span>
				<span class="material-symbols-outlined text-primary text-2xl">expand_more</span>
			</div>
			
			<style>{`
				.animate-spin-slow { animation: spin 20s linear infinite; }
				@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
				.animate-pulse-slow { animation: pulse-zoom 15s ease-in-out infinite; }
				@keyframes pulse-zoom { 
					0%, 100% { transform: scale(1.1); } 
					50% { transform: scale(1.2); } 
				}
				.vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); }
			`}</style>
		</section>
	);
}
