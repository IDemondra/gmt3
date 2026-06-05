import { useState } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';

export function GallerySection() {
	const [lightbox, setLightbox] = useState(null);
    const cards = [
        {
            id: 'IMG-0941',
            src: img('https://lh3.googleusercontent.com/aida/ADBb0ujA9SRMLGsiuZCtrzX3cyE7ym9wpTc-_ElN0ZNTlEeY_PmicE0Ce9iKMzqWYqGGEMld3ZL5cohZVSWl4v5o9CRlNkPcZXacBo5l8UhXMVL6ARGPP_SStBLShAgjUXVhjP8MS_26Tb457HFE6B86ST5qAt5BOlNo7ZH7YIrjWdlVTXpZbQL7S5XAKlRPyZfSnd-fYKBicBdrcMcffG0P9JNy4M3uCYX0dVndNr4ZhMMfGI8uPK11GumjT4Y'),
            alt: 'Randonnée dans les hautes terres',
            label: 'Trek Hautes Terres',
            meta: 'ISO 400 | f/2.8 | 1/1000s',
            note: 'Progression sur ligne de crête, exposition maximale.',
            span: 'xl:col-span-8',
            priority: true,
			coord: '21.034°S 47.120°E'
        },
        {
            id: 'IMG-0942',
            src: img('https://lh3.googleusercontent.com/aida/ADBb0uhPBQ8LYwbBz-BpUolrlJ-jEiarh229XEqBqMgV9QUmv0QYJyyQaPgpZjXiorVq9TZZzllsvWioqEsxuipqSZWK5bHix0ZSNdlTnweeqeVbnjs5_ZPvtNo_jU6kAxSJ737iRgunL9X9g0C3LKaDkO7nBH4Sgz_z8UUNWeJXEHvmGOMJdqDyJBbovXPV6UAKrUH5h2XjJSGfqufgUj1ilEToKMXQqUHH8gkiniA1PPnl1uTmnPYstRfTUt4'),
            alt: 'Village traditionnel et rizières',
            label: 'Région Betsileo',
            meta: 'ISO 100 | f/8.0 | 1/250s',
            note: 'Architecture Betsileo intacte, harmonie agricole.',
            span: 'xl:col-span-4',
			coord: '21.458°S 47.089°E'
        },
        {
            id: 'IMG-0943',
            src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuAkio4VJUPgJPpaxLyJf8XUmQPzbUCkHHzbdIofoPS9BA1BfUXImCENR0mxA91OqeDCz1bWiXFpb1uxDTlqA9FSyLPDlxYYGFNMAVDsXqRq_o5rxf-KPpHEeN4rQWY-AeMAFgXmqm0vXDvDcfB99PknncZRIGPyS_e9KfpACSU__BgtaGCRS-5SjG2v4OxglWwnN7jgk12W2RiT8rL_J7hc0rEF-R5T0QV-cDxZH6YaA97XsLFCUQCchIJtY-ZTmEXTllCnw96DTmc'),
            alt: 'Faune endémique',
            label: 'Rencontre Faunique',
            meta: 'ISO 800 | f/4.0 | 1/500s',
            note: 'Lémurien catta en phase d\'éveil matinal.',
            span: 'xl:col-span-4',
			coord: '21.833°S 46.933°E'
        },
        {
            id: 'IMG-0944',
            src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCvU8JMScoFI1gbViK1kPPegwWGpihkNED-vo79OhOKlq-ZcnZi27cJg89GogKZzSAuhe-m63xBdxe0kr6w8jHSSfTIBoe1GT6xEACKS2UY-Dsrx8A2YMZGLijrdzVTQ5apcyHO2PEqP_RYJCZzhm4aRO5QxrAGKtSRDVszLGvbULPSKhek-35AQansjo4gwzG84fDtGXtuTOJEttfBaoGfKPXb6s6HD26Ssnzc3-I93-3CGKz68Pu7avKuVJUHNEWRigTAmhETLvQ'),
            alt: 'Campement au crépuscule',
            label: 'Bivouac Sauvage',
            meta: 'ISO 1600 | f/1.8 | 15s',
            note: 'Pollution lumineuse nulle. Ciel austral pur.',
            span: 'xl:col-span-4',
			coord: '20.254°S 47.112°E'
        },
        {
            id: 'IMG-0945',
            src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCP5oX4sfi3TPm_OD2gWDKBFS0ICJRfBpkpaOhmzvPKuLqZ47A-rl_90IPiZVIk5isvF5jSzyk_wcX-e4DkyPPxQoYNtsUQOeRY9PbiMtEz5YOK324BSh55UmGZr66hHRm7dR2VCGMFyP9P1g2cbCkyrW9216cpHZTtM00BJkkIazaM0NUx1Z6E8qzOljuh3Luf57136RDRDQwxYqVvq_vQQj2L8E8VCys03gC49HXx_YgHfZz-RxQW_GAEz1w4AN78stKZSVXR4VI'),
            alt: 'Pirogue traditionnelle',
            label: 'Navigation Côtière',
            meta: 'ISO 200 | f/5.6 | 1/400s',
            note: 'Passage canal des Pangalanes, brume matinale.',
            span: 'xl:col-span-4',
			coord: '18.912°S 49.043°E'
        },
    ];

    return (
        <section class="relative w-full overflow-hidden bg-on-secondary-fixed px-margin-mobile py-section-gap md:px-margin-desktop" id="gallery">
			{/* Progressive Transition from Light Section */}
			<div class="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-surface-variant to-transparent pointer-events-none z-10" />
			
			{/* Technical Bridge Line */}
			<div class="absolute top-0 left-0 right-0 z-20 pointer-events-none">
				<div class="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
				<div class="max-w-container-max mx-auto px-margin-desktop flex justify-between items-start py-4">
					<div class="flex flex-col gap-1">
						<span class="font-mono text-[8px] text-white/40 tracking-[0.3em] uppercase">Visual Evidence Retrieval</span>
						<div class="flex items-center gap-2">
							<div class="h-1 w-1 rounded-full bg-primary" />
							<span class="font-mono text-[9px] text-white/60 font-bold uppercase">Database: GMT3-ARCH-2026</span>
						</div>
					</div>
				</div>
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
                    <div class="hidden lg:flex flex-col items-end gap-3 border-l border-white/10 pl-10">
                        <div class="flex items-center gap-4">
                            <span class="font-mono text-[10px] text-white/20 uppercase tracking-widest">Storage Status</span>
                            <div class="flex gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} class={`h-1 w-4 rounded-full ${i <= 4 ? 'bg-primary' : 'bg-white/10'}`} />)}
                            </div>
                        </div>
                        <p class="font-mono text-[9px] text-white/30 uppercase tracking-tighter">Secure Uplink: Established</p>
                    </div>
                </div>

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

                <div class="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-white/10 pt-10">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-2">
                            <div class="h-1 w-8 bg-primary animate-pulse" />
                            <span class="font-mono text-[10px] text-white/40 tracking-widest uppercase">Encryption Active</span>
                        </div>
                    </div>
                    <button
                        class="group relative px-10 py-5 bg-white text-on-secondary-fixed font-button text-xs tracking-[0.2em] font-black uppercase rounded-sm overflow-hidden transition-all hover:pr-14"
                        type="button"
                    >
                        <span class="relative z-10">Accéder aux Archives Complètes</span>
                        <span class="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 material-symbols-outlined">database</span>
                        <div class="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 -z-0 opacity-10" />
                    </button>
                </div>
            </div>
        </section>
    );
}