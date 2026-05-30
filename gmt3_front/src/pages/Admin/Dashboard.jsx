import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { KpiCards } from '../../components/admin/KpiCards.jsx';
import { EventRow } from '../../components/admin/EventRow.jsx';
import { currentUser, logout, tryAutoRefresh } from '../../stores/auth.js';

import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';

export function AdminDashboard() {
	const { route } = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [confirm, setConfirm] = useState(null); // { type: 'logout' | 'delete-event', event?: any }
	const [events, setEvents] = useState([
		{ id: 'EXP-081', title: "Tsingy de Bemaraha Safari", date: "12 Oct - 18 Oct 2024", published: true },
		{ id: 'EXP-082', title: "Avenue of the Baobabs Sunset", date: "20 Oct - 22 Oct 2024", published: true },
		{ id: 'EXP-083', title: "Isalo National Park Trek", date: "05 Nov - 12 Nov 2024", published: false },
	]);

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) {
				route('/admin', true);
			}
		});
	}, []);

	const handleLogout = () => {
		setConfirm({ type: 'logout' });
	};

	const confirmLogout = async () => {
		await logout();
		route('/admin', true);
	};

	const confirmDeleteEvent = (eventId) => {
		setEvents((prev) => prev.filter((e) => e.id !== eventId));
		setConfirm(null);
	};

	const filtered = search
		? events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
		: events;

	return (
		<div class="h-screen flex flex-col bg-background text-on-background font-body-md antialiased overflow-hidden">
			<Navbar user={currentUser.value} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main class="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
					{/* ── Header ── */}
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 class="font-h1 text-h1 text-on-background font-black uppercase tracking-tighter leading-none">
								Événements
							</h1>
							<p class="font-body-lg text-body-lg text-secondary mt-1.5">
								Gérez les expéditions, destinations et offres actives.
							</p>
						</div>
						<button class="bg-primary-container text-on-primary font-button text-button px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 font-bold">
							<span class="material-symbols-outlined">add</span>
							Ajouter
						</button>
					</div>

					<KpiCards />

					{/* ── Table ── */}
					<div class="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden shadow-sm">
						<div class="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20">
							<div>
								<h2 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight">
									Toutes les expéditions
								</h2>
								<p class="text-sm text-secondary mt-0.5">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>
							</div>
							<div class="flex items-center gap-3">
								<div class="relative">
									<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
									<input
										class="pl-10 pr-4 py-2.5 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary w-full sm:w-64 rounded-xl"
										placeholder="Rechercher..."
										type="text"
										value={search}
										onInput={(e) => setSearch(e.currentTarget.value)}
									/>
								</div>
								<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all">
									<span class="material-symbols-outlined text-[20px]">filter_list</span>
								</button>
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="border-b border-outline-variant/20 bg-surface-container/30">
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Réf</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Titre</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Dates</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Statut</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filtered.map((event, i) => (
										<EventRow key={event.id} event={event} index={i} onDelete={(id) => setConfirm({ type: 'delete-event', eventId: id })} />
									))}
								</tbody>
							</table>
						</div>

						<div class="p-4 border-t border-outline-variant/20 flex justify-between items-center gap-4">
							<span class="text-sm text-secondary">1-{filtered.length} sur {events.length}</span>
							<div class="flex gap-2">
								<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed" disabled>
									<span class="material-symbols-outlined text-[20px]">chevron_left</span>
								</button>
								<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all">
									<span class="material-symbols-outlined text-[20px]">chevron_right</span>
								</button>
							</div>
						</div>
					</div>

					{/* ── Footer ── */}
					<p class="mt-8 text-center text-xs text-secondary/50">
						GMT+3 Admin Panel &copy; {new Date().getFullYear()}
					</p>
				</main>
			</div>

			{/* ── Confirm dialogs ── */}
			<ConfirmDialog
				open={confirm?.type === 'logout'}
				title="Déconnexion"
				message="Êtes-vous sûr de vouloir vous déconnecter ?"
				confirmLabel="Se déconnecter"
				icon="logout"
				variant="danger"
				onConfirm={confirmLogout}
				onCancel={() => setConfirm(null)}
			/>

			<ConfirmDialog
				open={confirm?.type === 'delete-event'}
				title="Supprimer l'événement"
				message="Cette action est irréversible. L'événement sera définitivement supprimé."
				confirmLabel="Supprimer"
				icon="delete"
				variant="danger"
				onConfirm={() => confirmDeleteEvent(confirm?.eventId)}
				onCancel={() => setConfirm(null)}
			/>
		</div>
	);
}
