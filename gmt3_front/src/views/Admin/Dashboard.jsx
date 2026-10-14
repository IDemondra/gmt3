import { useEffect, useState, useRef } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { KpiCards } from '../../components/admin/KpiCards.jsx';
import { EventRow } from '../../components/admin/EventRow.jsx';
import { AdminListHeader } from '../../components/admin/AdminListHeader.jsx';
import { currentUser, accessToken, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { ImagePreview } from '../../components/ui/ImagePreview.jsx';
import { EventFormModal } from '../../components/admin/EventFormModal.jsx';
import { evenementsApi, typesEvenementsApi, evenementApi, createEvenementApi, updateEvenementApi, deleteEvenementApi } from '../../api/evenements.js';
import { kpisApi } from '../../api/kpis.js';

import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';
import { EventDetailModal } from '../../components/admin/EventDetailModal.jsx';
import { compressImageIfNeeded } from '../../utils/imageCompress.js';
import { useGalleryUpload } from '../../hooks/useGalleryUpload.js';
import { frDateToTs } from '../../utils/dateFormatter.js';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ROWS_PER_PAGE = 10;
const typeCollator = new Intl.Collator('fr', { sensitivity: 'base' });
const isConfirmType = (confirm, type) => confirm?.type === type;
const matchesEventSearch = (event, search) => event.titre?.toLowerCase().includes(search.toLowerCase()) || event.typeEvenement?.nom?.toLowerCase().includes(search.toLowerCase());


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
	const [page, setPage] = useState(0);
	const [showForm, setShowForm] = useState(false);
	const [editingEvent, setEditingEvent] = useState(null);
	const [previewSrc, setPreviewSrc] = useState('');

	useEffect(() => () => {
		if (previewSrc?.startsWith('blob:')) URL.revokeObjectURL(previewSrc);
	}, [previewSrc]);
	const [existingGalleryUrls, setExistingGalleryUrls] = useState(/** @type {string[]} */([])); // photos déjà en base (édition, lecture seule)
	const [pendingSubmit, setPendingSubmit] = useState(/** @type {FormData | null} */(null));
	const gallery = useGalleryUpload({ addToast });
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');
	const [uploadProgress, setUploadProgress] = useState(0);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; eventId?: number } | null} */ (null));
	const [events, setEvents] = useState([]);
	const [eventTypes, setEventTypes] = useState([]);
	const [typeSelection, setTypeSelection] = useState('');
	const sortedEventTypes = eventTypes.toSorted((a, b) => typeCollator.compare(a.nom || '', b.nom || ''));
	const [kpis, setKpis] = useState({ totalEvents: 0, totalReservations: 0, limitedEvents: 0 });
	const [descText, setDescText] = useState('');
	const descRef = useRef(null);
	const [previewImage, setPreviewImage] = useState(/** @type {{ url: string; title: string } | null} */ (null));
	const [detailEvent, setDetailEvent] = useState(null);
	const [detailLoading, setDetailLoading] = useState(false);
	const [detailError, setDetailError] = useState(null);
	const todayStr = toDateInputValue();
	const currentTimeStr = toTimeInputValue();

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
		let cancelled = false;
		const load = async () => {
			try {
				const [evtData, kpiData, typeData] = await Promise.all([
					evenementsApi(accessToken.value),
					kpisApi(accessToken.value),
					typesEvenementsApi(accessToken.value),
				]);
				if (!cancelled && Array.isArray(evtData.data)) {
					setEvents(evtData.data.map((e) => ({ ...e, title: e.titre, date: e.dateEvenement, published: e.estPublie })));
				}
				const kpiPayload = kpiData?.data ?? kpiData;
				if (!cancelled && typeof kpiPayload?.totalEvents === 'number') setKpis(kpiPayload);
				if (!cancelled && Array.isArray(typeData?.data)) setEventTypes(typeData.data);
			} catch {
				addToast('Impossible de charger les données du tableau de bord', 'error');
			}
		};
		if (!currentUser.value) { route('/admin', true); return; }
		load();
		return () => { cancelled = true; };
	}, [route, addToast]);

	const handleCreate = () => {
		setPendingSubmit(null);
		setEditingEvent(null);
		setTypeSelection(String(eventTypes[0]?.id ?? ''));
		setPreviewSrc('');
		setDescText('');
		setExistingGalleryUrls([]);
		gallery.reset();
		setShowForm(true);
	};

	const handleEdit = (event) => {
		setEditingEvent(event);
		setTypeSelection(String(event.typeEvenementId ?? event.typeEvenement?.id ?? ''));
		setDescText(event.description || '');
		setPreviewSrc(event.imagePrincipale ? `${import.meta.env.VITE_BACKEND_URL || ''}${event.imagePrincipale}` : '');
		setExistingGalleryUrls((event.photosEvenement || []).map((p) => `${import.meta.env.VITE_BACKEND_URL || ''}${p.url}`));
		gallery.reset();
		setShowForm(true);
	};

	const handleSubmit = async (data, galleryReplacementConfirmed = false) => {
		if (!galleryReplacementConfirmed && editingEvent && existingGalleryUrls.length > 0 && gallery.count > 0) {
			setPendingSubmit(data);
			setConfirm({ type: 'replace-gallery' });
			return;
		}
		try {
			setUploading(true);
			setUploadProgress(0);
			const fd = new FormData();
			fd.set('titre', data.get('titre'));
			const selectedType = data.get('typeEvenementId');
			fd.set('typeEvenementId', selectedType === '__new__' ? '' : selectedType || '');
			if (selectedType === '__new__') fd.set('typeEvenementNom', data.get('typeEvenementNom') || '');
			fd.set('description', data.get('description') || '');
			fd.set('dateEvenement', data.get('dateEvenement') || data.get('dateDepart') || todayStr);
			fd.set('lieu', data.get('lieu') || '');
			fd.set('difficulte', data.get('difficulte') || '');
			fd.set('prix', data.get('prix') || '');
			fd.set('capaciteMax', data.get('capaciteMax') || '');
			fd.set('heureDepart', data.get('heureDepart') || currentTimeStr);
			fd.set('dateDepart', data.get('dateDepart') || '');
			fd.set('heureRetour', data.get('heureRetour') || currentTimeStr);
			fd.set('dateRetour', data.get('dateRetour') || '');
			fd.set('estPublie', data.get('estPublie') === 'on' ? 'on' : '');

			const imageFile = data.get('imagePrincipale');
			if (imageFile && imageFile.size > 0) {
				const ext = imageFile.name.split('.').pop().toLowerCase();
				if (!['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif'].includes(ext)) {
					addToast('Format accepté : JPG, PNG, WEBP, GIF, HEIC', 'warning');
					setUploading(false);
					return;
				}
				setUploadStatus('Compression de l\'image principale...');
				const compressed = await compressImageIfNeeded(imageFile, MAX_UPLOAD_BYTES);
				fd.set('imagePrincipale', compressed);
			}

			// Photos de galerie déjà compressées à l'ajout (useGalleryUpload).
			for (const file of gallery.files) {
				fd.append('photosEvenement', file);
			}

			setUploadStatus('Envoi en cours...');
			let savedEvent;
			if (editingEvent) {
				const updated = await updateEvenementApi(accessToken.value, editingEvent.id, fd, setUploadProgress, () => setUploadStatus('Traitement des images...'));
				setEvents((prev) => prev.map((e) => e.id === editingEvent.id ? { ...updated, title: updated.titre, date: updated.dateEvenement, published: updated.estPublie } : e));
				savedEvent = updated;
			} else {
				const created = await createEvenementApi(accessToken.value, fd, setUploadProgress, () => setUploadStatus('Traitement des images...'));
				setEvents((prev) => [...prev, { ...created, title: created.titre, date: created.dateEvenement, published: created.estPublie }]);
				savedEvent = created;
			}
			if (savedEvent?.typeEvenement && !eventTypes.some((type) => type.id === savedEvent.typeEvenement.id)) {
				setEventTypes((prev) => [...prev, savedEvent.typeEvenement]);
			}
			setShowForm(false);
			setEditingEvent(null);
			setTypeSelection('');
			setPendingSubmit(null);
			setExistingGalleryUrls([]);
			gallery.reset();
		} catch (e) {
			addToast((e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement'), 'error');
		} finally {
			setUploading(false);
			setUploadStatus('');
			setUploadProgress(0);
		}
	};

	const confirmDeleteEvent = async (eventId) => {
		try {
			await deleteEvenementApi(accessToken.value, eventId);
			setEvents((prev) => prev.filter((e) => e.id !== eventId));
			addToast('Événement supprimé', 'success');
		} catch {
			addToast('Échec de la suppression', 'error');
		}
		setConfirm(null);
	};

	const filtered = (search
		? events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
		: events
	)
		.slice()
		.sort((a, b) => frDateToTs(b.dateDepart || b.date) - frDateToTs(a.dateDepart || a.date));
	const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
	const paged = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					{/* ── Header ── */}
					<AdminListHeader title="Événements" subtitle="Gérez vos expéditions et destinations." actionLabel="Nouveau" onAction={handleCreate} />

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
										aria-label="Rechercher" placeholder="Rechercher..."
										type="text"
										value={search}
										onInput={(e) => { setSearch(e.currentTarget.value); setPage(0); }}
									/>
								</div>
								<button type="button" class="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all">
									<span class="material-symbols-outlined text-[20px]">filter_list</span>
								</button>
							</div>
						</div>

						<div class="overflow-x-auto custom-scrollbar">
							<table class="w-full text-left border-collapse">
								<thead>
									<tr class="bg-gray-50/50 border-b border-gray-50">
										{['Référence', 'Titre', 'Calendrier', 'Prix', 'Statut', 'Actions'].map((column, index, columns) => (
											<th key={column} class={`px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${index === columns.length - 1 ? 'text-right' : ''}`}>{column}</th>
										))}
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-50">
									{paged.map((event, i) => (
										<EventRow key={event.id} event={event} index={i} onEdit={handleEdit} onDelete={(id) => setConfirm({ type: 'delete-event', eventId: id })} onImageClick={(url) => setPreviewImage({ url, title: event.title })} onViewDetails={handleViewDetails} />
									))}
								</tbody>
							</table>
						</div>

						<div class="p-4 border-t border-gray-50 flex justify-between items-center gap-4 bg-gray-50/20">
							<span class="text-xs text-gray-400 font-medium">{filtered.length === 0 ? 'Aucun résultat' : `${page * ROWS_PER_PAGE + 1}-${Math.min((page + 1) * ROWS_PER_PAGE, filtered.length)} sur ${filtered.length}`}</span>
							<div class="flex gap-2">
								<button type="button" class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled={page === 0} onClick={() => setPage((current) => current - 1)}>
									<span class="material-symbols-outlined text-[18px]">chevron_left</span>
								</button>
								<button type="button" class="p-1.5 rounded-md border border-gray-100 text-gray-400 hover:bg-white transition-all disabled:opacity-30" disabled={page >= totalPages - 1} onClick={() => setPage((current) => current + 1)}>
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
				open={isConfirmType(confirm, 'logout')}
				title="Déconnexion"
				message="Êtes-vous sûr de vouloir vous déconnecter ?"
				confirmLabel="Se déconnecter"
				icon="logout"
				variant="danger"
				onConfirm={confirmLogout}
				onCancel={() => setConfirm(null)}
			/>

			<ConfirmDialog
				open={isConfirmType(confirm, 'delete-event')}
				title="Supprimer l'événement"
				message="Cette action est irréversible. L'événement sera définitivement supprimé."
				confirmLabel="Supprimer"
				icon="delete"
				variant="danger"
				onConfirm={() => confirmDeleteEvent(confirm?.eventId)}
				onCancel={() => setConfirm(null)}
			/>

			<ConfirmDialog
				open={isConfirmType(confirm, 'replace-gallery')}
				title="Remplacer la galerie"
				message={`Les ${existingGalleryUrls.length} photo(s) existante(s) seront remplacées par les ${gallery.count} nouvelle(s). Continuer ?`}
				confirmLabel="Remplacer"
				icon="sync"
				variant="danger"
				onConfirm={async () => {
					const data = pendingSubmit;
					setPendingSubmit(null);
					setConfirm(null);
					if (data) await handleSubmit(data, true);
				}}
				onCancel={() => { setPendingSubmit(null); setConfirm(null); }}
			/>

			<EventFormModal
				open={showForm}
				title={editingEvent ? "Modifier l'événement" : 'Ajouter un événement'}
				submitLabel={editingEvent ? 'Enregistrer' : 'Créer'}
				onClose={() => { setPendingSubmit(null); setShowForm(false); setEditingEvent(null); setPreviewSrc(''); setExistingGalleryUrls([]); gallery.reset(); }}
				onSubmit={handleSubmit}
				uploading={uploading}
				uploadStatus={uploadStatus}
				uploadProgress={uploadProgress}
				editingEvent={editingEvent}
				eventTypes={eventTypes}
				sortedEventTypes={sortedEventTypes}
				typeSelection={typeSelection}
				setTypeSelection={setTypeSelection}
				descText={descText}
				setDescText={setDescText}
				descRef={descRef}
				previewSrc={previewSrc}
				setPreviewSrc={setPreviewSrc}
				existingGalleryUrls={existingGalleryUrls}
				gallery={gallery}
				todayStr={todayStr}
				currentTimeStr={currentTimeStr}
			/>


			<ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} />

			<EventDetailModal
				open={Boolean(detailEvent)}
				loading={detailLoading}
				error={detailError}
				event={detailEvent}
				onClose={() => { setDetailEvent(null); setDetailError(null); setDetailLoading(false); }}
				onEdit={() => { if (detailEvent) { handleEdit(detailEvent); setDetailEvent(null); } }}
				onPreviewImage={(image) => setPreviewImage(image)}
			/>

			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
