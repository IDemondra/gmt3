import { img } from '../../../utils/images.js';

export function AboutSection() {
	return (
		<section class="py-section-gap bg-surface-variant px-margin-mobile md:px-margin-desktop w-full border-y-2 border-outline-variant" id="guides">
			<div class="max-w-container-max mx-auto">
				<div class="flex flex-col md:flex-row items-center gap-12">
					<div class="w-full md:w-1/2">
						<h2 class="font-h2 text-h2 text-on-background font-bold mb-4 uppercase">Nos Guides Experts</h2>
						<div class="h-1 w-24 bg-primary-container mb-6"></div>
						<p class="font-body-lg text-body-lg text-secondary mb-6">
							Votre sécurité et votre immersion sont nos priorités absolues. Nos guides locaux sont des passionnés de leur région, partageant avec vous des connaissances approfondies sur la biodiversité unique et la culture malgache.
						</p>
						<ul class="space-y-4 mb-8">
							<li class="flex items-center gap-4">
								<div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
									<span class="material-symbols-outlined">health_and_safety</span>
								</div>
								<span class="font-body-md text-on-background font-medium">Formés aux premiers secours en milieu sauvage</span>
							</li>
							<li class="flex items-center gap-4">
								<div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
									<span class="material-symbols-outlined">language</span>
								</div>
								<span class="font-body-md text-on-background font-medium">Multilingues (Français, Anglais, Malgache local)</span>
							</li>
							<li class="flex items-center gap-4">
								<div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container shrink-0">
									<span class="material-symbols-outlined">eco</span>
								</div>
								<span class="font-body-md text-on-background font-medium">Engagés dans une démarche d'éco-tourisme responsable</span>
							</li>
						</ul>
						<button class="font-button text-button bg-primary-container text-on-primary px-8 py-4 rounded-lg hover:shadow-lg transition-all duration-300">
							RENCONTRER L'ÉQUIPE
						</button>
					</div>
					<div class="w-full md:w-1/2 grid grid-cols-2 gap-4">
						<img alt="Portrait de guide local" class="rounded-lg object-cover w-full h-72 shadow-md" src={img('https://lh3.googleusercontent.com/aida-public/AB6AXuAbuDeIPLsY83l0VH8H0y92_P8QpKqSP8rE3nKmm3kDbjmZgcvhUcWwO2iiqNLPnl67NACEORlOuY1MGvTy1DEoocLXX0Pvc33eMsOykpFGJR7BQXeaz7_fiEpApi2bYlGWGIFbSbiOFdys5G9jUbLC8GBBI6BjWFehAl3bISOSDPYHelPt7ZdHT0nlW8XGUxnUkcUULbbyz4I7wtrDxAtXYFtyKDqmxsj8iQntZi3uZpfXktCP23bYcIvnnTWiVG8RNGM7KzwMcsA')}/>
						<img alt="Guide en action" class="rounded-lg object-cover w-full h-72 mt-8 shadow-md" src={img('https://lh3.googleusercontent.com/aida-public/AB6AXuDFObZ3NzvjwCbetXzl_ONZPxuiEgjfXRWCsEkZD1-cV7rExx4dFnd72HvbllO9v6Q19Ej5gPbGvfmlA2U3AE3FyiUK3ehKtEJjSkAy6ORj2xYfvTPAi6_IBkP5yp0Jl4L_qdaakA1xd0S1znDNGX9ndrh-e0rtXOl8Ut8ikFEmiY2V2ZidBPyT1D07PEFHhhEfgnIA9RStddtqqDB82zbtgzI5zL_o5ysVI5plnLzrzyAOULPtrhl85B1a_oxIQ6IIZaTINMSnzfI')}/>
					</div>
				</div>
			</div>
		</section>
	);
}