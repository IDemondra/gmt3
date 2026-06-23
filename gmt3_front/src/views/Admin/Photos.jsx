import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { evenementsApi, evenementApi, replacePhotosApi } from '../../api/evenements.js';
import { isDateInFuture, formatDateFr } from '../../utils/dateFormatter.js';
import { compressImageIfNeeded } from '../../utils/imageCompress.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';

const MAX_PHOTOS = 10;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const BACKEND = import.meta.env.VITE_BACKEND_URL || '';

function resolveImg(url) {
	if (!url) return '';
	if (url.startsWith('http') || url.startsWith('blob:')) return url;
	return `${BACKEND}${url}`;
}

export function AdminPhotos() {
	const { route } = useLocation();
	const { confirmLogout } = useLogout(() => route('/admin', true));
	const { toasts, addToast, removeToast } = useToast();
	const promptLogout = () => setConfirm({ type: 'logout' });

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [confirm, setConfirm] = useState(/** @type {{ type: string } | null} */(null));
	const [events, setEvents] = useState(/** @type {any[]} */([]));
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(/** @type {any|null} */(null));

	// État galerie de l'événement sélectionné
	const [existing, setExisting] = useState(/** @type {any[]} */([])); // photos déjà en base
	const [newFiles, setNewFiles] = useState(/** @type {File[]} */([])); // nouveaux fichiers
	const [previews, setPreviews] = useState(/** @type {string[]} */([])); // blob: previews des newFiles
	const [uploading, setUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState('');

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadEvents();
		});
	}, []);

	const loadEvents = async () => {
		setLoading(true);
		try {
			const response = await evenementsApi(accessToken.value);
			const all = Array.isArray(response.data) ? response.data : [];
			// Événements passés uniquement
			const past = all.filter((e) => !isDateInFuture(e.dateDepart || e.dateEvenement));
			setEvents(past);
		} catch {
			addToast('Erreur de chargement des événements', 'error');
		} finally {
			setLoading(false);
		}
	};

	const selectEvent = async (evt) => {
		setSelected(evt);
		setNewFiles([]);
		setPreviews([]);
		setExisting([]);
		try {
			const full = await evenementApi(accessToken.value, evt.id);
			setExisting(full.photosEvenement || []);
		} catch {
			addToast('Erreur de chargement de la galerie', 'error');
		}
	};

	// Mode A (remplacement) : la limite porte sur les nouveaux fichiers, l'existant sera écrasé.
	const count = newFiles.length;

	const handleFileInput = (e) => {
		const picked = Array.from(e.currentTarget.files || []);
		e.currentTarget.value = '';
		if (picked.length === 0) return;
		const room = MAX_PHOTOS - count;
		if (room <= 0) {
			addToast(`Maximum ${MAX_PHOTOS} photos par événement`, 'warning');
			return;
		}
		const accepted = picked.slice(0, room);
		if (picked.length > room) {
			addToast(`Seules ${room} photo(s) ajoutée(s) (limite ${MAX_PHOTOS})`, 'warning');
		}
		setNewFiles((prev) => [...prev, ...accepted]);
		setPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))]);
	};

	const removeNew = (idx) => {
		URL.revokeObjectURL(previews[idx]);
		setNewFiles((prev) => prev.filter((_, i) => i !== idx));
		setPreviews((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleSave = async () => {
		if (!selected) return;
		if (newFiles.length === 0) {
			addToast('Ajoutez au moins une photo', 'warning');
			return;
		}
		setUploading(true);
		try {
			const fd = new FormData();
			// Mode A : l'envoi REMPLACE toute la galerie par les nouveaux fichiers.
			for (const [i, file] of newFiles.entries()) {
				setUploadStatus(`Compression ${i + 1}/${newFiles.length}...`);
				const compressed = await compressImageIfNeeded(file, MAX_UPLOAD_BYTES);
				fd.append('photosEvenement', compressed);
			}
			setUploadStatus('Envoi...');
			const res = await replacePhotosApi(accessToken.value, selected.id, fd);
			setExisting(res.photosEvenement || []);
			previews.forEach((p) => URL.revokeObjectURL(p));
			setNewFiles([]);
			setPreviews([]);
			addToast('Galerie enregistrée', 'success');
		} catch (e) {
			addToast(e?.message || 'Erreur lors de l\'envoi', 'error');
		} finally {
			setUploading(false);
			setUploadStatus('');
		}
	};

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					<div class="mb-10">
						<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Photos — Preuves de Terrain</h1>
						<p class="text-gray-500 mt-2 text-base">Associez jusqu'à {MAX_PHOTOS} photos aux événements passés.</p>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
						{/* ── Liste événements passés ── */}
						<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden h-fit">
							<div class="p-5 border-b border-gray-50 flex items-center gap-3">
								<h2 class="text-base font-bold text-gray-900">Événements passés</h2>
								<span class="px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[11px] font-bold border border-gray-100">{events.length}</span>
							</div>
							<div class="max-h-[60vh] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
								{loading && <div class="p-6 text-center text-gray-400 text-sm">Chargement...</div>}
								{!loading && events.length === 0 && (
									<div class="p-6 text-center text-gray-400 text-sm">Aucun événement passé.</div>
								)}
								{events.map((evt) => (
									<button
										key={evt.id}
										onClick={() => selectEvent(evt)}
										class={`w-full text-left px-5 py-4 transition-colors flex items-center gap-3 ${selected?.id === evt.id ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
									>
										<div class="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
											{evt.imagePrincipale
												? <img src={resolveImg(evt.imagePrincipale)} class="h-full w-full object-cover" referrerPolicy="no-referrer" />
												: <span class="material-symbols-outlined text-gray-400 text-[20px]">image</span>}
										</div>
										<div class="min-w-0">
											<p class={`text-sm font-semibold truncate ${selected?.id === evt.id ? 'text-primary' : 'text-gray-900'}`}>{evt.titre}</p>
											<p class="text-[11px] text-gray-400">{formatDateFr(evt.dateDepart || evt.dateEvenement) || '—'}</p>
										</div>
									</button>
								))}
							</div>
						</div>

						{/* ── Éditeur galerie ── */}
						<div class="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
							{!selected && (
								<div class="p-16 text-center text-gray-400">
									<span class="material-symbols-outlined text-5xl text-gray-200 mb-4">photo_library</span>
									<p class="text-sm">Sélectionnez un événement à gauche pour gérer ses photos.</p>
								</div>
							)}

							{selected && (
								<div class="p-6 md:p-8">
									<div class="flex items-center justify-between gap-4 mb-2">
										<h2 class="text-xl font-extrabold text-gray-900 tracking-tight">{selected.titre}</h2>
										<span class={`px-3 py-1 rounded-full text-[11px] font-bold border ${count >= MAX_PHOTOS ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
											{count} / {MAX_PHOTOS}
										</span>
									</div>

									<div class="mb-6 flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-[12px] text-amber-700">
										<span class="material-symbols-outlined text-[16px] mt-0.5">warning</span>
										<span>L'enregistrement <b>remplace</b> toute la galerie existante par les nouvelles photos sélectionnées.</span>
									</div>

									{/* Photos actuellement en ligne (aperçu read-only — sera remplacé) */}
									{existing.length > 0 && (
										<div class="mb-6">
											<p class="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Actuellement en ligne ({existing.length}) — sera remplacé</p>
											<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
												{existing.map((p, idx) => (
													<div key={p.id || idx} class="relative aspect-square rounded-lg overflow-hidden border border-gray-100 opacity-60">
														<img src={resolveImg(p.url)} class="h-full w-full object-cover" referrerPolicy="no-referrer" />
													</div>
												))}
											</div>
										</div>
									)}

									{/* Nouvelles photos */}
									{previews.length > 0 && (
										<div class="mb-6">
											<p class="text-[11px] font-bold text-primary uppercase tracking-widest mb-3">À envoyer ({previews.length})</p>
											<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
												{previews.map((src, idx) => (
													<div key={src} class="relative group aspect-square rounded-lg overflow-hidden border-2 border-primary/30">
														<img src={src} class="h-full w-full object-cover" />
														<button onClick={() => removeNew(idx)} class="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
															<span class="material-symbols-outlined text-[14px]">close</span>
														</button>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Zone upload */}
									<label class={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 transition-colors cursor-pointer ${count >= MAX_PHOTOS ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60' : 'border-gray-200 hover:border-primary/40 hover:bg-primary/5'}`}>
										<span class="material-symbols-outlined text-3xl text-gray-300">add_photo_alternate</span>
										<span class="text-sm font-semibold text-gray-500">{count >= MAX_PHOTOS ? `Limite ${MAX_PHOTOS} atteinte` : 'Cliquez pour ajouter des photos'}</span>
										<span class="text-[11px] text-gray-400">JPEG / PNG / WEBP / GIF / HEIC — max 5 Mo</span>
										<input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.gif,.heic,.heif,image/*" class="hidden" disabled={count >= MAX_PHOTOS} onInput={handleFileInput} />
									</label>

									<div class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-50">
										{uploading && <span class="text-xs text-gray-400">{uploadStatus}</span>}
										<button
											onClick={handleSave}
											disabled={uploading || newFiles.length === 0}
											class="px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-container font-semibold text-sm transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
										>
											<span class="material-symbols-outlined text-[18px]">cloud_upload</span>
											{uploading ? 'Envoi...' : 'Enregistrer la galerie'}
										</button>
									</div>
								</div>
							)}
						</div>
					</div>

					<p class="mt-12 text-center text-[11px] text-gray-300 font-bold tracking-widest uppercase">GMT+3 Admin Panel — Fianarantsoa</p>
				</main>
			</div>

			<ConfirmDialog open={confirm?.type === 'logout'} title="Déconnexion" message="Êtes-vous sûr de vouloir vous déconnecter ?" confirmLabel="Se déconnecter" icon="logout" variant="danger" onConfirm={confirmLogout} onCancel={() => setConfirm(null)} />
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
