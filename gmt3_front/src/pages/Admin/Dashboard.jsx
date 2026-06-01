import { useEffect, useState, useRef } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { KpiCards } from '../../components/admin/KpiCards.jsx';
import { EventRow } from '../../components/admin/EventRow.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
import { FormModal } from '../../components/admin/FormModal.jsx';
import { evenementsApi, createEvenementApi, updateEvenementApi, deleteEvenementApi } from '../../api/evenements.js';
import { kpisApi } from '../../api/kpis.js';
import { handleDigitKeyDown, getDigitsValue } from '../../utils/digits.js';

const DESC_MAX = 1000;

const toDateInputValue = (date = new Date()) => {
	const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return offsetDate.toISOString().slice(0, 10);
};

const toTimeInputValue = (date = new Date()) => date.toTimeString().slice(0, 5);

export function AdminDashboard() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);
	const [previewSrc, setPreviewSrc] = useState('');
	const [galleryPreviewSrcs, setGalleryPreviewSrcs] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; eventId?: number } | null} */ (null));
	const [events, setEvents] = useState([]);
	const [kpis, setKpis] = useState({ totalEvents: 0, totalReservations: 0, limitedEvents: 0 });
	const [descText, setDescText] = useState('');
	const descRef = useRef(null);
	const [previewImage, setPreviewImage] = useState(/** @type {{ url: string; title: string } | null} */ (null));
	const todayStr = toDateInputValue();
	const currentTimeStr = toTimeInputValue();

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadDashboardData();
		});
	}, []);

	const loadDashboardData = async () => {
		try {
			const [evtData, kpiData] = await Promise.all([
				evenementsApi(accessToken.value),
				kpisApi(accessToken.value),
			]);
			if (Array.isArray(evtData)) {
				// @ts-ignore
				setEvents(evtData.map((e) => ({ ...e, title: e.titre, date: e.dateEvenement, published: e.estPublie })));
			}
			if (kpiData && typeof kpiData.totalEvents === 'number') setKpis(kpiData);
		} catch { /* keep current */ }
	};

	const handleCreate = () => { setEditingEvent(null); setPreviewSrc(''); setGalleryPreviewSrcs([]); setShowForm(true); };

	// @ts-ignore
	const handleEdit = (event) => {
		setEditingEvent(event);
		setPreviewSrc('');
		setGalleryPreviewSrcs([]);
		setShowForm(true);
	};

	// @ts-ignore
	const handleSubmit = async (data) => {
		try {
			setUploading(true);
			const fd = new FormData();
			fd.set('titre', data.get('titre'));
			fd.set('description', data.get('description') || '');
			fd.set('dateEvenement', data.get('dateEvenement') || data.get('dateDepart') || todayStr);
			fd.set('lieu', data.get('lieu') || '');
			fd.set('prix', data.get('prix') || '');
			fd.set('heureDepart', data.get('heureDepart') || currentTimeStr);
			fd.set('dateDepart', data.get('dateDepart') || '');
			fd.set('heureRetour', data.get('heureRetour') || currentTimeStr);
			fd.set('dateRetour', data.get('dateRetour') || '');
			fd.set('estPublie', data.get('estPublie') === 'on' ? 'on' : '');

			const imageFile = data.get('imagePrincipale');
			if (imageFile && imageFile.size > 0) {
				const ext = imageFile.name.split('.').pop().toLowerCase();
				if (!['jpg', 'jpeg', 'png'].includes(ext)) {
					alert('Format accepté : .jpg, .jpeg, .png uniquement');
					return;
				}
				fd.set('imagePrincipale', imageFile);
			}

			const galleryFiles = data.getAll('photosEvenement').filter((file) => file && file.size > 0);
			for (const file of galleryFiles) {
				fd.append('photosEvenement', file);
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
		} finally {
			setUploading(false);
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
		<>
			<div class="h-screen flex flex-col bg-background text-on-background font-body-md antialiased overflow-hidden">
			<Navbar
	// @ts-ignore
				user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

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

						<KpiCards totalEvents={kpis.totalEvents} totalReservations={kpis.totalReservations} limitedEvents={kpis.limitedEvents} />

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
											<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Départ — Retour</th>
											<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Prix</th>
											<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest">Statut</th>
											<th class="px-6 py-4 font-label-caps text-label-caps text-secondary uppercase tracking-widest text-right">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filtered.map((event, i) => (
											// @ts-ignore
											<EventRow key={event.id} event={event} index={i} onEdit={handleEdit} onDelete={(id) => setConfirm({ type: 'delete-event', eventId: id })} onImageClick={(url) => setPreviewImage({ url, title: event.title })} />
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
						onClose={() => { setShowForm(false); setEditingEvent(null); setPreviewSrc(''); setGalleryPreviewSrcs([]); }}
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
						<div class="flex items-center gap-1 mb-2">
							<button type="button" onClick={() => {
								const ta = descRef.current;
								if (!ta) return;
								const start = ta.selectionStart;
								const end = ta.selectionEnd;
								const txt = ta.value;
								const sel = txt.slice(start, end);
								const wrap = sel ? `**${sel}**` : '****';
								const pos = sel ? end + 4 : start + 2;
								const next = txt.slice(0, start) + wrap + txt.slice(end);
								if (next.length <= DESC_MAX) {
									ta.value = next;
									setDescText(next);
									ta.focus();
									ta.setSelectionRange(pos, pos);
								}
							}} class="p-1.5 rounded-lg border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all text-xs font-bold" title="Gras">B</button>
							<button type="button" onClick={() => {
								const ta = descRef.current;
								if (!ta) return;
								const start = ta.selectionStart;
								const end = ta.selectionEnd;
								const txt = ta.value;
								const sel = txt.slice(start, end);
								const wrap = sel ? `*${sel}*` : '**';
								const pos = sel ? end + 2 : start + 1;
								const next = txt.slice(0, start) + wrap + txt.slice(end);
								if (next.length <= DESC_MAX) {
									ta.value = next;
									setDescText(next);
									ta.focus();
									ta.setSelectionRange(pos, pos);
								}
							}} class="p-1.5 rounded-lg border border-outline-variant/30 text-secondary hover:text-on-background hover:bg-surface-container transition-all text-xs italic font-serif" title="Italique">I</button>
							<span class="ml-auto text-xs text-secondary">{descText.length}/{DESC_MAX}</span>
						</div>
						<textarea id="description" name="description" ref={descRef}
							class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl resize-none"
	// @ts-ignore
							rows="3" placeholder="Description courte..." maxLength={DESC_MAX}
							onInput={(e) => { setDescText(e.currentTarget.value); }}
							defaultValue={editingEvent?.description || ''} />
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="dateDepart">Date départ</label>
							<input id="dateDepart" name="dateDepart" type="date" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" min={todayStr} defaultValue={editingEvent?.
	// @ts-ignore
							dateDepart || todayStr} />
						</div>
						<div>
							<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="heureDepart">Heure départ</label>
							<input id="heureDepart" name="heureDepart" type="time" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" defaultValue={editingEvent?.
	// @ts-ignore
							heureDepart || currentTimeStr} />
						</div>
						<div>
							<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="dateRetour">Date retour</label>
							<input id="dateRetour" name="dateRetour" type="date" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" min={todayStr} defaultValue={editingEvent?.
	// @ts-ignore
							dateRetour || todayStr} />
						</div>
						<div>
							<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="heureRetour">Heure retour</label>
							<input id="heureRetour" name="heureRetour" type="time" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" defaultValue={editingEvent?.
	// @ts-ignore
							heureRetour || currentTimeStr} />
						</div>
					</div>
					<div>
						<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="lieu">Lieu</label>
						<input id="lieu" name="lieu" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" placeholder="ex: Parc National de Ranomafana" defaultValue={editingEvent?.
	// @ts-ignore
						lieu || ''} />
					</div>
					<div>
						<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="prix">Prix par place (Ar)</label>
						<input id="prix" name="prix" type="text" inputMode="numeric" class="w-full px-4 py-3 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background placeholder-secondary rounded-xl" placeholder="ex: 150000" defaultValue={editingEvent?.
	// @ts-ignore
							prix ?? ''} onKeyDown={handleDigitKeyDown} onInput={(e) => { e.currentTarget.value = getDigitsValue(e); }} />
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
							<label class="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-2" for="photosEvenement">
								Galerie photos
							</label>
							<input
								id="photosEvenement"
								name="photosEvenement"
								type="file"
								multiple
								accept=".jpg,.jpeg,.png"
								class="w-full px-4 py-2.5 bg-background border border-outline-variant/30 focus:border-primary-container/40 focus:ring-2 focus:ring-primary-container/10 outline-none transition-all font-body-md text-body-md text-on-background rounded-xl file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-primary-container file:text-on-primary file:font-button file:text-button file:cursor-pointer hover:file:brightness-110"
								onInput={(e) => {
									const files = Array.from(e.currentTarget.files || []);
									setGalleryPreviewSrcs(files.map((file) => URL.createObjectURL(file)).slice(0, 10));
								}}
							/>
							<p class="mt-2 text-sm text-secondary">Ajoute 5 a 10 images pour le detail public de l'evenement.</p>
							{galleryPreviewSrcs.length > 0 && (
								<div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
									{galleryPreviewSrcs.map((src, index) => (
										<div key={`${src}-${index}`} class="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container">
											<img src={src} alt={`Aperçu galerie ${index + 1}`} class="h-24 w-full object-cover" />
										</div>
									))}
								</div>
							)}
						</div>
						<div>
							<label class="group flex items-center justify-between gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container/40 px-4 py-3 cursor-pointer transition-all duration-200 hover:border-primary-container/45 hover:bg-surface-container/70">
							<span class="flex flex-col">
								<span class="font-body-md text-body-md text-on-background font-semibold">Publier immédiatement</span>
								<span class="text-sm text-secondary">Active la visibilité publique dès l'enregistrement.</span>
							</span>
							<span class="relative inline-flex h-8 w-14 shrink-0 items-center">
								<input id="estPublie" name="estPublie" type="checkbox" role="switch" class="peer sr-only" defaultChecked={editingEvent ? editingEvent.
	// @ts-ignore
								published : true} />
								<span class="absolute inset-0 rounded-full bg-outline-variant/40 shadow-inner transition-all duration-300 peer-checked:bg-primary-container peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface" />
								<span class="absolute left-1 h-6 w-6 rounded-full bg-white shadow-[0_6px_16px_rgba(0,0,0,0.24)] transition-all duration-300 peer-checked:translate-x-6 peer-checked:shadow-[0_8px_20px_rgba(0,0,0,0.32)]" />
								<span class="material-symbols-outlined pointer-events-none absolute right-2 text-[14px] text-on-primary opacity-0 transition-opacity duration-200 peer-checked:opacity-100">check</span>
							</span>
						</label>
					</div>
				</FormModal>
				</div>

				{/* ── Image preview modal ── */}
				<ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} />
			</>
		);
	}
