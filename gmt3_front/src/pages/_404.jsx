export function NotFound() {
	return (
		<section class="flex-grow flex items-center justify-center bg-background px-margin-mobile">
			<div class="text-center max-w-lg">
				<div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 mb-8">
					<span class="material-symbols-outlined text-5xl text-primary">explore</span>
				</div>
				<h1 class="font-h1 text-h1 text-primary font-black mb-4">404</h1>
				<p class="font-h3 text-h3 text-on-background mb-3">Page introuvable</p>
				<p class="font-body-lg text-body-lg text-secondary mb-8 leading-relaxed">
					Cette page s'est perdue dans les paysages sauvages de Madagascar. Retournez a l'accueil pour continuer votre aventure.
				</p>
				<a
					href="/"
					class="inline-flex items-center gap-2 font-button text-button bg-primary text-on-primary px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
				>
					<span class="material-symbols-outlined">arrow_back</span>
					RETOUR A L'ACCUEIL
				</a>
			</div>
		</section>
	);
}
