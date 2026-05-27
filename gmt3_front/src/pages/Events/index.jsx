import { Reveal } from '../../components/ui/Reveal.jsx';
import { Footer } from '../../components/Footer.jsx';

const events = [
	{
		img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp-WIeKr_a7VCmtcqnIFUlqRrFWsSSgE1Flw-1ab94TTrxSmlltLXWtOaqQ2_Uy3L_6BwllDGxshfnJ_emrhTdUrZKhnY8OOJ3shRHtfFn7Riop9OlCPRqMt2GSkToYX4pjlV8m-q78VdV6-rNYMckztRxBOwNF72FgxFsBC5S2nUjLVy6LD9ELFCWhvMYg-gQqnm4hRU_b5ofzaNe2VcAa_6yfhJtoUcFIsTEyRVko1hj2XtHVk_ocv5egThycNYJ3agjXgBrDaM',
		badge: 'EXTREME TREK',
		date: 'OCT 15 - 22, 2024',
		title: 'TSINGY PEAK CHALLENGE',
		desc: 'Conquer the razor-sharp limestone forests. A grueling but rewarding expedition for experienced hikers.',
		price: '€1,200',
	},
	{
		img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Tj3wID0H6VbGQcK05TnegTtu6Fa5S7CQiR1nRH3Vn2FgLbrg8G15VQOeSO0FSZqMIP9J6O7bP-yDHQMv3PNl0QvWwNprl4uEJxW7Wb8TGrFG-EGyEBO4pII2znSImeT7xn4RWAau2XtDNQcT7YDNMLU8_YANrCTImaKpb-Rp5285BIGTCUoUQBGbclD6Zcc9JkwzQfwNbUA_qp9W9FbiAhIxPzd5gGPWX-2JE-jW3vcfPqcdO9EKtdGFeZK_LaiOC6hQhRWpu94',
		badge: 'WILDLIFE',
		date: 'NOV 02 - 05, 2024',
		title: 'LEMUR TRACKING EXPEDITION',
		desc: 'Venture deep into Andasibe to track rare lemur species in their natural, untamed habitat.',
		price: '€450',
	},
	{
		img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgYJTEHnnc--WHOQ2V2aJ0luE0SsWDUG_KvejUxd98vb4G0Cs179gmDf1YjKVOyDDFNn4y6kCuugQrMNPx5zNeqma25kEvobaTngOO0K9GG-eA1KsmUUdVXcEhEDNriKc3wtdPnL_jlQYaYh0-UPRTRBIavCwRWDg9s8sfnRfMTIlnLeAxcKrfReqf0ycC7VJY0EBGcrTPi9y8lGRP7mdmYdif7tk3IXMHUfKHgNazhIs9owP7e0q9mj6sU0-a3PIp4FoS2eXiYxQ',
		badge: 'PHOTOGRAPHY',
		date: 'DEC 10 - 14, 2024',
		title: 'BAOBAB SUNSET MASTERCLASS',
		desc: 'Join renowned photographers to capture the iconic Avenue of the Baobabs under spectacular lighting conditions.',
		price: '€800',
	},
];

