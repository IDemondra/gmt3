export function NotFound() {
	return (
		<section class="flex-grow flex items-center justify-center bg-on-secondary-fixed text-white px-margin-mobile overflow-hidden relative">
			{/* Technical Background */}
			<div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
				 style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 30px 30px;" />
			<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

			<div class="text-center max-w-lg relative z-10">
				<div class="inline-flex items-center justify-center w-24 h-24 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-pulse">
					<span class="material-symbols-outlined text-5xl text-primary">gps_off</span>
				</div>
				<h1 class="font-mono text-[8rem] font-black text-white/90 leading-none tracking-tighter">404</h1>
				<p class="font-h2 text-h2 text-primary uppercase tracking-[0.2em] mb-4">Sector Not Found</p>
				<p class="font-body-lg text-white/60 mb-10 leading-relaxed">
					Cette coordonnée géographique n'existe pas dans nos journaux de bord. La mission semble être sortie de la zone cartographiée.
				</p>
				<a
					href="/"
					class="inline-flex items-center gap-3 font-button text-xs font-black uppercase tracking-widest bg-primary hover:bg-primary-container text-white px-10 py-5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
				>
					<span class="material-symbols-outlined">north_east</span>
					RETOUR AU CENTRE D'OPÉRATIONS
				</a>
			</div>
		</section>
	);
}
