import { img } from '../../../utils/images.js';

export function AboutSection() {
	return (
		<section class="py-section-gap bg-surface-variant px-margin-mobile md:px-margin-desktop w-full border-y-2 border-outline-variant" id="guides">
			<div class="max-w-container-max mx-auto">
				<div class="flex flex-col md:flex-row items-center gap-16">
					<div class="w-full md:w-1/2">
						<h2 class="font-h2 text-h2 text-on-background font-bold mb-4 uppercase">Nos Guides Experts</h2>
						<div class="section-divider w-24 mb-6" />
						<p class="font-body-lg text-body-lg text-secondary mb-8 leading-relaxed">
							Votre sécurité et votre immersion sont nos priorités absolues. Nos guides locaux sont des passionnés de leur région, partageant avec vous des connaissances approfondies sur la biodiversité unique et la culture malgache.
						</p>
						<ul class="space-y-5 mb-10">
							<li class="flex items-center gap-5 group">
								<div class="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
									<span class="material-symbols-outlined">health_and_safety</span>
								</div>
								<div>
									<span class="font-body-md text-on-background font-semibold">Formés aux premiers secours en milieu sauvage</span>
									<p class="font-body-md text-secondary text-sm">Certification internationale de secourisme</p>
								</div>
							</li>
							<li class="flex items-center gap-5 group">
								<div class="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
									<span class="material-symbols-outlined">language</span>
								</div>
								<div>
									<span class="font-body-md text-on-background font-semibold">Multilingues</span>
									<p class="font-body-md text-secondary text-sm">Français, Anglais, Malgache local</p>
								</div>
							</li>
							<li class="flex items-center gap-5 group">
								<div class="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary-container group-hover:text-on-primary transition-all duration-300">
									<span class="material-symbols-outlined">eco</span>
								</div>
								<div>
									<span class="font-body-md text-on-background font-semibold">Éco-tourisme responsable</span>
									<p class="font-body-md text-secondary text-sm">Engagés dans une démarche durable</p>
								</div>
							</li>
						</ul>
						<button class="font-button text-button bg-primary-container text-on-primary px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 group">
							RENCONTRER L'ÉQUIPE
							<span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
						</button>
					</div>
					<div class="w-full md:w-1/2 grid grid-cols-2 gap-4">
						<div class="relative overflow-hidden rounded-xl shadow-lg group">
							<img alt="Portrait de guide local" class="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" src={img('https://lh3.googleusercontent.com/aida-public/AB6AXuAbuDeIPLsY83l0VH8H0y92_P8QpKqSP8rE3nKmm3kDbjmZgcvhUcWwO2iiqNLPnl67NACEORlOuY1MGvTy1DEoocLXX0Pvc33eMsOykpFGJR7BQXeaz7_fiEpApi2bYlGWGIFbSbiOFdys5G9jUbLC8GBBI6BjWFehAl3bISOSDPYHelPt7ZdHT0nlW8XGUxnUkcUULbbyz4I7wtrDxAtXYFtyKDqmxsj8iQntZi3uZpfXktCP23bYcIvnnTWiVG8RNGM7KzwMcsA')}/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</div>
						<div class="relative overflow-hidden rounded-xl shadow-lg group mt-8">
							<img alt="Guide en action" class="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500" src={img('https://lh3.googleusercontent.com/aida-public/AB6AXuDFObZ3NzvjwCbetXzl_ONZPxuiEgjfXRWCsEkZD1-cV7rExx4dFnd72HvbllO9v6Q19Ej5gPbGvfmlA2U3AE3FyiUK3ehKtEJjSkAy6ORj2xYfvTPAi6_IBkP5yp0Jl4L_qdaakA1xd0S1znDNGX9ndrh-e0rtXOl8Ut8ikFEmiY2V2ZidBPyT1D07PEFHhhEfgnIA9RStddtqqDB82zbtgzI5zL_o5ysVI5plnLzrzyAOULPtrhl85B1a_oxIQ6IIZaTINMSnzfI')}/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}