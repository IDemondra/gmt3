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
import { evenementsApi, evenementApi, createEvenementApi, updateEvenementApi, deleteEvenementApi } from '../../api/evenements.js';
import { kpisApi } from '../../api/kpis.js';
import { handleDigitKeyDown, getDigitsValue } from '../../utils/digits.js';
import { applyFormatting } from '../../utils/textFormatter.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';
import { EventDetailModal } from '../../components/admin/EventDetailModal.jsx';

const DESC_MAX = 1000;

const toDateInputValue = (date = new Date()) => {
	if (typeof date === 'string') {
		if (!date) return toDateInputValue();
		return date.includes('-') ? date.split(' ')[0] : date.split('/').reverse().join('-');
	}
	if (!(date instanceof Date) || isNaN(date)) {
		return toDateInputValue();
	}
	const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	return offsetDate.toISOString().slice(0, 10);
};

const toTimeInputValue = (date = new Date()) => date.toTimeString().slice(0, 5);

export function AdminDashboard() {
	const { route } = useLocation();
	const { handleLogout, confirmLogout } = useLogout(() => route('/admin', true));
	const { toasts, addToast, removeToast } = useToast();
	const promptLogout = () => setConfirm({ type: 'logout' });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);
	const [previewSrc, setPreviewSrc] = useState('');
	const [galleryPreviewSrcs, setGalleryPreviewSrcs] = useState([]);
	const [galleryFiles, setGalleryFiles] = useState([]);
	const [uploading, setUploading] = useState(false);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; eventId?: number } | null} */ (null));
	const [events, setEvents] = useState([]);
	const [kpis, setKpis] = useState({ totalEvents: 0, totalReservations: 0, limitedEvents: 0 });
	const [descText, setDescText] = useState('');
	const descRef = useRef(null);
	const [previewImage, setPreviewImage] = useState(/** @type {{ url: string; title: string } | null} */ (null));
	const [detailEvent, setDetailEvent] = useState(null);
	const [detailLoading, setDetailLoading] = useState(false);
	const [detailError, setDetailError] = useState(null);
	const todayStr = toDateInputValue();
	const currentTimeStr = toTimeInputValue();

	const removeGalleryItem = (indexToRemove) => {
		setGalleryFiles((current) => current.filter((_, index) => index !== indexToRemove));
		setGalleryPreviewSrcs((current) => {
			const next = current.filter((_, index) => index !== indexToRemove);
			return next;
		});
	};

	const handleViewDetails = async (event) => {
		setDetailError(null);
		setDetailLoading(true);
		setDetailEvent({ ...event, photosEvenement: event.photosEvenement || [] });
		try {
			const detail = await evenementApi(accessToken.value, event.id);
			setDetailEvent(detail);
		} catch (error) {
			setDetailError(error?.message || 'Impossible de charger le détail de l’événement');
		} finally {
			setDetailLoading(false);
		}
	};

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
			if (Array.isArray(evtData.data)) {
				setEvents(evtData.data.map((e) => ({ ...e, title: e.titre, date: e.dateEvenement, published: e.estPublie })));
			}
			if (kpiData?.data && typeof kpiData.data.totalEvents === 'number') setKpis(kpiData.data);
		} catch { /* keep current */ }
	};

	const handleCreate = () => { setEditingEvent(null); setPreviewSrc(''); setDescText(''); setGalleryPreviewSrcs([]); setGalleryFiles([]); setShowForm(true); };

	const handleEdit = (event) => {
		setEditingEvent(event);
		setDescText(event.description || '');
		setPreviewSrc(event.imagePrincipale ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}${event.imagePrincipale}` : '');
		setGalleryPreviewSrcs((event.photosEvenement || []).map((p) => `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}${p.url}`));
		setGalleryFiles([]);
		setShowForm(true);
	};

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
					addToast('Format accepté : .jpg, .jpeg, .png uniquement', 'warning');
					return;
				}
				fd.set('imagePrincipale', imageFile);
			}

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
			setGalleryFiles([]);
			setGalleryPreviewSrcs([]);
		} catch (e) {
			addToast((e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement'), 'error');
		} finally {
			setUploading(false);
		}
	};

	const confirmDeleteEvent = async (eventId) => {
		try {
			await deleteEvenementApi(accessToken.value, eventId);
			setEvents((prev) => prev.filter((e) => e.id !== eventId));
		} catch { /* ignore */ }
		setConfirm(null);
	};

	const filtered = search
		? events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
		: events;

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					{/* ── Header ── */}
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
						<div>
							<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
								Événements
							</h1>
							<p class="text-gray-500 mt-2 text-base">
								Gérez vos expéditions et destinations.
							</p>
						</div>
						<button onClick={handleCreate} class="bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer">
							<span class="material-symbols-outlined text-[20px]">add</span>
							Nouveau
						</button>
					</div>

					<KpiCards totalEvents={kpis.totalEvents} totalReservations={kpis.totalReservations} limitedEvents={kpis.limitedEvents} />

					{/* ── Table Container ── */}
					<div class="mt-10 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
						<div class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-gray-50">
							<div class="flex items-center gap-3">
								<h2 class="text-base font-bold text-gray-900">
									Toutes les expéditions
								</h2>
								<span class="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[11px] font-bold border border-gray-100">{filtered.length}</span>
							</div>
							<div class="flex items-center gap-3 w-full sm:w-auto">
								<div class="relative flex-1 sm:flex-initial">
									<span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
									<input
										class="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 w-full sm:w-72 rounded-lg"
										placeholder="Rechercher..."
										type="text"
										value={search}
										onInput={(e) => setSearch(e.currentTarget.value)}
									/>
								</div>
								<button class="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
									<span class="material-symbols-outlined text-[20px]">filter_list</span>
								</button>
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="bg-gray-50/50 border-b border-gray-50">
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Référence</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Titre</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Calendrier</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Prix</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
										<th class="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									{filtered.map((event, i) => (
										<EventRow key={event.id} event={event} index={i} onEdit={handleEdit} onDelete={(id) => setConfirm({ type: 'delete-event', eventId: id })} onImageClick={(url) => setPreviewImage({ url, title: event.title })} onViewDetails={handleViewDetails} />
									))}
								</tbody>
							</table>
						</div>

						<div class="p-4 border-t border-gray-50 flex justify-between items-center gap-4 bg-gray-50/20">
							<span class="text-xs text-gray-400 font-medium">Affichage de {filtered.length} résultats</span>
							<div class="flex gap-2">
								<button class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled>
									<span class="material-symbols-outlined text-[18px]">chevron_left</span>
								</button>
								<button class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled>
									<span class="material-symbols-outlined text-[18px]">chevron_right</span>
								</button>
							</div>
						</div>
					</div>

					{/* ── Footer ── */}
					<p class="mt-12 text-center text-[11px] text-gray-300 font-bold tracking-widest uppercase">
						GMT+3 Admin Panel — Fianarantsoa
					</p>
				</main>
			</div>

			{/* ── Confirm dialogs ── */}
			<ConfirmDialog
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
				open={confirm?.type === 'delete-event'}
				title="Supprimer l'événement"
				message="Cette action est irréversible. L'événement sera définitivement supprimé."
				confirmLabel="Supprimer"
				icon="delete"
				variant="danger"
				onConfirm={() => confirmDeleteEvent(confirm?.eventId)}
				onCancel={() => setConfirm(null)}
			/>

			<FormModal
				open={showForm}
				title={editingEvent ? "Modifier l'événement" : 'Ajouter un événement'}
				submitLabel={editingEvent ? 'Enregistrer' : 'Créer'}
				onClose={() => { setShowForm(false); setEditingEvent(null); setPreviewSrc(''); setGalleryPreviewSrcs([]); setGalleryFiles([]); }}
				onSubmit={handleSubmit}
				encType="multipart/form-data"
			>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="titre">Titre</label>
					<input id="titre" name="titre" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Nom de l'événement" required defaultValue={editingEvent?.titre || editingEvent?.title || ''} />
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="description">Description</label>
					<div class="border border-gray-100 rounded-lg overflow-hidden">
						<div class="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-100">
							<button type="button" onClick={() => applyFormatting(descRef.current, '**', '**')} class="p-2 rounded hover:bg-white transition-colors text-sm font-bold text-gray-700" title="Gras">
								<span class="material-symbols-outlined text-[18px]">format_bold</span>
							</button>
							<button type="button" onClick={() => applyFormatting(descRef.current, '*', '*')} class="p-2 rounded hover:bg-white transition-colors text-sm italic text-gray-700" title="Italique">
								<span class="material-symbols-outlined text-[18px]">format_italic</span>
							</button>
							<button type="button" onClick={() => applyFormatting(descRef.current, '~~', '~~')} class="p-2 rounded hover:bg-white transition-colors text-sm line-through text-gray-700" title="Barré">
								<span class="material-symbols-outlined text-[18px]">strikethrough_s</span>
							</button>
							<div class="w-px h-6 bg-gray-200 mx-1" />
							<button type="button" onClick={() => applyFormatting(descRef.current, '# ', '')} class="p-2 rounded hover:bg-white transition-colors text-sm font-bold text-gray-700" title="Titre">
								<span class="material-symbols-outlined text-[18px]">title</span>
							</button>
						</div>
						<textarea id="description" name="description" ref={descRef} class="w-full px-4 py-2.5 bg-white border-0 outline-none focus:ring-2 focus:ring-primary/20 focus:ring-inset" rows="3" placeholder="Description courte... (Markdown supporté)" maxLength={DESC_MAX} onInput={(e) => { setDescText(e.currentTarget.value); }} defaultValue={editingEvent?.description || ''} value={descText || editingEvent?.description || ''} />
					</div>
					<p class="text-[10px] text-gray-400 mt-1">Supporte le markdown: **gras**, *italique*, ~~barré~~</p>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="dateDepart">Date départ</label>
						<input id="dateDepart" name="dateDepart" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" min={todayStr} defaultValue={editingEvent?.dateDepart ? toDateInputValue(editingEvent.dateDepart) : todayStr} />
					</div>
					<div>
						<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="heureDepart">Heure départ</label>
						<input id="heureDepart" name="heureDepart" type="time" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" defaultValue={editingEvent?.heureDepart || currentTimeStr} />
					</div>
					<div>
						<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="dateRetour">Date retour</label>
						<input id="dateRetour" name="dateRetour" type="date" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" min={todayStr} defaultValue={editingEvent?.dateRetour ? toDateInputValue(editingEvent.dateRetour) : todayStr} />
					</div>
					<div>
						<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="heureRetour">Heure retour</label>
						<input id="heureRetour" name="heureRetour" type="time" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" defaultValue={editingEvent?.heureRetour || currentTimeStr} />
					</div>
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="lieu">Lieu</label>
					<input id="lieu" name="lieu" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="ex: Parc National de Ranomafana" defaultValue={editingEvent?.lieu || editingEvent?.location || ''} />
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="prix">Prix par place (Ar)</label>
					<input id="prix" name="prix" type="text" inputMode="numeric" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="ex: 150000" defaultValue={editingEvent?.prix ?? editingEvent?.price ?? ''} onKeyDown={handleDigitKeyDown} onInput={(e) => { e.currentTarget.value = getDigitsValue(e); }} />
				</div>
				<div class="flex items-center gap-3">
					<input id="estPublie" name="estPublie" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20 cursor-pointer" defaultChecked={editingEvent?.estPublie || editingEvent?.published || false} />
					<label for="estPublie" class="text-sm text-gray-700 font-medium cursor-pointer">Publié</label>
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2" for="imagePrincipale">
						Image principale (jpg, jpeg, png)
					</label>
					<input id="imagePrincipale" name="imagePrincipale" type="file" accept=".jpg,.jpeg,.png" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container" onInput={(e) => { const f = e.currentTarget.files?.[0]; if (f) setPreviewSrc(URL.createObjectURL(f)); }} />
					{previewSrc && (
						<div class="mt-4 rounded-lg overflow-hidden border border-gray-100">
							<img src={previewSrc} alt="Aperçu" class="max-h-48 object-cover w-full" />
						</div>
					)}
				</div>
				<div>
					<label class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-2">
						Galerie photos (optionnel)
					</label>
					<input id="photosEvenement" type="file" multiple accept=".jpg,.jpeg,.png" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-container" onInput={(e) => {
						const files = Array.from(e.currentTarget.files || []);
						setGalleryFiles((current) => [...current, ...files]);
						setGalleryPreviewSrcs((current) => [...current, ...files.map((f) => URL.createObjectURL(f))]);
					}} />
					{galleryPreviewSrcs.length > 0 && (
						<div class="mt-4 grid grid-cols-3 gap-3">
							{galleryPreviewSrcs.map((src, i) => (
								<div key={i} class="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
									<img src={src} alt={`Galerie ${i}`} class="w-full h-full object-cover" />
									<button type="button" onClick={() => removeGalleryItem(i)} class="absolute top-1 right-1 p-1 rounded bg-black/50 text-white hover:bg-black/70 transition-all">
										<span class="material-symbols-outlined text-[16px]">close</span>
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</FormModal>

			<ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} />

			<EventDetailModal
				open={Boolean(detailEvent)}
				loading={detailLoading}
				error={detailError}
				event={detailEvent}
				onClose={() => { setDetailEvent(null); setDetailError(null); setDetailLoading(false); }}
				onEdit={() => { if (detailEvent) { setShowForm(true); setEditingEvent(detailEvent); setDetailEvent(null); } }}
				onPreviewImage={(image) => setPreviewImage(image)}
			/>

			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
