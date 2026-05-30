import { useLocation } from 'preact-iso';
import { currentUser } from '../../stores/auth.js';

const navItems = [
	{ icon: 'event', label: 'Événements', key: 'evenements', path: '/admin/dashboard', table: 'evenements' },
	{ icon: 'people', label: 'Clients', key: 'clients', path: '/admin/clients', table: 'clients' },
	{ icon: 'book_online', label: 'Réservations', key: 'reservations', path: '/admin/reservations', table: 'reservations' },
	{ icon: 'photo_library', label: 'Photos', key: 'photos', path: '/admin/photos', table: 'photos_evenement' },
	{ icon: 'group', label: 'Guides', key: 'guides', path: '/admin/guides', table: null },
	{ icon: 'admin_panel_settings', label: 'Utilisateurs', key: 'utilisateurs', path: '/admin/utilisateurs', table: 'utilisateurs' },
	{ icon: 'settings', label: 'Paramètres', key: 'settings', path: '/admin/settings', table: null },
];

export function Sidebar({ open, onClose }) {
	const { url } = useLocation();
	const user = currentUser.value;

	const content = (
		<>
			<div class="p-8">
				{/* ── Profile card ── */}
				<div class="flex items-center gap-3 mb-8 pb-5 border-b border-outline-variant/20">
					<div class="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
						<span class="material-symbols-outlined text-on-primary text-xl">person</span>
					</div>
					<div class="min-w-0">
						<p class="font-button text-button text-on-background font-bold truncate">
							{user?.nomUtilisateur || 'GMT+3'}
						</p>
						<p class="font-label-caps text-label-caps text-secondary mt-0.5 truncate">
							{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrateur'}
						</p>
					</div>
				</div>
				<nav class="space-y-1">
					{navItems.map((item) => {
						const active = url.startsWith(item.path);
						return (
							<a
								key={item.key}
								href={item.path}
								onClick={onClose}
								class={`flex items-center gap-3 px-4 py-3 rounded-xl font-button text-button transition-all duration-200 ${
									active
										? 'bg-primary-container/10 text-primary font-extrabold shadow-sm'
										: 'text-secondary hover:bg-surface-container hover:text-on-background'
								}`}
							>
								<span class={`material-symbols-outlined ${active ? 'text-primary-container' : 'text-secondary'}`}>{item.icon}</span>
								{item.label}
							</a>
						);
					})}
				</nav>
			</div>
			<div class="mt-auto p-6 border-t border-outline-variant/30">
				<div class="rounded-2xl bg-gradient-to-br from-primary/5 to-primary-container/5 p-4 border border-primary/10">
					<p class="font-label-caps text-label-caps text-primary font-bold uppercase tracking-wider">Version 1.0</p>
					<p class="text-xs text-secondary mt-1">GMT+3 Admin Panel</p>
				</div>
			</div>
		</>
	);

	return (
		<>
			{/* Desktop sidebar */}
			<aside class="w-72 bg-surface shrink-0 hidden lg:flex flex-col overflow-y-auto border-r border-outline-variant/40">
				{content}
			</aside>

			{/* Mobile overlay */}
			{open && (
				<div class="fixed inset-0 z-50 lg:hidden">
					<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
					<aside class="relative w-72 max-w-[80vw] h-full bg-surface flex flex-col overflow-y-auto shadow-2xl animate-slide-in-left">
						<div class="flex justify-end p-4">
							<button onClick={onClose} class="p-2 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all">
								<span class="material-symbols-outlined text-[24px]">close</span>
							</button>
						</div>
						{content}
					</aside>
				</div>
			)}
		</>
	);
}
