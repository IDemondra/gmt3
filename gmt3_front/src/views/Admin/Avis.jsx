import { useEffect, useState } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { Navbar } from '../../components/admin/Navbar.jsx';
import { Sidebar } from '../../components/admin/Sidebar.jsx';
import { currentUser, accessToken, tryAutoRefresh, useLogout } from '../../stores/auth.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { StarRating } from '../../components/ui/StarRating.jsx';
import { avisApi, approveAvisApi, deleteAvisApi } from '../../api/avis.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/ui/Toast.jsx';

const BACKEND = import.meta.env.VITE_BACKEND_URL || '';
const FILTERS = [
	{ key: 'pending', label: 'En attente' },
	{ key: 'approved', label: 'Approuvés' },
	{ key: 'all', label: 'Tous' },
];

export function AdminAvis() {
	const { route } = useLocation();
	const { confirmLogout } = useLogout(() => route('/admin', true));
	const { toasts, addToast, removeToast } = useToast();
	const promptLogout = () => setConfirm({ type: 'logout' });

	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [confirm, setConfirm] = useState(/** @type {{ type: string; id?: number } | null} */(null));
	const [avis, setAvis] = useState(/** @type {any[]} */([]));
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('pending');

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (!currentUser.value) { route('/admin', true); return; }
			loadAvis();
		});
	}, []);

	const loadAvis = async () => {
		setLoading(true);
		try {
			const res = await avisApi(accessToken.value);
			if (Array.isArray(res.data)) setAvis(res.data);
		} catch {
			addToast('Impossible de charger les avis', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleApprove = async (id) => {
		try {
			await approveAvisApi(accessToken.value, id);
			setAvis((prev) => prev.map((a) => a.id === id ? { ...a, estApprouve: true } : a));
			addToast('Avis approuvé', 'success');
		} catch {
			addToast('Échec de l\'approbation', 'error');
		}
	};

	const confirmDelete = async () => {
		if (!confirm || confirm.type !== 'delete' || !confirm.id) return;
		try {
			await deleteAvisApi(accessToken.value, confirm.id);
			setAvis((prev) => prev.filter((a) => a.id !== confirm.id));
			addToast('Avis supprimé', 'success');
		} catch {
			addToast('Échec de la suppression', 'error');
		}
		setConfirm(null);
	};

	const filtered = avis.filter((a) =>
		filter === 'all' ? true : filter === 'approved' ? a.estApprouve : !a.estApprouve
	);
	const pendingCount = avis.filter((a) => !a.estApprouve).length;

	return (
		<div class="h-screen flex flex-col bg-[#f9fafb] text-gray-900 font-body-md antialiased overflow-hidden text-sm">
			<Navbar user={currentUser.value} onLogout={promptLogout} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
			<div class="flex flex-1 w-full overflow-hidden">
				<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<main class="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
						<div>
							<h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-none">Avis & témoignages</h1>
							<p class="text-gray-500 mt-2 text-base">Modérez les avis avant publication.{pendingCount > 0 && <span class="ml-2 font-semibold text-primary">{pendingCount} en attente</span>}</p>
						</div>
						<div class="flex gap-2">
							{FILTERS.map((f) => (
								<button key={f.key} onClick={() => setFilter(f.key)}
									class={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f.key ? 'bg-primary text-white' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}>
									{f.label}
								</button>
							))}
						</div>
					</div>

					{loading && <Skeleton />}
					{!loading && filtered.length === 0 && (
						<div class="py-20 text-center">
							<span class="material-symbols-outlined text-5xl text-gray-200">reviews</span>
							<p class="mt-3 text-gray-400">Aucun avis dans cette catégorie.</p>
						</div>
					)}

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
						{filtered.map((a) => (
							<div key={a.id} class="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
								<div class="flex items-start justify-between gap-4">
									<div class="flex items-center gap-3">
										<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-black uppercase">{a.nom.charAt(0)}</div>
										<div>
											<p class="font-bold text-gray-900 leading-tight">{a.nom}</p>
											<StarRating value={a.note} size="text-[15px]" />
										</div>
									</div>
									<div class="flex flex-col items-end gap-1">
										<span class={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.estApprouve ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
											{a.estApprouve ? 'Approuvé' : 'En attente'}
										</span>
										<span class="font-mono text-[10px] text-gray-400">Évt #{a.evenementId} · {a.dateCreation}</span>
									</div>
								</div>
								{a.commentaire && <p class="mt-3 text-gray-600 leading-relaxed">{a.commentaire}</p>}
								{a.photoUrl && <img src={`${BACKEND}${a.photoUrl}`} alt="" class="mt-3 h-40 w-full rounded-lg object-cover" loading="lazy" referrerPolicy="no-referrer" />}
								<div class="mt-4 flex justify-end gap-2 pt-4 border-t border-gray-50">
									{!a.estApprouve && (
										<button onClick={() => handleApprove(a.id)} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all">
											<span class="material-symbols-outlined text-[18px]">check</span> Approuver
										</button>
									)}
									<button onClick={() => setConfirm({ type: 'delete', id: a.id })} class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm font-semibold hover:text-red-500 hover:border-red-200 transition-all">
										<span class="material-symbols-outlined text-[18px]">delete</span> Supprimer
									</button>
								</div>
							</div>
						))}
					</div>

					<p class="mt-12 text-center text-[11px] text-gray-300 font-bold tracking-widest uppercase">GMT+3 Admin Panel — Fianarantsoa</p>
				</main>
			</div>

			<ConfirmDialog open={confirm?.type === 'logout'} title="Déconnexion" message="Êtes-vous sûr de vouloir vous déconnecter ?" confirmLabel="Se déconnecter" icon="logout" variant="danger" onConfirm={confirmLogout} onCancel={() => setConfirm(null)} />
			<ConfirmDialog open={confirm?.type === 'delete'} title="Supprimer l'avis" message="Cette action est irréversible." confirmLabel="Supprimer" icon="delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</div>
	);
}
