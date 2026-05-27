import { img } from '../../../utils/images.js';

export function DestinationsSection() {
	const bg1 = `url('${img('https://lh3.googleusercontent.com/aida/ADBb0ujjtH4hJs61CX1AyTwzD2rH2ADHkzwJk3H_8Zx9RMGT_Avp18hft53dYVYfjQzVnliiJYH5iz8DWvApZxJDl7CXA9RMJk-mOqmXea0ee7XTlWkJkeXYWmKhR2oaAwq0ZbLUgaSL8eglt0_yxfxf-B9vYyWizv4iE88_jCCC359qwOxgU86AVzp_qUWpV4-XHilZQQVTAw4lubmvfIeonA5irD_pOzPu4we8pL0e7wX9OdKcEcIXgKh1cVg')}')`;
	const bg2 = `url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuCHAzLv4UXF0svy3arGo10ftdnYfLums3ksC4WE7JYk2zFZybeTxudGnAtaljoSUaeo4O1gCndNZE4OCyTUWUG1i229gpkMtYSUhEamgwLkIT9dNCGtCrNVGDq50JEUAlRuOO1V8OiQWQ50xTMFhs-C7kVwOrk4KHDNnKgpiH1jJzLwXHdxcYwNE--zQQz891UPb2dPgQHRCg7FXHY6cBw94g_qP0p1DbPiEY3EU3VA-G3ESiWfc6A_Dhx9cb0Ew6-UbnkvRrMwCjc')}')`;
	const bg3 = `url('${img('https://lh3.googleusercontent.com/aida-public/AB6AXuAcpLVLyVXKwhfrB3ptkpBv8UMN3Zd4okkh9YxHJ_zjPVuA2TAEGCErLDBy01Nax5opgkRzeNevm2Ev_53b14ZDvN1n3faD3-f_qAxt_ufVVDQiRfTiKV8yXKb58Un2xGqgNY70QCkd1GlsbeVTOtafFggRSzEHMNh3h82lOSffPDUNEyRQaLM2pTPK0lqlG5eaOEdS_QWAJ-bR7nldilwTvYyOA6UblYWEWqRBqXxkmbOki6RKfHkyXb7y6WIvGAyX0CccWOr5fIU')}')`;

	return (
		<section class="py-section-gap bg-background px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto" id="destinations">
			<div class="text-center mb-12">
				<h2 class="font-h2 text-h2 text-on-background font-bold mb-2 uppercase">Destinations Phares</h2>
				<div class="section-divider w-24 mx-auto" />
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="relative h-[400px] lg:h-full min-h-[500px] rounded-2xl overflow-hidden group cursor-pointer shadow-xl shadow-black/10">
					<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={`background-image: ${bg1}`}></div>
					<div class="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/95 via-on-secondary-fixed/30 to-transparent transition-opacity duration-300 group-hover:opacity-90"></div>
					<div class="absolute bottom-0 left-0 right-0 p-8 text-on-primary transform transition-transform duration-300 group-hover:translate-y-[-4px]">
						<span class="inline-block bg-primary-container text-on-primary px-3 py-1.5 font-label-caps text-label-caps mb-3 uppercase rounded-md shadow-md">RÉGION CENTRE-SUD</span>
						<h3 class="font-h1-mobile text-h1-mobile font-black mb-2 uppercase tracking-tight">Fianarantsoa</h3>
						<p class="font-body-lg text-on-primary/80 max-w-md">Plongez au coeur de la capitale du Betsileo, entre vignobles en terrasses, architecture historique et artisanat traditionnel.</p>
					</div>
				</div>
				<div class="grid grid-rows-2 gap-8 h-[500px]">
					<div class="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/10">
						<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={`background-image: ${bg2}`}></div>
						<div class="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/90 via-on-secondary-fixed/20 to-transparent"></div>
						<div class="absolute bottom-0 left-0 right-0 p-6 text-on-primary transform transition-transform duration-300 group-hover:translate-y-[-4px]">
							<h3 class="font-h2 text-h2 font-black mb-1 uppercase tracking-tight">Tsingy de Bemaraha</h3>
							<p class="font-body-md text-on-primary/80">Labyrinthe de pierre spectaculaire classé à l'UNESCO.</p>
						</div>
					</div>
					<div class="relative rounded-2xl overflow-hidden group cursor-pointer shadow-lg shadow-black/10">
						<div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={`background-image: ${bg3}`}></div>
						<div class="absolute inset-0 bg-gradient-to-t from-on-secondary-fixed/90 via-on-secondary-fixed/20 to-transparent"></div>
						<div class="absolute bottom-0 left-0 right-0 p-6 text-on-primary transform transition-transform duration-300 group-hover:translate-y-[-4px]">
							<h3 class="font-h2 text-h2 font-black mb-1 uppercase tracking-tight">Allée des Baobabs</h3>
							<p class="font-body-md text-on-primary/80">Paysages grandioses au coucher du soleil.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}