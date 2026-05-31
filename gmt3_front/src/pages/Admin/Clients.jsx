import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { clientsApi, createClientApi, updateClientApi, deleteClientApi } from '../../api/clients.js';

const ROWS_PER_PAGE = 10;
const CONTACT_DIGITS = 10;

export function AdminClients() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [clients, setClients] = useState(/** @type {any[]} */([]));
	const [showForm, setShowForm] = useState(false);
	const [editingClient, setEditingClient] = useState(/** @type {any|null} */(null));
	const [confirm, setConfirm] = useState(/** @type {{ type: string; clientId?: number } | null} */(null));
	const [contactValue, setContactValue] = useState('');
	const [contactError, setContactError] = useState('');
	const [page, setPage] = useState(0);

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadClients();
		});
	}, []);

	const loadClients = async () => {
		try {
			const data = await clientsApi(accessToken.value);
			if (Array.isArray(data)) setClients(data);
		} catch {}
	};

	const handleCreate = () => {
		setEditingClient(null);
		setContactValue('');
		setContactError('');
		setShowForm(true);
	};
	const handleEdit = (c) => {
		setEditingClient(c);
		setContactValue(c.contact || '');
		setContactError('');
		setShowForm(true);
	};

	const handleContactKeyDown = (e) => {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
		if (allowed.includes(e.key)) return;
		if (!/^[0-9]$/.test(e.key)) e.preventDefault();
	};

	const handleContactInput = (e) => {
		const el = e.currentTarget;
		const raw = el.value;
		const digitsOnly = raw.replace(/\D/g, '').slice(0, CONTACT_DIGITS);
		if (digitsOnly !== raw) el.value = digitsOnly;
		setContactValue(digitsOnly);
		setContactError(
			digitsOnly.length > 0 && digitsOnly.length !== CONTACT_DIGITS
				? `Le contact doit contenir exactement ${CONTACT_DIGITS} chiffres.`
				: ''
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const fd = new FormData(e.target);
		const nom = fd.get('nom');
		if (!nom) { alert('Le nom est obligatoire.'); return; }
		if (contactValue.length !== CONTACT_DIGITS) {
			setContactError(`Le contact doit contenir exactement ${CONTACT_DIGITS} chiffres.`);
			return;
		}
		const data = { nom, contact: contactValue };
		try {
			if (editingClient) {
				const updated = await updateClientApi(accessToken.value, editingClient.id, data);
				setClients((prev) => prev.map((c) => c.id === editingClient.id ? updated : c));
			} else {
				const created = await createClientApi(accessToken.value, data);
				setClients((prev) => [...prev, created]);
			}
			setShowForm(false);
			setEditingClient(null);
		} catch (e) { alert(e.message); }
	};

	const confirmDelete = async () => {
		if (!confirm || confirm.type !== 'delete-client' || !confirm.clientId) return;
		try {
			await deleteClientApi(accessToken.value, confirm.clientId);
			setClients((prev) => prev.filter((c) => c.id !== confirm.clientId));
		} catch {}
		setConfirm(null);
	};

	const filtered = search
		? clients.filter((c) => c.nom?.toLowerCase().includes(search.toLowerCase()) || c.contact?.toLowerCase().includes(search.toLowerCase()))
		: clients;
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
							<h1 class="font-h1 text-h1 text-on-background font-black uppercase tracking-tighter leading-none">Clients</h1>
							<p class="font-body-lg text-body-lg text-secondary mt-1.5">Gérez les clients et leurs contacts.</p>
						</div>
						<button onClick={handleCreate} class="bg-primary-container text-on-primary font-button text-button px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 font-bold">
							<span class="material-symbols-outlined">add</span> Ajouter
						</button>
					</div>

					<div class="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden shadow-sm">
						<div class="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20">
							<div>
								<h2 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight">Tous les clients</h2>
								<p class="text-sm text-secondary mt-0.5">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</p>
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
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Nom</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Contact</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Date d'ajout</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{paged.map((c, i) => (
										<tr key={c.id} class={`border-b border-outline-variant/30 transition-colors duration-150 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-container/40'} hover:bg-primary/5`}>
											<td class="px-6 py-4"><span class="font-mono text-xs text-secondary bg-surface-container px-2.5 py-1 rounded-lg font-semibold">{page * ROWS_PER_PAGE + i + 1}</span></td>
											<td class="px-6 py-4"><div class="flex items-center gap-3"><div class="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-primary-container text-[18px]">person</span></div><span class="font-body-md text-body-md text-on-background font-semibold">{c.nom}</span></div></td>
											<td class="px-6 py-4 text-sm text-secondary">{c.contact}</td>
											<td class="px-6 py-4 text-sm text-secondary">{c.dateAjout?.slice(0, 10) || '—'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button onClick={() => handleEdit(c)} class="p-2.5 rounded-xl text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-150" title="Modifier"><span class="material-symbols-outlined text-[20px]">edit</span></button>
													<button onClick={() => setConfirm({ type: 'delete-client', clientId: c.id })} class="p-2.5 rounded-xl text-secondary hover:text-red-600 hover:bg-red-50 transition-all duration-150" title="Supprimer"><span class="material-symbols-outlined text-[20px]">delete</span></button>
												</div>
											</td>
										</tr>
									))}
									{paged.length === 0 && (
										<tr><td colspan="5" class="px-6 py-12 text-center text-secondary/60 font-body-md">Aucun client trouvé.</td></tr>
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

			<ConfirmDialog open={confirm?.type === 'logout'} title="Déconnexion" message="Êtes-vous sûr de vouloir vous déconnecter ?" confirmLabel="Se déconnecter" icon="logout" variant="danger" onConfirm={confirmLogout} onCancel={() => setConfirm(null)} />
			<ConfirmDialog open={confirm?.type === 'delete-client'} title="Supprimer le client" message="Cette action est irréversible. Le client sera définitivement supprimé." confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />

			{showForm && (
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditingClient(null); }}>
					<div class="bg-surface rounded-2xl border border-outline-variant/30 shadow-2xl w-full max-w-md mx-4 p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
						<div class="flex items-center justify-between mb-6">
							<h3 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight">{editingClient ? "Modifier le client" : "Nouveau client"}</h3>
							<button onClick={() => { setShowForm(false); setEditingClient(null); }} class="p-2 rounded-xl text-secondary hover:text-on-background hover:bg-surface-container transition-all"><span class="material-symbols-outlined">close</span></button>
						</div>
						<form onSubmit={handleSubmit} class="space-y-5">
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="nom">Nom</label>
								<input id="nom" name="nom" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" placeholder="Nom du client" required defaultValue={editingClient?.nom || ''} />
							</div>
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="contact">Contact</label>
								<input
									id="contact"
									name="contact"
									class={`w-full px-4 py-3 bg-background border outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl ${contactError ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10' : 'border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10'}`}
									placeholder="10 chiffres requis"
									inputmode="numeric"
									pattern="[0-9]{10}"
									maxlength={CONTACT_DIGITS}
									required
									value={contactValue}
									onKeyDown={handleContactKeyDown}
									onKeyDown={handleContactKeyDown}
									onInput={handleContactInput}
								/>
								{contactError && (
									<p class="mt-1.5 text-xs text-red-500 font-medium">{contactError}</p>
								)}
							</div>
							<div class="flex justify-end gap-3 pt-2">
								<button type="button" onClick={() => { setShowForm(false); setEditingClient(null); }} class="px-6 py-3 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all font-button text-button">Annuler</button>
								<button type="submit" class="px-6 py-3 rounded-xl bg-primary-container text-on-primary hover:shadow-lg hover:shadow-primary/20 transition-all font-button text-button font-bold">{editingClient ? 'Enregistrer' : 'Créer'}</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
