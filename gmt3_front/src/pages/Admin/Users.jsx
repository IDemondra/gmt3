import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, logout, tryAutoRefresh } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { usersApi, createUserApi, updateUserApi, deleteUserApi } from '../../api/users.js';

const roles = ['admin', 'manager', 'editor', 'viewer'];

export function AdminUsers() {
	const { route } = useLocation();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState([
		{ id: 1, nomUtilisateur: 'admin', email: 'admin@gmt3.mg', role: 'admin', actif: true, derniereConnexion: '2026-05-30 14:32' },
		{ id: 2, nomUtilisateur: 'manager1', email: 'manager@gmt3.mg', role: 'manager', actif: true, derniereConnexion: '2026-05-29 09:15' },
		{ id: 3, nomUtilisateur: 'editor1', email: 'editor@gmt3.mg', role: 'editor', actif: true, derniereConnexion: '2026-05-28 16:45' },
		{ id: 4, nomUtilisateur: 'viewer1', email: 'viewer@gmt3.mg', role: 'viewer', actif: false, derniereConnexion: '2026-05-20 11:00' },
	]);
	const [showForm, setShowForm] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [form, setForm] = useState({ nomUtilisateur: '', email: '', role: 'editor', motDePasse: '' });
	const [confirm, setConfirm] = useState(null);

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadUsers();
		});
	}, []);

	const loadUsers = async () => {
		try {
			const data = await usersApi(accessToken.value);
			setUsers(data);
		} catch { /* keep current list */ }
	};

	const handleLogout = () => setConfirm({ type: 'logout' });
	const confirmLogout = async () => { await logout(); route('/admin', true); };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingUser) {
				const payload = { nomUtilisateur: form.nomUtilisateur, email: form.email, role: form.role };
				if (form.motDePasse) payload.motDePasse = form.motDePasse;
				const updated = await updateUserApi(accessToken.value, editingUser.id, payload);
				setUsers((prev) => prev.map((u) => u.id === editingUser.id ? updated : u));
			} else {
				const created = await createUserApi(accessToken.value, form);
				setUsers((prev) => [...prev, created]);
			}
			setShowForm(false);
			setEditingUser(null);
			setForm({ nomUtilisateur: '', email: '', role: 'editor', motDePasse: '' });
		} catch (e) {
			alert(e.message);
		}
	};

	const openEdit = (user) => {
		setEditingUser(user);
		setForm({ nomUtilisateur: user.nomUtilisateur, email: user.email, role: user.role, motDePasse: '' });
		setShowForm(true);
	};

	const confirmDelete = (user) => setConfirm({ type: 'delete', user });
	const executeDelete = async () => {
		try {
			await deleteUserApi(accessToken.value, confirm.user.id);
			setUsers((prev) => prev.filter((u) => u.id !== confirm.user.id));
		} catch { /* ignore */ }
		setConfirm(null);
	};

	const filtered = search
		? users.filter((u) =>
			u.nomUtilisateur.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase())
		)
		: users;

	const badge = (role) => {
		const styles = {
			admin: 'bg-primary/10 text-primary border border-primary/20',
			manager: 'bg-amber-50 text-amber-700 border border-amber-200',
			editor: 'bg-blue-50 text-blue-700 border border-blue-200',
			viewer: 'bg-gray-100 text-gray-600 border border-gray-200',
		};
		return styles[role] || styles.viewer;
	};

	return (
		<div class="h-screen flex flex-col bg-background text-on-background font-body-md antialiased overflow-hidden">
			<Navbar user={currentUser.value} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

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
							onClick={() => { setEditingUser(null); setForm({ nomUtilisateur: '', email: '', role: 'editor', motDePasse: '' }); setShowForm(true); }}
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
			{showForm && (
				<div class="fixed inset-0 z-50 flex items-center justify-center">
					<div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
					<div class="relative bg-surface rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 border border-outline-variant/30">
						<h3 class="font-h3 text-h3 text-on-background font-black uppercase tracking-tight mb-6">
							{editingUser ? 'Modifier' : 'Ajouter'} un utilisateur
						</h3>
						<form onSubmit={handleSubmit} class="space-y-5">
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2">Nom d'utilisateur</label>
								<input
									class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl"
									placeholder="ex: jdoe"
									required
									value={form.nomUtilisateur}
									onInput={(e) => setForm({ ...form, nomUtilisateur: e.currentTarget.value })}
								/>
							</div>
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2">Email</label>
								<input
									type="email"
									class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl"
									placeholder="ex: jdoe@gmt3.mg"
									required
									value={form.email}
									onInput={(e) => setForm({ ...form, email: e.currentTarget.value })}
								/>
							</div>
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2">Rôle</label>
								<select
									class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background rounded-xl appearance-none cursor-pointer"
									value={form.role}
									onChange={(e) => setForm({ ...form, role: e.currentTarget.value })}
								>
									{roles.map((r) => (
										<option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
									))}
								</select>
							</div>
							<div>
								<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2">
									{editingUser ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe'}
								</label>
								<input
									type="password"
									class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl"
									placeholder={editingUser ? '••••••••' : 'Mot de passe'}
									required={!editingUser}
									value={form.motDePasse}
									onInput={(e) => setForm({ ...form, motDePasse: e.currentTarget.value })}
								/>
							</div>
							<div class="flex justify-end gap-3 pt-2">
								<button type="button" onClick={() => { setShowForm(false); setEditingUser(null); }} class="px-6 py-3 rounded-xl border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all font-button text-button">
									Annuler
								</button>
								<button type="submit" class="px-6 py-3 rounded-xl bg-primary-container text-on-primary font-button text-button hover:shadow-xl hover:shadow-primary/20 transition-all font-bold">
									{editingUser ? 'Enregistrer' : 'Créer'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Confirm dialogs */}
			<ConfirmDialog
				open={confirm?.type === 'logout'}
				title="Déconnexion"
				message="Êtes-vous sûr de vouloir vous déconnecter ?"
				confirmLabel="Se déconnecter"
				icon="logout"
				onConfirm={confirmLogout}
				onCancel={() => setConfirm(null)}
			/>
			<ConfirmDialog
				open={confirm?.type === 'delete'}
				title="Supprimer l'utilisateur"
				message={`Supprimer définitivement l'utilisateur "${confirm?.user?.nomUtilisateur}" ?`}
				confirmLabel="Supprimer"
				icon="delete"
				confirmClass="bg-error text-on-error"
				onConfirm={executeDelete}
				onCancel={() => setConfirm(null)}
			/>
		</div>
	);
}
