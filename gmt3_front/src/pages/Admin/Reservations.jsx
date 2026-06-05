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
			if (Array.isArray(res)) setReservations(res);
			if (Array.isArray(cli)) setClients(cli);
			if (Array.isArray(evt)) setEvenements(evt);
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
		<div class="h-screen flex flex-col bg-background text-on-background font-body-md antialiased overflow-hidden">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 class="font-h1 text-h1 text-on-background font-black uppercase tracking-tighter leading-none">Reservations</h1>
							<p class="font-body-lg text-body-lg text-secondary mt-1.5">Gerer les reservations clients par evenement.</p>
						</div>
						<button onClick={handleCreate} class="bg-primary-container text-on-primary font-button text-button px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 cursor-pointer font-bold">
							<span class="material-symbols-outlined">add</span> Ajouter
						</button>
					</div>

					<div class="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden shadow-sm">
						<div class="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20">
							<div>
								<h2 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight">Toutes les reservations</h2>
								<p class="text-sm text-secondary mt-0.5">{filtered.length} resultat{filtered.length !== 1 ? 's' : ''}</p>
							</div>
							<div class="relative">
								<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
								<input class="pl-10 pr-4 py-2.5 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary w-full sm:w-64 rounded-xl" placeholder="Rechercher..." type="text" value={search} onInput={(e) => { setSearch(e.currentTarget.value); setPage(0); }} />
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="border-b border-outline-variant/20 bg-surface-container/30">
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">#</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Client</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Evenement</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Places</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Date reservation</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{paged.map((r, i) => (
										<tr key={r.id} class={`border-b border-outline-variant/30 transition-colors duration-150 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-container/40'} hover:bg-primary/5`}>
											<td class="px-6 py-4"><span class="font-mono text-xs text-secondary bg-surface-container px-2.5 py-1 rounded-lg font-semibold">{page * ROWS_PER_PAGE + i + 1}</span></td>
											<td class="px-6 py-4"><div class="flex items-center gap-3"><div class="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-primary-container text-[18px]">person</span></div><span class="font-body-md text-body-md text-on-background font-semibold">{clientMap[r.clientId] || '—'}</span></div></td>
											<td class="px-6 py-4 text-sm text-secondary">{evenementMap[r.evenementId] || '—'}</td>
											<td class="px-6 py-4"><span class="font-mono text-sm font-semibold text-on-background bg-surface-container px-3 py-1 rounded-lg">{r.nombrePlaces}</span></td>
											<td class="px-6 py-4 text-sm text-secondary">{r.dateReservation?.slice(0, 10) || '—'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button onClick={() => handleEdit(r)} class="p-2.5 rounded-xl text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-150" title="Modifier"><span class="material-symbols-outlined text-[20px]">edit</span></button>
													<button onClick={() => setConfirm({ type: 'delete-reservation', id: r.id })} class="p-2.5 rounded-xl text-secondary hover:text-red-600 hover:bg-red-50 transition-all duration-150" title="Supprimer"><span class="material-symbols-outlined text-[20px]">delete</span></button>
												</div>
											</td>
										</tr>
									))}
									{paged.length === 0 && (
										<tr><td colspan="6" class="px-6 py-12 text-center text-secondary/60 font-body-md">Aucune reservation trouvee.</td></tr>
									)}
								</tbody>
							</table>
						</div>

						{totalPages > 1 && (
							<div class="p-4 border-t border-outline-variant/20 flex justify-between items-center gap-4">
								<span class="text-sm text-secondary">{page * ROWS_PER_PAGE + 1}-{Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} sur {filtered.length}</span>
								<div class="flex gap-2">
									<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed" disabled={page === 0} onClick={() => setPage((p) => p - 1)}><span class="material-symbols-outlined text-[20px]">chevron_left</span></button>
									<button class="p-2.5 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all disabled:opacity-30 disabled:cursor-not-allowed" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}><span class="material-symbols-outlined text-[20px]">chevron_right</span></button>
								</div>
							</div>
						)}
					</div>

					<p class="mt-8 text-center text-xs text-secondary/50">GMT+3 Admin Panel &copy; {new Date().getFullYear()}</p>
				</main>
			</div>

			<ConfirmDialog open={confirm?.type === 'logout'} title="Deconnexion" message="Etes-vous sur de vouloir vous deconnecter ?" confirmLabel="Se deconnecter" icon="logout" variant="danger" onConfirm={confirmLogout} onCancel={() => setConfirm(null)} />
			<ConfirmDialog open={confirm?.type === 'delete-reservation'} title="Supprimer la reservation" message="Cette action est irreversible." confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />

			{showForm && (
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null); }}>
					<div class="bg-surface rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-md mx-4 p-6 md:p-8 overflow-visible" onClick={(e) => e.stopPropagation()}>
						<div class="flex items-center justify-between mb-6">
							<h3 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight">{editing ? "Modifier la reservation" : "Nouvelle reservation"}</h3>
							<button onClick={() => { setShowForm(false); setEditing(null); }} class="p-2 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all"><span class="material-symbols-outlined">close</span></button>
						</div>
						<form onSubmit={handleSubmit} class="space-y-5">
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
									label="Evenement"
									placeholder="Rechercher un evenement..."
									required
									options={evenements.map((e) => ({ value: e.id, label: `${e.titre} — ${e.dateEvenement?.slice(0, 10) || ''}` }))}
									value={formEvenementId}
									onChange={(val) => setFormEvenementId(val)}
								/>
							</div>
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="nombrePlaces">Nombre de places</label>
								<input
									id="nombrePlaces"
									name="nombrePlaces"
									type="number"
									min="1"
									class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background rounded-xl"
									required
									value={formPlaces}
									onInput={(e) => setFormPlaces(Math.max(1, parseInt(e.currentTarget.value) || 1))}
								/>
							</div>
							{formError && (
								<p class="text-xs text-red-500 font-medium">{formError}</p>
							)}
							<div class="flex justify-end gap-3 pt-2">
								<button type="button" onClick={() => { setShowForm(false); setEditing(null); }} class="px-6 py-3 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all font-button text-button">Annuler</button>
								<button type="submit" class="px-6 py-3 rounded-xl bg-primary-container text-on-primary hover:shadow-lg hover:shadow-primary/20 transition-all font-button text-button font-bold">{editing ? 'Enregistrer' : 'Creer'}</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
