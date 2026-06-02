import { useState } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { img } from '../../../utils/images.js';

export function GallerySection() {
	const [lightbox, setLightbox] = useState(null);
    const cards = [
        {
            src: img('https://lh3.googleusercontent.com/aida/ADBb0ujA9SRMLGsiuZCtrzX3cyE7ym9wpTc-_ElN0ZNTlEeY_PmicE0Ce9iKMzqWYqGGEMld3ZL5cohZVSWl4v5o9CRlNkPcZXacBo5l8UhXMVL6ARGPP_SStBLShAgjUXVhjP8MS_26Tb457HFE6B86ST5qAt5BOlNo7ZH7YIrjWdlVTXpZbQL7S5XAKlRPyZfSnd-fYKBicBdrcMcffG0P9JNy4M3uCYX0dVndNr4ZhMMfGI8uPK11GumjT4Y'),
            alt: 'Randonnée dans les hautes terres',
            label: 'Trek Hautes Terres',
            meta: 'Altitude et lignes de crête',
            note: 'Ascension lente, panoramas ouverts et lumière de fin de journée.',
            span: 'xl:col-span-7',
            accent: 'rotate-[-1.5deg]',
            priority: true,
        },
        {
            src: img('https://lh3.googleusercontent.com/aida/ADBb0uhPBQ8LYwbBz-BpUolrlJ-jEiarh229XEqBqMgV9QUmv0QYJyyQaPgpZjXiorVq9TZZzllsvWioqEsxuipqSZWK5bHix0ZSNdlTnweeqeVbnjs5_ZPvtNo_jU6kAxSJ737iRgunL9X9g0C3LKaDkO7nBH4Sgz_z8UUNWeJXEHvmGOMJdqDyJBbovXPV6UAKrUH5h2XjJSGfqufgUj1ilEToKMXQqUHH8gkiniA1PPnl1uTmnPYstRfTUt4'),
            alt: 'Village traditionnel et rizières',
            label: 'Région Betsileo',
            meta: 'Cultures en terrasses',
            note: 'Lignes agricoles, villages perchés et rythme quotidien du plateau.',
            span: 'xl:col-span-5',
            accent: 'rotate-[1deg]',
        },
        {
            src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuAkio4VJUPgJPpaxLyJf8XUmQPzbUCkHHzbdIofoPS9BA1BfUXImCENR0mxA91OqeDCz1bWiXFpb1uxDTlqA9FSyLPDlxYYGFNMAVDsXqRq_o5rxf-KPpHEeN4rQWY-AeMAFgXmqm0vXDvDcfB99PknncZRIGPyS_e9KfpACSU__BgtaGCRS-5SjG2v4OxglWwnN7jgk12W2RiT8rL_J7hc0rEF-R5T0QV-cDxZH6YaA97XsLFCUQCchIJtY-ZTmEXTllCnw96DTmc'),
            alt: 'Faune endémique',
            label: 'Rencontre Faunique',
            meta: 'Observation silencieuse',
            note: 'Gestes mesurés, distance respectée et lecture discrète du vivant.',
            span: 'xl:col-span-4',
            accent: 'rotate-[-0.75deg]',
        },
        {
            src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCvU8JMScoFI1gbViK1kPPegwWGpihkNED-vo79OhOKlq-ZcnZi27cJg89GogKZzSAuhe-m63xBdxe0kr6w8jHSSfTIBoe1GT6xEACKS2UY-Dsrx8A2YMZGLijrdzVTQ5apcyHO2PEqP_RYJCZzhm4aRO5QxrAGKtSRDVszLGvbULPSKhek-35AQansjo4gwzG84fDtGXtuTOJEttfBaoGfKPXb6s6HD26Ssnzc3-I93-3CGKz68Pu7avKuVJUHNEWRigTAmhETLvQ'),
            alt: 'Campement au crépuscule',
            label: 'Bivouac Sauvage',
            meta: 'Nuit sous les étoiles',
            note: 'Vrai temps suspendu, feu de camp bas et ciel ouvert sans pollution lumineuse.',
            span: 'xl:col-span-4',
            accent: 'rotate-[1.5deg]',
        },
        {
            src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCP5oX4sfi3TPm_OD2gWDKBFS0ICJRfBpkpaOhmzvPKuLqZ47A-rl_90IPiZVIk5isvF5jSzyk_wcX-e4DkyPPxQoYNtsUQOeRY9PbiMtEz5YOK324BSh55UmGZr66hHRm7dR2VCGMFyP9P1g2cbCkyrW9216cpHZTtM00BJkkIazaM0NUx1Z6E8qzOljuh3Luf57136RDRDQwxYqVvq_vQQj2L8E8VCys03gC49HXx_YgHfZz-RxQW_GAEz1w4AN78stKZSVXR4VI'),
            alt: 'Pirogue traditionnelle',
            label: 'Navigation Côtière',
            meta: 'Mouvements et reflets',
            note: 'Un passage lent sur l’eau pour laisser les textures et la côte raconter la scène.',
            span: 'xl:col-span-4',
            accent: 'rotate-[-1deg]',
        },
    ];

    return (
        <section class="relative w-full overflow-hidden bg-inverse-surface px-margin-mobile py-section-gap md:px-margin-desktop" id="gallery">
            <div class="absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-primary/12 blur-2xl pointer-events-none" />
            <div class="absolute bottom-[-6rem] left-[-5rem] h-80 w-80 rounded-full bg-white/8 blur-2xl pointer-events-none" />
            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            
            <div class="relative mx-auto max-w-container-max">
                <div class="mb-8 md:mb-10 grid gap-5 md:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                    <div class="max-w-2xl">
                        <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 md:py-2 font-label-caps text-label-caps text-on-primary/75 backdrop-blur-sm">
                            <span class="h-2 w-2 rounded-full bg-primary-container" />
                            ARCHIVES VISUELS
                        </span>
                        <h2 class="mt-4 md:mt-5 font-h2 text-[clamp(1.75rem,5.5vw,2.25rem)] md:text-[clamp(2.25rem,3vw,3.75rem)] text-on-primary font-black uppercase tracking-tighter leading-[1.05]">
                            Expeditions Passees
                        </h2>
                        <div class="section-divider mt-3 md:mt-4 w-20 md:w-28" />
                        <p class="mt-4 md:mt-5 max-w-xl font-body-md text-body-md leading-relaxed text-on-primary/72">
                            Une mise en scène plus large, inspirée des model cards: cartes hautes, labels lisibles et images qui prennent enfin la place principale.
                        </p>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                        <div class="rounded-2xl border border-white/10 bg-white/8 px-3 py-2.5 md:px-4 md:py-3 shadow-lg shadow-black/10 backdrop-blur-sm">
                            <p class="font-h3 text-[clamp(1.25rem,4vw,1.5rem)] md:text-h3 text-on-primary">05</p>
                            <p class="mt-1 font-label-caps text-[11px] md:text-label-caps uppercase tracking-[0.22em] text-on-primary/55">Souvenirs archivés</p>
                        </div>
                        <div class="rounded-2xl border border-white/10 bg-white/8 px-3 py-2.5 md:px-4 md:py-3 shadow-lg shadow-black/10 backdrop-blur-sm">
                            <p class="font-h3 text-[clamp(1.25rem,4vw,1.5rem)] md:text-h3 text-on-primary">12</p>
                            <p class="mt-1 font-label-caps text-[11px] md:text-label-caps uppercase tracking-[0.22em] text-on-primary/55">Moments capturés</p>
                        </div>
                        <div class="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-white/8 px-3 py-2.5 md:px-4 md:py-3 shadow-lg shadow-black/10 backdrop-blur-sm">
                            <p class="font-h3 text-[clamp(1.25rem,4vw,1.5rem)] md:text-h3 text-on-primary">100%</p>
                            <p class="mt-1 font-label-caps text-[11px] md:text-label-caps uppercase tracking-[0.22em] text-on-primary/55">Terrain réel</p>
                        </div>
                    </div>
                </div>

				<div class="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-12 xl:gap-6 auto-rows-[260px] sm:auto-rows-[280px] md:auto-rows-[300px] xl:auto-rows-[340px]">
					{cards.map((card, index) => (
						<div key={card.alt} class={`${card.span}`}>
							<Reveal
								className="h-full"
								animation={card.priority ? 'fadeUp' : index % 2 === 0 ? 'fadeUp' : 'driftRight'}
								delay={index * 70}
								duration={700}
							>
								<button
									type="button"
									onClick={() => setLightbox(index)}
									class="group relative h-full w-full overflow-hidden rounded-[1.2rem] md:rounded-[1.6rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_14px_28px_rgba(0,0,0,0.35)] md:shadow-[0_22px_45px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_26px_55px_rgba(0,0,0,0.55)] isolate transform-gpu text-left"
								>
									<img
										alt={card.alt}
										class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
										loading={card.priority ? 'eager' : 'lazy'}
										src={card.src}
									/>
									<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
									<div class="absolute inset-x-0 bottom-0 p-3 md:p-5">
										<span class="inline-block rounded-full border border-white/20 bg-black/50 px-3 py-1 md:px-4 md:py-1.5 font-label-caps text-[11px] md:text-label-caps text-white/95 backdrop-blur-md shadow-lg">
											{card.label}
										</span>
										<p class="mt-1.5 md:mt-2 font-body-md text-[13px] md:text-body-md text-white/80 leading-snug md:leading-normal">{card.meta}</p>
									</div>
								</button>
							</Reveal>
						</div>
					))}
				</div>

                <div class="mt-6 md:mt-8 flex justify-center sm:justify-end">
                    <button
                        class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 md:px-5 md:py-3 font-button text-[13px] md:text-button text-on-primary transition-all duration-300 hover:border-white/25 hover:bg-white/12 hover:shadow-lg hover:shadow-black/12"
                        type="button"
                    >
                        VOIR TOUTE LA GALERIE
                        <span class="material-symbols-outlined text-[18px] md:text-[20px]">collections</span>
                    </button>
                </div>
            </div>
        </section>
    );
}