import { img } from '../../../utils/images.js';

export function GallerySection() {
	const images = [
		{
			src: img('https://lh3.googleusercontent.com/aida/ADBb0ujA9SRMLGsiuZCtrzX3cyE7ym9wpTc-_ElN0ZNTlEeY_PmicE0Ce9iKMzqWYqGGEMld3ZL5cohZVSWl4v5o9CRlNkPcZXacBo5l8UhXMVL6ARGPP_SStBLShAgjUXVhjP8MS_26Tb457HFE6B86ST5qAt5BOlNo7ZH7YIrjWdlVTXpZbQL7S5XAKlRPyZfSnd-fYKBicBdrcMcffG0P9JNy4M3uCYX0dVndNr4ZhMMfGI8uPK11GumjT4Y'),
			alt: 'Randonnée dans les hautes terres',
			label: 'Trek Hautes Terres',
			meta: 'Altitude et lignes de crête',
			span: 'xl:col-span-7 xl:row-span-2',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida/ADBb0uhPBQ8LYwbBz-BpUolrlJ-jEiarh229XEqBqMgV9QUmv0QYJyyQaPgpZjXiorVq9TZZzllsvWioqEsxuipqSZWK5bHix0ZSNdlTnweeqeVbnjs5_ZPvtNo_jU6kAxSJ737iRgunL9X9g0C3LKaDkO7nBH4Sgz_z8UUNWeJXEHvmGOMJdqDyJBbovXPV6UAKrUH5h2XjJSGfqufgUj1ilEToKMXQqUHH8gkiniA1PPnl1uTmnPYstRfTUt4'),
			alt: 'Village traditionnel et rizières',
			label: 'Région Betsileo',
			meta: 'Cultures en terrasses',
			span: 'xl:col-span-5',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuAkio4VJUPgJPpaxLyJf8XUmQPzbUCkHHzbdIofoPS9BA1BfUXImCENR0mxA91OqeDCz1bWiXFpb1uxDTlqA9FSyLPDlxYYGFNMAVDsXqRq_o5rxf-KPpHEeN4rQWY-AeMAFgXmqm0vXDvDcfB99PknncZRIGPyS_e9KfpACSU__BgtaGCRS-5SjG2v4OxglWwnN7jgk12W2RiT8rL_J7hc0rEF-R5T0QV-cDxZH6YaA97XsLFCUQCchIJtY-ZTmEXTllCnw96DTmc'),
			alt: 'Faune endémique',
			label: 'Rencontre Faunique',
			meta: 'Observation silencieuse',
			span: 'xl:col-span-4',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCvU8JMScoFI1gbViK1kPPegwWGpihkNED-vo79OhOKlq-ZcnZi27cJg89GogKZzSAuhe-m63xBdxe0kr6w8jHSSfTIBoe1GT6xEACKS2UY-Dsrx8A2YMZGLijrdzVTQ5apcyHO2PEqP_RYJCZzhm4aRO5QxrAGKtSRDVszLGvbULPSKhek-35AQansjo4gwzG84fDtGXtuTOJEttfBaoGfKPXb6s6HD26Ssnzc3-I93-3CGKz68Pu7avKuVJUHNEWRigTAmhETLvQ'),
			alt: 'Campement au crépuscule',
			label: 'Bivouac Sauvage',
			meta: 'Nuit sous les étoiles',
			span: 'xl:col-span-4',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCP5oX4sfi3TPm_OD2gWDKBFS0ICJRfBpkpaOhmzvPKuLqZ47A-rl_90IPiZVIk5isvF5jSzyk_wcX-e4DkyPPxQoYNtsUQOeRY9PbiMtEz5YOK324BSh55UmGZr66hHRm7dR2VCGMFyP9P1g2cbCkyrW9216cpHZTtM00BJkkIazaM0NUx1Z6E8qzOljuh3Luf57136RDRDQwxYqVvq_vQQj2L8E8VCys03gC49HXx_YgHfZz-RxQW_GAEz1w4AN78stKZSVXR4VI'),
			alt: 'Pirogue traditionnelle',
			label: 'Navigation Côtière',
			meta: 'Mouvements et reflets',
			span: 'xl:col-span-4',
		},
	];

	return (
		<section class="relative py-section-gap bg-inverse-surface px-margin-mobile md:px-margin-desktop w-full overflow-hidden" id="gallery">
			<div class="absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
			<div class="absolute bottom-[-6rem] left-[-5rem] h-80 w-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
			<div class="relative max-w-container-max mx-auto">
				<div class="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between mb-12 xl:mb-14">
					<div class="max-w-2xl">
						<span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-label-caps text-label-caps text-on-primary/75 backdrop-blur-sm">
							<span class="h-2 w-2 rounded-full bg-primary-container" />
							ARCHIVES VISUELS
						</span>
						<h2 class="mt-5 font-h2 text-h2 md:text-[clamp(2.25rem,3vw,3.75rem)] text-on-primary font-black uppercase tracking-tighter leading-[1.05]">
							Expeditions Passees
						</h2>
						<div class="section-divider mt-4 w-28" />
						<p class="font-body-md text-body-md text-on-primary/72 mt-5 max-w-xl leading-relaxed">
							Plongez dans une mosaïque éditoriale de paysages, de rencontres et de gestes authentiques capturés à travers Madagascar.
						</p>
					</div>
					<div class="flex flex-col sm:flex-row gap-3">
						<div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
							<p class="font-label-caps text-label-caps text-on-primary/50">Visuels</p>
							<p class="mt-1 font-button text-button text-on-primary">Mosaïque immersive</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
							<p class="font-label-caps text-label-caps text-on-primary/50">Rythme</p>
							<p class="mt-1 font-button text-button text-on-primary">Défilement fluide</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
							<p class="font-label-caps text-label-caps text-on-primary/50">Accès</p>
							<p class="mt-1 font-button text-button text-on-primary">Voir toute la galerie</p>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12 xl:auto-rows-[220px]">
					{images.map((image) => (
						<article
							class={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 ring-1 ring-white/5 ${image.span}`}
						>
							<img
								alt={image.alt}
								class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
								loading="lazy"
								src={image.src}
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
							<div class="absolute inset-x-0 bottom-0 p-5 sm:p-6">
								<div class="flex flex-wrap items-center gap-2">
									<span class="rounded-full bg-primary px-3 py-1.5 font-label-caps text-label-caps text-on-primary shadow-lg shadow-primary/25">
										{image.label}
									</span>
									<span class="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-label-caps text-label-caps text-on-primary/85 backdrop-blur-md">
										{image.meta}
									</span>
								</div>
								<div class="mt-4 flex items-end justify-between gap-4">
									<div>
										<p class="font-body-md text-body-md text-on-primary/78 max-w-sm leading-relaxed">
											{image.alt}
										</p>
									</div>
									<span class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-on-primary backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
										<span class="material-symbols-outlined text-[20px]">arrow_outward</span>
									</span>
								</div>
							</div>
						</article>
					))}
				</div>
				<div class="mt-8 flex justify-end">
					<button
						class="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 font-button text-button text-on-primary backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
						type="button"
					>
						VOIR TOUTE LA GALERIE
						<span class="material-symbols-outlined text-[20px]">collections</span>
					</button>
				</div>
			</div>
		</section>
	);
}
