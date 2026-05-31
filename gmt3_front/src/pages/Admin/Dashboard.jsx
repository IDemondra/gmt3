import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { KpiCards } from '../../components/admin/KpiCards.jsx';
import { EventRow } from '../../components/admin/EventRow.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { FormModal } from '../../components/admin/FormModal.jsx';
import { evenementsApi, createEvenementApi, updateEvenementApi, deleteEvenementApi } from '../../api/evenements.js';

export function AdminDashboard() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);
	const [previewSrc, setPreviewSrc] = useState('');
	const [uploading, setUploading] = useState(false);
	const [confirm, setConfirm] = useState(null); // { type: 'logout' | 'delete-event', eventId?: number }
	const [events, setEvents] = useState([]);

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadEvents();
		});
	}, []);

	const loadEvents = async () => {
		try {
			const data = await evenementsApi(accessToken.value);
			if (Array.isArray(data)) {
				// @ts-ignore
				setEvents(data.map((e) => ({ ...e, title: e.titre, date: e.dateEvenement, published: e.estPublie })));
			}
		} catch { /* keep current */ }
	};

	const handleCreate = () => { setEditingEvent(null); setPreviewSrc(''); setShowForm(true); };

	// @ts-ignore
	const handleEdit = (event) => {
		setEditingEvent(event);
		setShowForm(true);
	};

	// @ts-ignore
	const handleSubmit = async (data) => {
		try {
			setUploading(true);
			const fd = new FormData();
			fd.set('titre', data.get('titre'));
			fd.set('description', data.get('description') || '');
			fd.set('dateEvenement', data.get('dateEvenement'));
			fd.set('lieu', data.get('lieu') || '');
			fd.set('estPublie', data.get('estPublie') === 'on' ? 'on' : '');

			const imageFile = data.get('imagePrincipale');
			if (imageFile && imageFile.size > 0) {
				const ext = imageFile.name.split('.').pop().toLowerCase();
				if (!['jpg', 'jpeg', 'png'].includes(ext)) {
					alert('Format accepté : .jpg, .jpeg, .png uniquement');
					setUploading(false);
					return;
				}
				fd.set('imagePrincipale', imageFile);
			}

		if (editingEvent) {
			const updated = await updateEvenementApi(accessToken.value, editingEvent.id, fd);
			setEvents((prev) => prev.map((e) => e.id === editingEvent.id ? { ...updated, title: updated.titre, date: updated.dateEvenement, published: updated.estPublie } : e));
		} else {
			const created = await createEvenementApi(accessToken.value, fd);
			setEvents((prev) => [...prev, { ...created, title: created.titre, date: created.dateEvenement, published: created.estPublie }]);
		}
		setShowForm(false);
		setEditingEvent(null);
	} catch (e) {
		// @ts-ignore
		alert(e.message);
	}
};

// @ts-ignore
const fileToBase64 = (file) => new Promise((resolve, reject) => {
	const r = new FileReader();
	r.onload = () => resolve(r.result);
	r.onerror = reject;
	r.readAsDataURL(file);
});

	// @ts-ignore
	const confirmDeleteEvent = async (eventId) => {
		try {
			await deleteEvenementApi(accessToken.value, eventId);
			// @ts-ignore
			setEvents((prev) => prev.filter((e) => e.id !== eventId));
		} catch { /* ignore */ }
		setConfirm(null);
	};

	// @ts-ignore
	const filtered = search
		// @ts-ignore
		? events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
		: events;

	return (
		<div class="h-screen flex flex-col bg-background text-on-background font-body-md antialiased overflow-hidden">
			<Navbar 
// @ts-ignore
			user={currentUser.value} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

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
						<button onClick={handleCreate} class="bg-primary-container text-on-primary font-button text-button px-6 py-3.5 rounded-xl hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 font-bold">
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
										// @ts-ignore
										<EventRow key={event.id} event={event} index={i} onEdit={handleEdit} onDelete={(id) => setConfirm({ type: 'delete-event', eventId: id })} />
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
				// @ts-ignore
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
				// @ts-ignore
				open={confirm?.type === 'delete-event'}
				title="Supprimer l'événement"
				message="Cette action est irréversible. L'événement sera définitivement supprimé."
				confirmLabel="Supprimer"
				icon="delete"
				variant="danger"
				// @ts-ignore
				onConfirm={() => confirmDeleteEvent(confirm?.eventId)}
				onCancel={() => setConfirm(null)}
			/>

			<FormModal
				open={showForm}
				title={editingEvent ? "Modifier l'événement" : 'Ajouter un événement'}
				submitLabel={editingEvent ? 'Enregistrer' : 'Créer'}
				onClose={() => { setShowForm(false); setEditingEvent(null); setPreviewSrc(''); }}
				onSubmit={handleSubmit}
				encType="multipart/form-data"
			>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="titre">Titre</label>
					<input id="titre" name="titre" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" placeholder="Nom de l'événement" required defaultValue={editingEvent?.
// @ts-ignore
					title || ''} />
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="description">Description</label>
					<textarea id="description" name="description" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl resize-none" 
// @ts-ignore
					rows="3" placeholder="Description courte..." defaultValue={editingEvent?.description || ''} />
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="dateEvenement">Date</label>
					<input id="dateEvenement" name="dateEvenement" type="date" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" required defaultValue={editingEvent?.
// @ts-ignore
					dateEvenement || ''} />
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="lieu">Lieu</label>
					<input id="lieu" name="lieu" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" placeholder="ex: Parc National de Ranomafana" defaultValue={editingEvent?.
// @ts-ignore
					lieu || ''} />
				</div>
				<div>
					<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="imagePrincipale">
						Image principale (jpg, jpeg, png) {uploading && <span class="ml-2 text-primary-container animate-pulse">Uploading…</span>}
					</label>
					<input
						id="imagePrincipale"
						name="imagePrincipale"
						type="file"
						accept=".jpg,.jpeg,.png"
						class="w-full px-4 py-2.5 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background rounded-xl file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-primary-container file:text-on-primary file:font-button file:text-button file:cursor-pointer hover:file:brightness-110"
						onInput={(e) => {
							const f = e.currentTarget.files?.[0];
							if (f) setPreviewSrc(URL.createObjectURL(f));
						}}
					/>
					{previewSrc && (
						<div class="mt-3 relative rounded-xl overflow-hidden border border-outline-variant/30">
							<img src={previewSrc} alt="Aperçu" class="w-full h-40 object-cover" />
							<button type="button" onClick={() => { setPreviewSrc(''); const inp = document.getElementById('imagePrincipale'); if (inp) inp.
// @ts-ignore
							value = ''; }} class="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-all" title="Supprimer">
								<span class="material-symbols-outlined text-[18px]">close</span>
							</button>
						</div>
					)}
				</div>
				<div>
					<label class="flex items-center gap-2 cursor-pointer">
						<input id="estPublie" name="estPublie" type="checkbox" class="w-5 h-5 rounded border-outline-variant/30 text-primary-container focus:ring-primary-container/10" defaultChecked={editingEvent ? editingEvent.
// @ts-ignore
						published : true} />
						<span class="font-body-md text-body-md text-on-background">Publier immédiatement</span>
					</label>
				</div>
			</FormModal>
		</div>
	);
}
