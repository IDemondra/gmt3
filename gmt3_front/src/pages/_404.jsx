export function NotFound() {
	return (
		<section class="flex flex-1 items-center justify-center bg-background px-margin-mobile py-24 text-center">
			<div class="max-w-xl">
				<div class="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
					<span class="material-symbols-outlined text-5xl" aria-hidden="true">explore_off</span>
				</div>
				<p class="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">Erreur 404</p>
				<h1 class="mt-4 font-h1-mobile text-h1-mobile font-black uppercase text-on-background md:font-h1 md:text-h1">
					Page introuvable
				</h1>
				<p class="mt-4 font-body-lg text-body-lg leading-relaxed text-secondary">
					Cette destination n’existe pas ou n’est plus disponible.
				</p>
				<a href="/" class="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-button text-button text-on-primary transition-all hover:brightness-110">
					<span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
					Retour à l’accueil
				</a>
			</div>
		</section>
	);
}
