import { useLocation } from 'preact-iso';
import { currentUser } from '../../stores/auth.js';

const navItems = [
	{ icon: 'event', label: 'Événements', key: 'evenements', path: '/admin/dashboard', table: 'evenements' },
	{ icon: 'people', label: 'Clients', key: 'clients', path: '/admin/clients', table: 'clients' },
	{ icon: 'book_online', label: 'Réservations', key: 'reservations', path: '/admin/reservations', table: 'reservations' },
	{ icon: 'photo_library', label: 'Photos', key: 'photos', path: '/admin/photos', table: 'photos_evenement' },
	{ icon: 'reviews', label: 'Avis', key: 'avis', path: '/admin/avis', table: 'avis' },
	{ icon: 'admin_panel_settings', label: 'Utilisateurs', key: 'utilisateurs', path: '/admin/utilisateurs', table: 'utilisateurs' },
];

// @ts-ignore
export function Sidebar({ open, onClose }) {
	const { url } = useLocation();
	const user = currentUser.value;

const content = (
		<div class="flex flex-col h-full bg-white">
			<div class="p-6">
				{/* ── Profile ── */}
				<div class="flex items-center gap-3 mb-10 px-2">
					<div class="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-100">
						<span class="material-symbols-outlined text-gray-500 text-[20px]">person</span>
					</div>
					<div class="min-w-0">
						<p class="text-sm font-bold text-gray-900 truncate tracking-tight">
							{user?.nomUtilisateur || 'GMT+3'}
						</p>
						<p class="text-[11px] text-gray-400 font-medium truncate">
							{user?.role || 'Admin'}
						</p>
					</div>
				</div>

				<nav class="space-y-1">
					{navItems.filter((item) => item.key !== 'utilisateurs' || user?.role === 'admin').map((item) => {
						const active = url.startsWith(item.path);
						return (
							<a
								key={item.key}
								href={item.path}
								onClick={onClose}
								class={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
									active
										? 'bg-primary/5 text-primary'
										: 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
								}`}
							>
								<span class={`material-symbols-outlined text-[20px] ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-900 transition-colors'}`}>{item.icon}</span>
								<span class={`text-[13px] font-semibold ${active ? 'font-bold' : ''}`}>
									{item.label}
								</span>
							</a>
						);
					})}
				</nav>
			</div>
		</div>
	);

	return (
		<>
			{/* Desktop sidebar */}
			<aside class="w-64 bg-white shrink-0 hidden lg:flex flex-col overflow-y-auto border-r border-gray-100">
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
