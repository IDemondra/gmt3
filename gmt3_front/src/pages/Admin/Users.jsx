import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { FormModal } from '../../components/admin/FormModal.jsx';
import { usersApi, createUserApi, updateUserApi, deleteUserApi } from '../../api/users.js';

const roles = ['admin', 'manager', 'editor', 'viewer'];

export function AdminUsers() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([]);
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; user?: import("../../stores/auth.js").currentUser extends infer U ? U : never } | null} */ (null));

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadUsers();
		});
	}, []);

	const loadUsers = async () => {
		try {
			const data = await usersApi(accessToken.value);
			// @ts-ignore
			if (Array.isArray(data)) setUsers(data);
		} catch { /* keep current list */ }
	};

	const handleSubmit = async (/** @type {{ get: (arg0: string) => any; }} */ data) => {
		try {
			if (editingUser) {
				const payload = { nomUtilisateur: data.get('nomUtilisateur'), email: data.get('email'), role: data.get('role') };
				const pwd = data.get('motDePasse');
				// @ts-ignore
				if (pwd) payload.motDePasse = pwd;
				// @ts-ignore
				const updated = await updateUserApi(accessToken.value, editingUser.id, payload);
				// @ts-ignore
				setUsers((prev) => prev.map((u) => u.id === editingUser.id ? updated : u));
			} else {
				const created = await createUserApi(accessToken.value, {
					nomUtilisateur: data.get('nomUtilisateur'),
					email: data.get('email'),
					role: data.get('role'),
					motDePasse: data.get('motDePasse'),
				});
				// @ts-ignore
				setUsers((prev) => [...prev, created]);
			}
			setShowForm(false);
			setEditingUser(null);
		} catch (e) {
			// @ts-ignore
			alert(e.message);
		}
	};

	const openEdit = (/** @type {import("preact/hooks").StateUpdater<null>} */ user) => {
		setEditingUser(user);
		setShowForm(true);
	};

	const handleCreate = () => {
		setEditingUser(null);
		setShowForm(true);
	};

	// @ts-ignore
	const confirmDelete = (/** @type {any} */ user) => setConfirm({ type: 'delete', user });
	const executeDelete = async () => {
		try {
			// @ts-ignore
			await deleteUserApi(accessToken.value, confirm.user.id);
			// @ts-ignore
			setUsers((prev) => prev.filter((u) => u.id !== confirm.user.id));
		} catch { /* ignore */ }
		setConfirm(null);
	};

	/**
     * @type {any[]}
     */
	const filtered = search
		? users.filter((u) =>
			// @ts-ignore
			u.nomUtilisateur.toLowerCase().includes(search.toLowerCase()) ||
			// @ts-ignore
			u.email.toLowerCase().includes(search.toLowerCase())
		)
		: users;

	const badge = (/** @type {string | number} */ role) => {
		const styles = {
			admin: 'bg-primary/10 text-primary border border-primary/20',
			manager: 'bg-amber-50 text-amber-700 border border-amber-200',
			editor: 'bg-blue-50 text-blue-700 border border-blue-200',
			viewer: 'bg-gray-100 text-gray-600 border border-gray-200',
		};
		// @ts-ignore
		return styles[role] || styles.viewer;
	};

	return (
		<div class="h-screen flex flex-col bg-background text-on-background font-body-md antialiased overflow-hidden">
			<Navbar 
// @ts-ignore
			user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main class="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
					{/* Header */}
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h1 class="font-h1 text-h1 text-on-background font-black uppercase tracking-tighter leading-none">
								Utilisateurs
							</h1>
							<p class="font-body-lg text-body-lg text-secondary mt-1.5">
								Gérez les comptes administrateurs, managers et éditeurs.
							</p>
						</div>
						<button
							onClick={handleCreate}
							class="bg-primary-container text-on-primary font-button text-button px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 font-bold"
						>
							<span class="material-symbols-outlined">add</span>
							Ajouter
						</button>
					</div>

					{/* Table card */}
					<div class="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden shadow-sm">
						<div class="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/20">
							<div>
								<h2 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight">
									Tous les utilisateurs
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
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="border-b border-outline-variant/20 bg-surface-container/30">
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Utilisateur</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Email</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Rôle</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Statut</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Dernière connexion</th>
										<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filtered.map((u, i) => (
										<tr key={u.id} class={`border-b border-outline-variant/30 transition-colors duration-150 ${i % 2 === 0 ? 'bg-transparent' : 'bg-surface-container/40'} hover:bg-primary/5`}>
											<td class="px-6 py-4">
												<div class="flex items-center gap-3">
													<div class="h-9 w-9 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
														<span class="material-symbols-outlined text-primary-container text-[18px]">person</span>
													</div>
													<span class="font-body-md text-body-md text-on-background font-semibold">{u.nomUtilisateur}</span>
												</div>
											</td>
											<td class="px-6 py-4 text-sm text-secondary">{u.email}</td>
											<td class="px-6 py-4">
												<span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${badge(u.role)}`}>
													{u.role.charAt(0).toUpperCase() + u.role.slice(1)}
												</span>
											</td>
											<td class="px-6 py-4">
												<span class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${u.actif ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
													<span class={`w-1.5 h-1.5 rounded-full ${u.actif ? 'bg-green-500' : 'bg-gray-400'}`} />
													{u.actif ? 'Actif' : 'Inactif'}
												</span>
											</td>
											<td class="px-6 py-4 text-sm text-secondary whitespace-nowrap">{u.derniereConnexion}</td>
											<td class="px-6 py-4 text-right">
												<div class="flex items-center justify-end gap-1">
													<button onClick={() => openEdit(u)} class="p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/5 transition-all" title="Modifier">
														<span class="material-symbols-outlined text-[20px]">edit</span>
													</button>
													<button onClick={() => confirmDelete(u)} class="p-2 rounded-lg text-secondary hover:text-error hover:bg-error/5 transition-all" title="Supprimer">
														<span class="material-symbols-outlined text-[20px]">delete</span>
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div class="p-4 border-t border-outline-variant/20 flex justify-between items-center gap-4">
							<span class="text-sm text-secondary">1-{filtered.length} sur {users.length}</span>
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

					<p class="mt-8 text-center text-xs text-secondary/50">
						GMT+3 Admin Panel &copy; {new Date().getFullYear()}
					</p>
				</main>
			</div>

			{/* Add/Edit dialog */}
			<FormModal
				open={showForm}
				title={editingUser ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
				submitLabel={editingUser ? 'Enregistrer' : 'Créer'}
				onClose={() => { setShowForm(false); setEditingUser(null); }}
				onSubmit={handleSubmit}
			>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="nomUtilisateur">Nom d'utilisateur</label>
					<input
						id="nomUtilisateur"
						name="nomUtilisateur"
						class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl"
						placeholder="ex: jdoe"
						required
						// @ts-ignore
						defaultValue={editingUser?.nomUtilisateur || ''}
					/>
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl"
						placeholder="ex: jdoe@gmt3.mg"
						required
						// @ts-ignore
						defaultValue={editingUser?.email || ''}
					/>
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="role">Rôle</label>
					<select
						id="role"
						name="role"
						class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background rounded-xl appearance-none cursor-pointer"
						// @ts-ignore
						defaultValue={editingUser?.role || 'editor'}
					>
						{roles.map((r) => (
							<option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
						))}
					</select>
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="motDePasse">
						{editingUser ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe'}
					</label>
					<input
						id="motDePasse"
						name="motDePasse"
						type="password"
						class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl"
						placeholder={editingUser ? '••••••••' : 'Mot de passe'}
						required={!editingUser}
					/>
				</div>
			</FormModal>

			{/* Confirm dialogs */}
			<ConfirmDialog
				// @ts-ignore
				open={confirm?.type === 'logout'}
				title="Déconnexion"
				message="Êtes-vous sûr de vouloir vous déconnecter ?"
				confirmLabel="Se déconnecter"
				icon="logout"
				onConfirm={confirmLogout}
				onCancel={() => setConfirm(null)}
			/>
			<ConfirmDialog
				// @ts-ignore
				open={confirm?.type === 'delete'}
				title="Supprimer l'utilisateur"
				// @ts-ignore
				message={`Supprimer définitivement l'utilisateur "${confirm?.user?.nomUtilisateur}" ?`}
				confirmLabel="Supprimer"
				icon="delete"
				variant="danger"
				onConfirm={executeDelete}
				onCancel={() => setConfirm(null)}
			/>
		</div>
	);
}
