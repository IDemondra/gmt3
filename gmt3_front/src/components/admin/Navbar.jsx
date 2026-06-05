// @ts-nocheck
export function Navbar({ onLogout, onToggleSidebar }) {
	return (
		<header class="bg-surface sticky top-0 z-50 border-b border-outline-variant/40 backdrop-blur-xl bg-surface/80">
			<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4">
				<div class="flex items-center gap-4">
					<button onClick={onToggleSidebar} class="lg:hidden p-2 -ml-2 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all">
						<span class="material-symbols-outlined text-[24px]">menu</span>
					</button>
					<span class="font-h2 text-h2 font-black text-on-background uppercase tracking-tighter">
						GMT+3
					</span>
					<span class="font-label-caps text-label-caps bg-primary-container/10 text-primary-container px-3 py-1.5 rounded-full font-bold">
						ADMIN
					</span>
				</div>
				<div class="flex items-center gap-4">
					<div class="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/30">
						<span class="material-symbols-outlined text-secondary text-[18px]">search</span>
						<input class="bg-transparent text-sm text-on-background placeholder-secondary outline-none w-48" placeholder="Rechercher..." type="text" />
					</div>
					<button
						onClick={onLogout}
						class="font-button text-button text-secondary hover:text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
					>
						<span class="material-symbols-outlined text-[20px]">logout</span>
						<span class="hidden sm:inline">Déconnexion</span>
					</button>
				</div>
			</div>
		</header>
	);
}
