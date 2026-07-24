// @ts-nocheck
export function Navbar({ user, onLogout, onToggleSidebar }) {
	return (
		<header class="bg-white sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/80">
			<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4">
				<div class="flex items-center gap-6">
					<button type="button" onClick={onToggleSidebar} class="lg:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
						<span class="material-symbols-outlined text-[24px]">menu</span>
					</button>
					
					<div class="flex items-center gap-2.5 cursor-pointer">
						<div class="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
							<span class="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
						</div>
						<span class="font-h2 text-lg font-bold text-gray-900 tracking-tight">
							GMT+3 <span class="text-gray-400">Admin</span>
						</span>
					</div>
					
					<div class="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-100 group focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/5 focus-within:border-primary/20 transition-all">
						<span class="material-symbols-outlined text-gray-400 text-[18px] group-focus-within:text-primary transition-colors">search</span>
						<input class="bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none w-64" aria-label="Rechercher" placeholder="Rechercher..." type="text" />
					</div>
				</div>

				<div class="flex items-center gap-4">
					<button type="button"
						onClick={onLogout}
						class="font-button text-sm font-semibold text-gray-500 hover:text-primary hover:bg-gray-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2"
					>
						<span class="material-symbols-outlined text-[20px]">logout</span>
						<span class="hidden sm:inline">Déconnexion</span>
					</button>
				</div>
			</div>
		</header>
	);
}
