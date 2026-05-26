import { img } from '../../../utils/images.js';

export function GallerySection() {
	const images = [
		{
			src: img('https://lh3.googleusercontent.com/aida/ADBb0ujA9SRMLGsiuZCtrzX3cyE7ym9wpTc-_ElN0ZNTlEeY_PmicE0Ce9iKMzqWYqGGEMld3ZL5cohZVSWl4v5o9CRlNkPcZXacBo5l8UhXMVL6ARGPP_SStBLShAgjUXVhjP8MS_26Tb457HFE6B86ST5qAt5BOlNo7ZH7YIrjWdlVTXpZbQL7S5XAKlRPyZfSnd-fYKBicBdrcMcffG0P9JNy4M3uCYX0dVndNr4ZhMMfGI8uPK11GumjT4Y'),
			alt: 'Randonnée dans les hautes terres',
			label: 'Trek Hautes Terres',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida/ADBb0uhPBQ8LYwbBz-BpUolrlJ-jEiarh229XEqBqMgV9QUmv0QYJyyQaPgpZjXiorVq9TZZzllsvWioqEsxuipqSZWK5bHix0ZSNdlTnweeqeVbnjs5_ZPvtNo_jU6kAxSJ737iRgunL9X9g0C3LKaDkO7nBH4Sgz_z8UUNWeJXEHvmGOMJdqDyJBbovXPV6UAKrUH5h2XjJSGfqufgUj1ilEToKMXQqUHH8gkiniA1PPnl1uTmnPYstRfTUt4'),
			alt: 'Village traditionnel et rizières',
			label: 'Région Betsileo',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuAkio4VJUPgJPpaxLyJf8XUmQPzbUCkHHzbdIofoPS9BA1BfUXImCENR0mxA91OqeDCz1bWiXFpb1uxDTlqA9FSyLPDlxYYGFNMAVDsXqRq_o5rxf-KPpHEeN4rQWY-AeMAFgXmqm0vXDvDcfB99PknncZRIGPyS_e9KfpACSU__BgtaGCRS-5SjG2v4OxglWwnN7jgk12W2RiT8rL_J7hc0rEF-R5T0QV-cDxZH6YaA97XsLFCUQCchIJtY-ZTmEXTllCnw96DTmc'),
			alt: 'Faune endémique',
			label: 'Rencontre Faunique',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCvU8JMScoFI1gbViK1kPPegwWGpihkNED-vo79OhOKlq-ZcnZi27cJg89GogKZzSAuhe-m63xBdxe0kr6w8jHSSfTIBoe1GT6xEACKS2UY-Dsrx8A2YMZGLijrdzVTQ5apcyHO2PEqP_RYJCZzhm4aRO5QxrAGKtSRDVszLGvbULPSKhek-35AQansjo4gwzG84fDtGXtuTOJEttfBaoGfKPXb6s6HD26Ssnzc3-I93-3CGKz68Pu7avKuVJUHNEWRigTAmhETLvQ'),
			alt: 'Campement au crépuscule',
			label: 'Bivouac Sauvage',
		},
		{
			src: img('https://lh3.googleusercontent.com/aida-public/AB6AXuCP5oX4sfi3TPm_OD2gWDKBFS0ICJRfBpkpaOhmzvPKuLqZ47A-rl_90IPiZVIk5isvF5jSzyk_wcX-e4DkyPPxQoYNtsUQOeRY9PbiMtEz5YOK324BSh55UmGZr66hHRm7dR2VCGMFyP9P1g2cbCkyrW9216cpHZTtM00BJkkIazaM0NUx1Z6E8qzOljuh3Luf57136RDRDQwxYqVvq_vQQj2L8E8VCys03gC49HXx_YgHfZz-RxQW_GAEz1w4AN78stKZSVXR4VI'),
			alt: 'Pirogue traditionnelle',
			label: 'Navigation Côtière',
		},
	];

	return (
		<section class="py-section-gap bg-inverse-surface px-margin-mobile md:px-margin-desktop w-full border-t border-on-secondary-fixed" id="gallery">
			<div class="max-w-container-max mx-auto">
				<div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
					<div>
						<h2 class="font-h2 text-h2 text-on-primary font-bold mb-2 uppercase">Expéditions Passées</h2>
						<div class="h-1 w-24 bg-primary-container"></div>
						<p class="font-body-md text-on-primary/70 mt-4 max-w-xl">Plongez dans les souvenirs de nos voyageurs à travers les paysages grandioses et les rencontres authentiques de Madagascar.</p>
					</div>
					<button class="flex items-center gap-2 text-on-primary font-button text-button hover:text-primary-container transition-colors shrink-0 border border-on-primary/30 px-4 py-2 rounded-lg">
						VOIR TOUTE LA GALERIE <span class="material-symbols-outlined">collections</span>
					</button>
				</div>
				<div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
					{images.map((img, i) => (
						<div key={i} class="break-inside-avoid rounded-lg overflow-hidden group relative">
							<img alt={img.alt} class="w-full object-cover group-hover:scale-105 transition-transform duration-500" src={img.src} />
							<div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
								<span class="text-on-primary font-button tracking-wider uppercase">{img.label}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}