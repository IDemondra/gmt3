import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { clientsApi, createClientApi, updateClientApi, deleteClientApi } from '../../api/clients.js';
import { handleDigitKeyDown, getDigitsValue } from '../../utils/digits.js';
import { formatIsoDateFr } from '../../utils/dateFormatter.js';

const ROWS_PER_PAGE = 10;
const CONTACT_DIGITS = 10;

export function AdminClients() {
	const { route } = useLocation();
	const { confirmLogout } = useLogout(() => route('/admin', true));
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

	const handleContactKeyDown = (e) => handleDigitKeyDown(e);

	const handleContactInput = (e) => {
		const digits = getDigitsValue(e, CONTACT_DIGITS);
		e.currentTarget.value = digits;
		setContactValue(digits);
		setContactError(
			digits.length > 0 && digits.length !== CONTACT_DIGITS
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
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
						<div>
							<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Clients</h1>
							<p class="text-gray-500 mt-2 text-base">Gérez votre base de données clients.</p>
						</div>
						<button onClick={handleCreate} class="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer">
							<span class="material-symbols-outlined text-[20px]">add</span> Ajouter
						</button>
					</div>

					<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-50">
							<div class="flex items-center gap-3">
								<h2 class="text-base font-bold text-gray-900">Tous les clients</h2>
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
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nom</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contact</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date d'ajout</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									{paged.map((c, i) => (
										<tr key={c.id} class="hover:bg-gray-50/50 transition-colors">
											<td class="px-6 py-4 text-xs text-gray-500 font-medium">{page * ROWS_PER_PAGE + i + 1}</td>
											<td class="px-6 py-4 text-sm font-semibold text-gray-900">{c.nom}</td>
											<td class="px-6 py-4 text-sm text-gray-600 font-mono">{c.contact}</td>
											<td class="px-6 py-4 text-sm text-gray-600">{formatIsoDateFr(c.dateAjout) || '—'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button onClick={() => handleEdit(c)} class="p-2 text-gray-400 hover:text-primary transition-colors" title="Modifier"><span class="material-symbols-outlined text-[18px]">edit</span></button>
													<button onClick={() => setConfirm({ type: 'delete-client', clientId: c.id })} class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
												</div>
											</td>
										</tr>
									))}
									{paged.length === 0 && (
										<tr><td colspan="5" class="px-6 py-12 text-center text-gray-400 text-sm">Aucun client trouvé.</td></tr>
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
			<ConfirmDialog open={confirm?.type === 'delete-client'} title="Supprimer le client" message="Cette action est irréversible. Le client sera définitivement supprimé." confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />

			{showForm && (
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditingClient(null); }}>
					<div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-8 border border-gray-100 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-extrabold text-gray-900 tracking-tight">{editingClient ? "Modifier le client" : "Nouveau client"}</h3>
							<button onClick={() => { setShowForm(false); setEditingClient(null); }} class="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"><span class="material-symbols-outlined">close</span></button>
						</div>
						<form onSubmit={handleSubmit} class="space-y-6">
							<div>
								<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="nom">Nom</label>
								<input id="nom" name="nom" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Nom du client" required defaultValue={editingClient?.nom || ''} />
							</div>
							<div>
								<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="contact">Contact</label>
								<input
									id="contact"
									name="contact"
									class={`w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${contactError ? 'border-red-500 focus:ring-red-500/10' : ''}`}
									placeholder="10 chiffres requis"
									inputmode="numeric"
									pattern="[0-9]{10}"
									maxlength={CONTACT_DIGITS}
									required
									value={contactValue}
									onKeyDown={handleContactKeyDown}
									onInput={handleContactInput}
								/>
								{contactError && (
									<p class="mt-1.5 text-xs text-red-500 font-medium">{contactError}</p>
								)}
							</div>
							<div class="flex justify-end gap-3 pt-4 border-t border-gray-50">
								<button type="button" onClick={() => { setShowForm(false); setEditingClient(null); }} class="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm transition-all">Annuler</button>
								<button type="submit" class="px-5 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container font-semibold text-sm transition-all shadow-sm">{editingClient ? 'Enregistrer' : 'Créer'}</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
