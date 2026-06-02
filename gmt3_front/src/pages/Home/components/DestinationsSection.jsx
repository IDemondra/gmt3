import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';

export function DestinationsSection() {
	const bg1 = `url('${img('https://lh3.googleusercontent.com/aida/ADBb0ujjtH4hJs61CX1AyTwzD2rH2ADHkzwJk3H_8Zx9RMGT_Avp18hft53dYVYfjQzVnliiJYH5iz8DWvApZxJDl7CXA9RMJk-mOqmXea0ee7XTlWkJkeXYWmKhR2oaAwq0ZbLUgaSL8eglt0_yxfxf-B9vYyWizv4iE88_jCCC359qwOxgU86AVzp_qUWpV4-XHilZQQVTAw4lubmvfIeonA5irD_pOzPu4we8pL0e7wX9OdKcEcIXgKh1cVg')}')`;
	const bg2 = `url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuCHAzLv4UXF0svy3arGo10ftdnYfLums3ksC4WE7JYk2zFZybeTxudGnAtaljoSUaeo4O1gCndNZE4OCyTUWUG1i229gpkMtYSUhEamgwLkIT9dNCGtCrNVGDq50JEUAlRuOO1V8OiQWQ50xTMFhs-C7kVwOrk4KHDNnKgpiH1jJzLwXHdxcYwNE--zQQz891UPb2dPgQHRCg7FXHY6cBw94g_qP0p1DbPiEY3EU3VA-G3ESiWfc6A_Dhx9cb0Ew6-UbnkvRrMwCjc')}')`;
	const bg3 = `url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuAcpLVLyVXKwhfrB3ptkpBv8UMN3Zd4okkh9YxHJ_zjPVuA2TAEGCErLDBy01Nax5opgkRzeNevm2Ev_53b14ZDvN1n3faD3-f_qAxt_ufVVDQiRfTiKV8yXKb58Un2xGqgNY70QCkd1GlsbeVTOtafFggRSzEHMNh3h82lOSffPDUNEyRQaLM2pTPK0lqlG5eaOEdS_QWAJ-bR7nldilwTvYyOA6UblYWEWqRBqXxkmbOki6RKfHkyXb7y6WIvGAyX0CccWOr5fIU')}')`;

	return (
		<section class="relative overflow-hidden bg-surface-variant py-section-gap" id="destinations">
			<div class="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
			<div class="absolute bottom-[-5rem] left-[-4rem] h-80 w-80 rounded-full bg-white/50 blur-2xl pointer-events-none" />
			<div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
			<Reveal animation="fadeUp">
				<div class="text-center mb-12">
					<span class="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white/70 px-4 py-2 font-label-caps text-label-caps text-on-background/70 backdrop-blur-sm">
						<span class="h-2 w-2 rounded-full bg-primary-container" />
						NOS RÉGIONS
					</span>
					<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.5rem)] text-on-background font-black uppercase tracking-tighter leading-[1.05]">Destinations Phares</h2>
					<div class="section-divider mx-auto mt-4 w-24" />
					<p class="mx-auto mt-5 max-w-2xl font-body-lg text-body-lg text-secondary leading-relaxed">
						Des hauts plateaux aux côtes sauvages, chaque destination révèle un Madagascar différent. Sélectionnés pour leur richesse naturelle et leur authenticité culturelle.
					</p>
				</div>
			</Reveal>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<Reveal animation="fadeLeft" duration={700}>
					<div class="relative h-[400px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/10">
						<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={`background-image: ${bg1}`}></div>
						<div class="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/95 via-on-secondary-fixed/35 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
						<div class="absolute bottom-0 left-0 right-0 p-8 text-on-primary transition-transform duration-300">
							<span class="inline-block bg-primary-container text-on-primary px-3 py-1.5 font-label-caps text-label-caps mb-3 uppercase rounded-md shadow-md">RÉGION CENTRE-SUD</span>
							<h3 class="font-h1-mobile text-h1-mobile font-black mb-2 uppercase tracking-tight">Fianarantsoa</h3>
							<p class="font-body-lg text-on-primary/80 max-w-md">Plongez au coeur de la capitale du Betsileo, entre vignobles en terrasses, architecture historique et artisanat traditionnel.</p>
						</div>
					</div>
				</Reveal>
				<div class="grid grid-rows-2 gap-8 min-h-[500px]">
					<Reveal animation="fadeRight" delay={80} duration={700}>
						<div class="relative h-full min-h-[200px] rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/10">
							<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={`background-image: ${bg2}`}></div>
							<div class="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/90 via-on-secondary-fixed/25 to-transparent"></div>
							<div class="absolute bottom-0 left-0 right-0 p-6 text-on-primary">
								<h3 class="font-h2 text-h2 font-black mb-1 uppercase tracking-tight">Parc National de Ranomafana</h3>
								<p class="font-body-md text-on-primary/80">Forêt tropicale, lémuriens et sources chaudes naturelles.</p>
							</div>
						</div>
					</Reveal>
					<Reveal animation="fadeRight" delay={140} duration={700}>
						<div class="relative h-full rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/10">
							<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={`background-image: ${bg3}`}></div>
							<div class="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/90 via-on-secondary-fixed/25 to-transparent"></div>
							<div class="absolute bottom-0 left-0 right-0 p-6 text-on-primary">
								<h3 class="font-h2 text-h2 font-black mb-1 uppercase tracking-tight">Ambalavao &amp; Réserve d'Anja</h3>
								<p class="font-body-md text-on-primary/80">Lémuriens catta et artisanat traditionnel Antaimoro.</p>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
			</div>
		</section>
	);
}