export function Events() {
	return (
		<>
		<main class="flex-grow flex flex-col pb-section-gap">
			{/* Page Header */}
			<section class="relative bg-inverse-surface py-20 mb-14 overflow-hidden">
				<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,30,36,0.3),_transparent_60%)]" />
				<div class="relative px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
					<Reveal animation="fadeUp">
						<span class="inline-block bg-primary-container text-on-primary px-4 py-1.5 font-label-caps text-label-caps mb-5 uppercase rounded-lg">EXPLOREZ NOS</span>
					</Reveal>
					<Reveal animation="fadeUp" delay={100}>
						<h1 class="font-h1-mobile text-h1-mobile md:font-h1 md:text-h1 text-on-primary mb-5 uppercase tracking-tighter font-black">
							UPCOMING EVENTS
						</h1>
					</Reveal>
					<Reveal animation="fadeUp" delay={200}>
						<p class="font-body-lg text-body-lg text-on-primary/70 max-w-2xl leading-relaxed">
							Discover thrilling adventures and exclusive expeditions across the wild landscapes of Madagascar. Book your spot before they fill up.
						</p>
					</Reveal>
				</div>
			</section>

			{/* Filter Bar */}
			<section class="px-margin-mobile md:px-margin-desktop mb-14">
				<div class="max-w-container-max mx-auto flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-variant rounded-2xl p-4 border border-outline-variant">
					<div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
						<span class="font-label-caps text-label-caps text-secondary mr-2">CATEGORIES:</span>
						{['ALL', 'TREKKING', 'WILDLIFE', 'CULTURE'].map((cat) => (
							<button key={cat} class={`font-button text-button px-4 py-2 rounded-lg transition-all duration-200 ${
								cat === 'ALL'
									? 'bg-primary text-on-primary shadow-md'
									: 'text-secondary hover:bg-primary/10 hover:text-primary'
							}`}>
								{cat}
							</button>
						))}
					</div>
					<div class="flex items-center gap-3 w-full md:w-auto justify-end">
						<select class="bg-background text-on-background font-button text-button px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none appearance-none cursor-pointer">
							<option value="date">SORT BY DATE</option>
							<option value="price">SORT BY PRICE</option>
						</select>
						<button class="bg-primary text-on-primary font-button text-button px-5 py-2.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 rounded-xl">
							<span class="material-symbols-outlined">filter_list</span>
							FILTRER
						</button>
					</div>
				</div>
			</section>

			{/* Event Grid */}
			<section class="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mb-16">
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
					{events.map((event, i) => (
						<Reveal key={i} animation="fadeUp" delay={i * 100}>
							<article class="bg-surface rounded-2xl flex flex-col group overflow-hidden shadow-md hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
								<div class="relative h-64 overflow-hidden">
									<div class="absolute inset-0 bg-black/20 z-10" />
									<img alt={event.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={event.img} loading="lazy" />
									<div class="absolute top-4 left-4 z-20 bg-primary text-on-primary font-label-caps text-label-caps px-3 py-1.5 rounded-lg shadow-lg">
										{event.badge}
									</div>
								</div>
								<div class="p-6 flex flex-col flex-grow">
									<div class="flex items-center gap-2 text-secondary font-label-caps text-label-caps mb-3">
										<span class="material-symbols-outlined text-primary">calendar_month</span>
										{event.date}
									</div>
									<h3 class="font-h3 text-h3 text-primary mb-3 uppercase font-bold leading-tight">{event.title}</h3>
									<p class="font-body-md text-body-md text-on-background mb-6 flex-grow leading-relaxed">{event.desc}</p>
									<div class="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant">
										<span class="font-h3 text-h3 text-primary font-bold">{event.price}</span>
										<button class="bg-primary text-on-primary font-button text-button px-6 py-2.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 rounded-xl hover:scale-[1.02] active:scale-95 font-bold tracking-wider">
											RESERVER
										</button>
									</div>
								</div>
							</article>
						</Reveal>
					))}
				</div>
			</section>

			{/* Pagination */}
			<Reveal animation="fadeUp">
				<section class="flex justify-center items-center gap-3 py-6 mt-auto">
					<button class="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-200">
						<span class="material-symbols-outlined">chevron_left</span>
					</button>
					{[1, 2, 3].map((p) => (
						<button key={p} class={`w-10 h-10 rounded-xl font-button text-button transition-all duration-200 ${
							p === 1
								? 'bg-primary text-on-primary shadow-md'
								: 'border border-outline-variant text-secondary hover:bg-primary/10 hover:text-primary'
						}`}>
							{p}
						</button>
					))}
					<span class="text-secondary px-1">...</span>
					<button class="w-10 h-10 rounded-xl border border-outline-variant text-secondary hover:bg-primary/10 hover:text-primary transition-all duration-200">8</button>
					<button class="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center text-secondary hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-200">
						<span class="material-symbols-outlined">chevron_right</span>
					</button>
				</section>
			</Reveal>
		</main>
		<Footer />
		</>
	);
}
