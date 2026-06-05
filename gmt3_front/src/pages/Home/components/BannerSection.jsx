import { Reveal } from '../../../components/ui/Reveal.jsx';

export function BannerSection() {
	return (
		<section class="relative bg-primary-container text-on-primary w-full overflow-hidden">
			{/* Progressive Transition from Dark Section */}
			<div class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-on-secondary-fixed to-transparent pointer-events-none z-10" />
			
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
				<div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-start py-3">
					<span class="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase">Emergency Uplink: Ready</span>
					<span class="font-mono text-[8px] text-white/30 tracking-[0.2em] uppercase">Signal: STRONG</span>
				</div>
			</div>

			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),_transparent_60%)]" />
			<div class="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">
				<Reveal animation="fadeLeft" duration={650}>
					<div class="max-w-3xl">
						<h2 class="font-h1-mobile text-h1-mobile md:font-h2 md:text-h2 font-black uppercase mb-5 tracking-tighter">VOYAGE SUR MESURE</h2>
						<p class="font-body-lg text-body-lg text-on-primary/85 leading-relaxed">Organisez votre aventure personnalisee. Laissez nos experts concevoir un itineraire qui correspond exactement a votre soif de decouverte.</p>
					</div>
				</Reveal>
				<Reveal animation="driftRight" delay={100} duration={650}>
					<a
						href="#contact"
						class="shrink-0 font-button text-button bg-on-primary text-primary px-6 sm:px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-black/20 hover:brightness-95 transition-all duration-300 uppercase w-full sm:w-auto text-center font-bold whitespace-nowrap cursor-pointer"
					>
						NOUS CONTACTER
					</a>
				</Reveal>
			</div>
		</section>
	);
}