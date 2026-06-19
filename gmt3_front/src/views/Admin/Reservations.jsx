import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { SearchableSelect } from '../../components/ui/SearchableSelect.jsx';
import { reservationsApi, createReservationApi, updateReservationApi, deleteReservationApi } from '../../api/reservations.js';
import { clientsApi } from '../../api/clients.js';
import { evenementsApi } from '../../api/evenements.js';
import { formatIsoDateFr } from '../../utils/dateFormatter.js';

const ROWS_PER_PAGE = 10;

export function AdminReservations() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [reservations, setReservations] = useState(/** @type {any[]} */([]));
	const [clients, setClients] = useState(/** @type {any[]} */([]));
	const [evenements, setEvenements] = useState(/** @type {any[]} */([]));
	const [showForm, setShowForm] = useState(false);
	const [editing, setEditing] = useState(/** @type {any|null} */(null));
	const [confirm, setConfirm] = useState(/** @type {{ type: string; id?: number } | null} */(null));
	const [formClientId, setFormClientId] = useState('');
	const [formEvenementId, setFormEvenementId] = useState('');
	const [formPlaces, setFormPlaces] = useState(1);
	const [formError, setFormError] = useState('');
	const [page, setPage] = useState(0);

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadAll();
		});
	}, []);

	const loadAll = async () => {
		try {
			const [res, cli, evt] = await Promise.all([
				reservationsApi(accessToken.value),
				clientsApi(accessToken.value),
				evenementsApi(accessToken.value),
			]);
			if (Array.isArray(res.data)) setReservations(res.data);
			if (Array.isArray(cli.data)) setClients(cli.data);
			if (Array.isArray(evt.data)) setEvenements(evt.data);
		} catch {}
	};

	const clientMap = /** @type {Record<number, string>} */({});
	clients.forEach((c) => { clientMap[c.id] = c.nom; });

	const evenementMap = /** @type {Record<number, string>} */({});
	evenements.forEach((e) => { evenementMap[e.id] = e.titre; });

	const handleCreate = () => {
		setEditing(null);
		setFormClientId('');
		setFormEvenementId('');
		setFormPlaces(1);
		setFormError('');
		setShowForm(true);
	};

	const handleEdit = (r) => {
		setEditing(r);
		setFormClientId(String(r.clientId));
		setFormEvenementId(String(r.evenementId));
		setFormPlaces(r.nombrePlaces ?? 1);
		setFormError('');
		setShowForm(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const clientId = Number(formClientId);
		const evenementId = Number(formEvenementId);
		const nombrePlaces = Number(formPlaces);

		if (!clientId || !evenementId || nombrePlaces < 1) {
			setFormError('Tous les champs sont obligatoires.');
			return;
		}

		const data = { clientId, evenementId, nombrePlaces };
		try {
			if (editing) {
				const updated = await updateReservationApi(accessToken.value, editing.id, data);
				setReservations((prev) => prev.map((r) => r.id === editing.id ? updated : r));
			} else {
				const created = await createReservationApi(accessToken.value, data);
				setReservations((prev) => [...prev, created]);
			}
			setShowForm(false);
			setEditing(null);
		} catch (err) { alert(err.message); }
	};

	const confirmDelete = async () => {
		if (!confirm || confirm.type !== 'delete-reservation' || !confirm.id) return;
		try {
			await deleteReservationApi(accessToken.value, confirm.id);
			setReservations((prev) => prev.filter((r) => r.id !== confirm.id));
		} catch {}
		setConfirm(null);
	};

	const filtered = search
		? reservations.filter((r) => {
			const nom = clientMap[r.clientId] || '';
			const titre = evenementMap[r.evenementId] || '';
			const q = search.toLowerCase();
			return nom.toLowerCase().includes(q) || titre.toLowerCase().includes(q) || String(r.nombrePlaces).includes(q);
		})
		: reservations;
	const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
	const paged = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
						<div>
							<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Réservations</h1>
							<p class="text-gray-500 mt-2 text-base">Gérez les réservations clients.</p>
						</div>
						<button onClick={handleCreate} class="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer">
							<span class="material-symbols-outlined text-[20px]">add</span> Ajouter
						</button>
					</div>

					<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-50">
							<div class="flex items-center gap-3">
								<h2 class="text-base font-bold text-gray-900">Toutes les réservations</h2>
								<span class="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[11px] font-bold border border-gray-100">{filtered.length}</span>
							</div>
							<div class="relative w-full sm:w-auto">
								<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
								<input class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 w-full sm:w-72 rounded-lg" placeholder="Rechercher..." type="text" value={search} onInput={(e) => { setSearch(e.currentTarget.value); setPage(0); }} />
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="bg-gray-50/50 border-b border-gray-50">
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">#</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Événement</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Places</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									{paged.map((r, i) => (
										<tr key={r.id} class="hover:bg-gray-50/50 transition-colors">
											<td class="px-6 py-4 text-xs text-gray-500 font-medium">{page * ROWS_PER_PAGE + i + 1}</td>
											<td class="px-6 py-4 text-sm font-semibold text-gray-900">{clientMap[r.clientId] || '—'}</td>
											<td class="px-6 py-4 text-sm text-gray-600">{evenementMap[r.evenementId] || '—'}</td>
											<td class="px-6 py-4 text-sm font-mono text-gray-900">{r.nombrePlaces}</td>
											<td class="px-6 py-4 text-sm text-gray-600">{r.dateReservation || '—'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button onClick={() => handleEdit(r)} class="p-2 text-gray-400 hover:text-primary transition-colors" title="Modifier"><span class="material-symbols-outlined text-[18px]">edit</span></button>
													<button onClick={() => setConfirm({ type: 'delete-reservation', id: r.id })} class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
												</div>
											</td>
										</tr>
									))}
									{paged.length === 0 && (
										<tr><td colspan="6" class="px-6 py-12 text-center text-gray-400 text-sm">Aucune réservation trouvée.</td></tr>
									)}
								</tbody>
							</table>
						</div>

						{totalPages > 1 && (
							<div class="p-4 border-t border-gray-50 flex justify-between items-center gap-4 bg-gray-50/20">
								<span class="text-xs text-gray-400 font-medium">{page * ROWS_PER_PAGE + 1}-{Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} sur {filtered.length}</span>
								<div class="flex gap-2">
									<button class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><span class="material-symbols-outlined text-[18px]">chevron_left</span></button>
									<button class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}><span class="material-symbols-outlined text-[18px]">chevron_right</span></button>
								</div>
							</div>
						)}
					</div>

					<p class="mt-12 text-center text-[11px] text-gray-300 font-bold tracking-widest uppercase">GMT+3 Admin Panel — Fianarantsoa</p>
				</main>
			</div>

			<ConfirmDialog open={confirm?.type === 'logout'} title="Déconnexion" message="Êtes-vous sûr de vouloir vous déconnecter ?" confirmLabel="Se déconnecter" icon="logout" variant="danger" onConfirm={confirmLogout} onCancel={() => setConfirm(null)} />
			<ConfirmDialog open={confirm?.type === 'delete-reservation'} title="Supprimer la réservation" message="Cette action est irréversible." confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />

			{showForm && (
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null); }}>
					<div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-8 border border-gray-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-extrabold text-gray-900 tracking-tight">{editing ? "Modifier la réservation" : "Nouvelle réservation"}</h3>
							<button onClick={() => { setShowForm(false); setEditing(null); }} class="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"><span class="material-symbols-outlined">close</span></button>
						</div>
						<form onSubmit={handleSubmit} class="space-y-6">
							<div>
								<SearchableSelect
									id="clientId"
									label="Client"
									placeholder="Rechercher un client..."
									required
									options={clients.map((c) => ({ value: c.id, label: `${c.nom} — ${c.contact}` }))}
									value={formClientId}
									onChange={(val) => setFormClientId(val)}
								/>
							</div>
							<div>
								<SearchableSelect
									id="evenementId"
									label="Événement"
									placeholder="Rechercher un événement..."
									required
									options={evenements.map((e) => ({ value: e.id, label: `${e.titre} — ${e.dateEvenement?.slice(0, 10) || ''}` }))}
									value={formEvenementId}
									onChange={(val) => setFormEvenementId(val)}
								/>
							</div>
							<div>
								<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="nombrePlaces">Nombre de personne</label>
								<input
									id="nombrePlaces"
									name="nombrePlaces"
									type="number"
									min="1"
									class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
									required
									value={formPlaces}
									onInput={(e) => setFormPlaces(Math.max(1, parseInt(e.currentTarget.value) || 1))}
								/>
							</div>
							{formError && (
								<p class="text-xs text-red-500 font-medium">{formError}</p>
							)}
							<div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
								<button type="button" onClick={() => { setShowForm(false); setEditing(null); }} class="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all">Annuler</button>
								<button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container font-semibold text-sm transition-all shadow-sm">{editing ? 'Enregistrer' : 'Créer'}</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
