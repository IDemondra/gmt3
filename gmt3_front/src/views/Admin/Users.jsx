import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { AdminListHeader } from '../../components/admin/AdminListHeader.jsx';
import { AdminTableToolbar } from '../../components/admin/AdminTableToolbar.jsx';
import { AdminPagination } from '../../components/admin/AdminPagination.jsx';
import { currentUser, accessToken, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { FormModal } from '../../components/admin/FormModal.jsx';
import { usersApi, createUserApi, updateUserApi, deleteUserApi } from '../../api/users.js';
import { formatIsoDateTimeFr } from '../../utils/dateFormatter.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';

const roles = ['admin', 'editeur'];
const ROWS_PER_PAGE = 10;

export function AdminUsers() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const { toasts, addToast, removeToast } = useToast();
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(0);
	const [users, setUsers] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; user?: any } | null} */ (null));

	useEffect(() => {
		let cancelled = false;
		const load = async () => {
			try {
				const response = await usersApi(accessToken.value);
				if (!cancelled && Array.isArray(response.data)) setUsers(response.data);
			} catch {
				addToast('Impossible de charger les utilisateurs', 'error');
			}
		};
		if (!currentUser.value) { route('/admin', true); return; }
		if (currentUser.value.role !== 'admin') { route('/admin/dashboard', true); return; }
		load();
		return () => { cancelled = true; };
	}, [route, addToast]);

	const handleSubmit = async (data) => {
		try {
			if (editingUser) {
				const payload = { nomUtilisateur: data.get('nomUtilisateur'), email: data.get('email'), role: data.get('role') };
				const pwd = data.get('motDePasse');
				if (pwd) payload.motDePasse = pwd;
				const updated = await updateUserApi(accessToken.value, editingUser.id, payload);
				setUsers((prev) => prev.map((u) => u.id === editingUser.id ? updated : u));
			} else {
				const created = await createUserApi(accessToken.value, {
					nomUtilisateur: data.get('nomUtilisateur'),
					email: data.get('email'),
					role: data.get('role'),
					motDePasse: data.get('motDePasse'),
				});
				setUsers((prev) => [...prev, created]);
			}
			setShowForm(false);
			setEditingUser(null);
			addToast(editingUser ? 'Utilisateur modifié' : 'Utilisateur créé', 'success');
		} catch (e) {
			addToast(e.message || 'Erreur', 'error');
		}
	};

	const openEdit = (user) => {
		setEditingUser(user);
		setShowForm(true);
	};

	const handleCreate = () => {
		setEditingUser(null);
		setShowForm(true);
	};

	const confirmDelete = (user) => setConfirm({ type: 'delete', user });
	const executeDelete = async () => {
		try {
			if (confirm?.user) {
				await deleteUserApi(accessToken.value, confirm.user.id);
				setUsers((prev) => prev.filter((u) => u.id !== confirm.user.id));
				addToast('Utilisateur supprimé', 'success');
			}
		} catch {
			addToast('Échec de la suppression', 'error');
		}
		setConfirm(null);
	};

	const filtered = search
		? users.filter((u) =>
			u.nomUtilisateur.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase())
		)
		: users;
	const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
	const paged = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					<AdminListHeader title="Utilisateurs" subtitle="Gérez les comptes collaborateurs." onAction={handleCreate} />

					<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<AdminTableToolbar title="Tous les utilisateurs" count={filtered.length} search={search} onSearch={(value) => { setSearch(value); setPage(0); }} />

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="bg-gray-50/50 border-b border-gray-50">
										{['Utilisateur', 'Email', 'Rôle', 'Statut', 'Connexion', 'Actions'].map((column, index, columns) => (
											<th key={column} class={`px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${index === columns.length - 1 ? 'text-right' : ''}`}>{column}</th>
										))}
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									{paged.map((u) => (
										<tr key={u.id} onClick={() => openEdit(u)} class="cursor-pointer border-b border-outline-variant/30 transition-colors duration-150 hover:bg-primary/5">
											<td class="px-6 py-4 text-sm font-semibold text-gray-900">{u.nomUtilisateur}</td>
											<td class="px-6 py-4 text-sm text-gray-600">{u.email}</td>
											<td class="px-6 py-4"><span class="px-2 py-1 text-[11px] font-bold text-gray-600 bg-gray-100 rounded uppercase">{u.role}</span></td>
											<td class="px-6 py-4"><span class={`text-xs font-semibold ${u.actif ? 'text-green-600' : 'text-gray-400'}`}>{u.actif ? 'Actif' : 'Inactif'}</span></td>
											<td class="px-6 py-4 text-sm text-gray-600">{formatIsoDateTimeFr(u.derniereConnexion) || '—'}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button type="button" onClick={() => openEdit(u)} class="p-2 text-gray-400 hover:text-primary transition-colors" title="Modifier"><span class="material-symbols-outlined text-[18px]">edit</span></button>
													<button type="button" onClick={() => confirmDelete(u)} class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Supprimer"><span class="material-symbols-outlined text-[18px]">delete</span></button>
												</div>
											</td>
										</tr>
									))}
									{paged.length === 0 && (
										<tr><td colspan="6" class="px-6 py-12 text-center text-gray-400 text-sm">Aucun utilisateur trouvé.</td></tr>
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
			<ConfirmDialog open={confirm?.type === 'delete'} title="Supprimer l'utilisateur" message={`Supprimer définitivement l'utilisateur "${confirm?.user?.nomUtilisateur}" ?`} confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={executeDelete} onCancel={() => setConfirm(null)} />
			<ToastContainer toasts={toasts} onRemove={removeToast} />

			<FormModal
				open={showForm}
				title={editingUser ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
				submitLabel={editingUser ? 'Enregistrer' : 'Créer'}
				onClose={() => { setShowForm(false); setEditingUser(null); }}
				onSubmit={handleSubmit}
			>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="nomUtilisateur">Nom d'utilisateur</label>
					<input id="nomUtilisateur" name="nomUtilisateur" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required defaultValue={editingUser?.nomUtilisateur || ''} />
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="email">Email</label>
					<input id="email" name="email" type="email" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" required defaultValue={editingUser?.email || ''} />
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="role">Rôle</label>
					<select id="role" name="role" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" defaultValue={editingUser?.role || 'editeur'}>
						{roles.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
					</select>
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="motDePasse">Mot de passe</label>
					<input id="motDePasse" name="motDePasse" type="password" minLength="12" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={editingUser ? '••••••••' : '12 caractères minimum'} required={!editingUser} />
				</div>
			</FormModal>
		</div>
	);
}

