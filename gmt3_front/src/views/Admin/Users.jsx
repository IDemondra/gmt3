import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { FormModal } from '../../components/admin/FormModal.jsx';
import { usersApi, createUserApi, updateUserApi, deleteUserApi } from '../../api/users.js';
import { formatIsoDateTimeFr } from '../../utils/dateFormatter.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';

const roles = ['admin', 'editeur'];

export function AdminUsers() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const { toasts, addToast, removeToast } = useToast();
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; user?: any } | null} */ (null));

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			if (currentUser.value.role !== 'admin') { route('/admin/dashboard', true); return; }
			loadUsers();
		});
	}, []);

	const loadUsers = async () => {
		try {
			const response = await usersApi(accessToken.value);
			if (Array.isArray(response.data)) setUsers(response.data);
		} catch {
			addToast('Impossible de charger les utilisateurs', 'error');
		}
	};

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

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
						<div>
							<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Utilisateurs</h1>
							<p class="text-gray-500 mt-2 text-base">Gérez les comptes collaborateurs.</p>
						</div>
						<button type="button" onClick={handleCreate} class="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer">
							<span class="material-symbols-outlined text-[20px]">add</span> Ajouter
						</button>
					</div>

					<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-50">
							<div class="flex items-center gap-3">
								<h2 class="text-base font-bold text-gray-900">Tous les utilisateurs</h2>
								<span class="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[11px] font-bold border border-gray-100">{filtered.length}</span>
							</div>
							<div class="relative w-full sm:w-auto">
								<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
								<input class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 w-full sm:w-72 rounded-lg" aria-label="Rechercher" placeholder="Rechercher..." type="text" value={search} onInput={(e) => setSearch(e.currentTarget.value)} />
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="bg-gray-50/50 border-b border-gray-50">
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Utilisateur</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rôle</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Connexion</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									{filtered.map((u, i) => (
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
								</tbody>
							</table>
						</div>
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

