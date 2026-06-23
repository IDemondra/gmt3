import { useState, useEffect } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';
import { isDateInFuture, formatDateFr } from '../../../utils/dateFormatter.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const BACKEND = API_BASE.replace(/\/api$/, '');

function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

export function GallerySection() {
	const [lightbox, setLightbox] = useState(null);
	const [cards, setCards] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE}/evenements`, { credentials: 'include' })
			.then((r) => r.json())
			.then((response) => {
				const events = (Array.isArray(response.data) ? response.data : [])
					.filter((e) => e.estPublie && !isDateInFuture(e.dateDepart || e.dateEvenement));
				// Aplatit les photos des événements passés en une archive visuelle.
				const flat = [];
				for (const evt of events) {
					for (const photo of (evt.photosEvenement || [])) {
						flat.push({
							src: resolveImg(photo.url),
							alt: evt.titre || 'Photo terrain',
							label: evt.titre || 'Sans titre',
							meta: formatDateFr(evt.dateDepart || evt.dateEvenement) || 'Expedition GMT3',
							note: photo.legende || evt.lieu || '',
							coord: evt.lieu || '—',
						});
					}
				}
				const photos = flat.slice(0, 5).map((p, idx) => ({
					...p,
					id: `IMG-${String(idx + 1).padStart(4, '0')}`,
					span: ['xl:col-span-8', 'xl:col-span-4', 'xl:col-span-4', 'xl:col-span-4', 'xl:col-span-4'][idx] || 'xl:col-span-4',
					priority: idx === 0,
				}));
				setCards(photos);
			})
			.catch((err) => {
				setCards([]);
			})
			.finally(() => setLoading(false));
	}, []);

    return (
        <section class="relative w-full overflow-hidden bg-on-secondary-fixed px-margin-mobile py-section-gap md:px-margin-desktop" id="gallery">
			{/* Transition dark → dark (Offers → Gallery) */}
			<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none z-10" />
			
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
			</div>

            {/* Subtle Grid Pattern */}
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 30px 30px;" />

            <div class="absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-primary/12 blur-2xl pointer-events-none" />
            <div class="absolute bottom-[-6rem] left-[-5rem] h-80 w-80 rounded-full bg-white/8 blur-2xl pointer-events-none" />
            
            <div class="relative mx-auto max-w-container-max">
                <div class="mb-12 md:mb-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                    <div class="max-w-2xl">
                        <span class="inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[10px] text-primary tracking-[0.2em] font-bold uppercase">
                            [ System_Archives ]
                        </span>
                        <h2 class="mt-6 font-h2 text-h2 md:text-6xl text-white font-black uppercase tracking-tighter leading-none">
                            Preuves de <br /> <span class="text-primary">Terrain</span>
                        </h2>
                        <p class="mt-8 max-w-xl font-body-lg text-white/50 leading-relaxed">
                            Chaque image est une donnée brute extraite de nos expéditions. Plus qu'une galerie, c'est l'historique visuel de nos incursions au cœur de Madagascar.
                        </p>
                    </div>
                </div>

				{loading && (
					<div class="flex items-center justify-center py-24 gap-3">
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:0ms" />
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:150ms" />
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce" style="animation-delay:300ms" />
					</div>
				)}

				{!loading && cards.length === 0 && (
					<div class="py-24 text-center">
						<div class="inline-flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 mb-6">
							<span class="material-symbols-outlined text-3xl text-primary">image_not_supported</span>
						</div>
						<p class="font-h3 text-xl text-white/40 uppercase tracking-tight">Aucune photo pour le moment</p>
						<p class="mt-2 font-mono text-[10px] text-white/20 tracking-widest uppercase">Archive en cours de remplissage</p>
					</div>
				)}

				{!loading && cards.length > 0 && (
				<div class="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12 auto-rows-[300px] sm:auto-rows-[340px]">
					{cards.map((card, index) => (
						<div key={card.id} class={`${card.span}`}>
							<Reveal
								className="h-full"
								animation="fadeUp"
								delay={index * 100}
								duration={800}
							>
								<button
									type="button"
									onClick={() => setLightbox(index)}
									class="group relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-stone-900 shadow-2xl transition-all duration-500 hover:border-primary/40 isolate flex flex-col"
								>
                                    {/* Card Header (System Style) */}
                                    <div class="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-black/80 to-transparent">
                                        <span class="font-mono text-[9px] text-primary font-bold tracking-widest">{card.id}</span>
                                        <span class="font-mono text-[9px] text-white/40">{card.coord}</span>
                                    </div>

									<img
										alt={card.alt}
										class="absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
										loading={card.priority ? 'eager' : 'lazy'}
										src={card.src}
									/>
									
                                    {/* Scanner Overlay (visible on hover) */}
                                    <div class="absolute inset-0 z-10 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    
                                    {/* Grid Lines on card (visible on hover) */}
                                    <div class="absolute inset-0 z-15 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
                                         style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 20px 20px;" />

									<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
									
                                    {/* Content Info */}
									<div class="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col gap-2">
										<span class="w-fit border border-primary/40 bg-primary/10 backdrop-blur-md px-2 py-0.5 font-mono text-[9px] text-primary font-bold tracking-widest uppercase rounded-sm">
											{card.label}
										</span>
                                        <div class="flex justify-between items-end">
                                            <div>
                                                <p class="font-mono text-[10px] text-white/40 uppercase tracking-tighter mb-1">{card.meta}</p>
                                                <p class="font-serif italic text-white/70 text-sm max-w-xs leading-tight translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                    "{card.note}"
                                                </p>
                                            </div>
                                            <div class="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                                <span class="material-symbols-outlined text-white text-lg">zoom_in</span>
                                            </div>
                                        </div>
									</div>

                                    {/* Corner Accents (visible on hover) */}
                                    <div class="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                    <div class="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
								</button>
							</Reveal>
						</div>
					))}
				</div>
				)}

                <div class="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/10 pt-10">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-2">
                            <div class="h-1 w-8 bg-primary animate-pulse" />
                            <span class="font-mono text-[10px] text-white/40 tracking-widest uppercase">Encryption Active</span>
                        </div>
                    </div>
                    <a
                        href="/archives"
                        class="group relative px-10 py-5 bg-white text-on-secondary-fixed font-button text-xs tracking-[0.2em] font-black uppercase rounded-sm overflow-hidden transition-all hover:pr-14 inline-block"
                    >
                        <span class="relative z-10">Accéder aux Archives Complètes</span>
                        <span class="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 material-symbols-outlined">database</span>
                        <div class="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 -z-0 opacity-10" />
                    </a>
                </div>
            </div>
        </section>
    );
}