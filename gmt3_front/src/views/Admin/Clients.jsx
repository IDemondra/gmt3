import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { AdminListHeader } from '../../components/admin/AdminListHeader.jsx';
import { AdminTableToolbar } from '../../components/admin/AdminTableToolbar.jsx';
import { AdminPagination } from '../../components/admin/AdminPagination.jsx';
import { currentUser, accessToken, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { clientsApi, createClientApi, updateClientApi, deleteClientApi } from '../../api/clients.js';
import { handleDigitKeyDown, getDigitsValue } from '../../utils/digits.js';
import { formatIsoDateFr } from '../../utils/dateFormatter.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';

const ROWS_PER_PAGE = 10;
const CONTACT_DIGITS = 10;

export function AdminClients() {
	const { route } = useLocation();
	const { confirmLogout } = useLogout(() => route('/admin', true));
	const { toasts, addToast, removeToast } = useToast();
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
		let cancelled = false;
		const load = async () => {
			try {
				const response = await clientsApi(accessToken.value);
				if (!cancelled && Array.isArray(response.data)) setClients(response.data);
			} catch {
				addToast('Impossible de charger les clients', 'error');
			}
		};
		if (!currentUser.value) { route('/admin', true); return; }
		load();
		return () => { cancelled = true; };
	}, [route, addToast]);

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
			addToast(editingClient ? 'Client modifié' : 'Client créé', 'success');
		} catch (e) { addToast(e.message || 'Erreur', 'error'); }
	};

	const confirmDelete = async () => {
		if (!confirm || confirm.type !== 'delete-client' || !confirm.clientId) return;
		try {
			await deleteClientApi(accessToken.value, confirm.clientId);
			setClients((prev) => prev.filter((c) => c.id !== confirm.clientId));
			addToast('Client supprimé', 'success');
		} catch {
			addToast('Échec de la suppression (réservations liées ?)', 'error');
		}
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
					<AdminListHeader title="Clients" subtitle="Gérez votre base de données clients." onAction={handleCreate} />

					<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<AdminTableToolbar title="Tous les clients" count={filtered.length} search={search} onSearch={(value) => { setSearch(value); setPage(0); }} />

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
										<tr key={c.id} onClick={() => handleEdit(c)} class="cursor-pointer border-b border-outline-variant/30 transition-colors duration-150 hover:bg-primary/5">
											<td class="px-6 py-4 text-xs text-gray-500 font-medium">{page * ROWS_PER_PAGE + i + 1}</td>
											<td class="px-6 py-4 text-sm font-semibold text-gray-900">{c.nom}</td>
											<td class="px-6 py-4 text-sm text-gray-600 font-mono">{c.contact}</td>
											<td class="px-6 py-4 text-sm text-gray-600">{c.dateAjout || '—'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button type="button" onClick={() => handleEdit(c)} class="p-2 text-gray-400 hover:text-primary transition-colors" title="Modifier"><span class="material-symbols-outlined text-[18px]">edit</span></button>
													<button type="button" onClick={() => setConfirm({ type: 'delete-client', clientId: c.id })} class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
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

						<AdminPagination page={page} pageSize={ROWS_PER_PAGE} total={filtered.length} totalPages={totalPages} onPrev={() => setPage((p) => p - 1)} onNext={() => setPage((p) => p + 1)} />
					</div>

					<p class="mt-12 text-center text-[11px] text-gray-300 font-bold tracking-widest uppercase">GMT+3 Admin Panel — Fianarantsoa</p>
				</main>
			</div>


			<ConfirmDialog open={confirm?.type === 'logout'} title="Déconnexion" message="Êtes-vous sûr de vouloir vous déconnecter ?" confirmLabel="Se déconnecter" icon="logout" variant="danger" onConfirm={confirmLogout} onCancel={() => setConfirm(null)} />
			<ConfirmDialog open={confirm?.type === 'delete-client'} title="Supprimer le client" message="Cette action est irréversible. Le client sera définitivement supprimé." confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />
			<ToastContainer toasts={toasts} onRemove={removeToast} />

			{showForm && (
				<div class="fixed inset-0 z-50 flex items-center justify-center">
					<button type="button" aria-label="Fermer le formulaire client" class="absolute inset-0 border-0 bg-black/40 p-0 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditingClient(null); }} />
					<div class="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
						<div class="flex items-center justify-between mb-6">
							<h3 class="text-xl font-extrabold text-gray-900 tracking-tight">{editingClient ? "Modifier le client" : "Nouveau client"}</h3>
							<button type="button" onClick={() => { setShowForm(false); setEditingClient(null); }} class="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all"><span class="material-symbols-outlined">close</span></button>
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

