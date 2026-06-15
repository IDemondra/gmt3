import { useLocation } from 'preact-iso';
import { useEffect } from 'preact/hooks';
import { useLogin } from '../../hooks/useLogin.js';
import { tryAutoRefresh, currentUser } from '../../stores/auth.js';

export function AdminLogin() {
	const { route } = useLocation();

	useEffect(() => {
		tryAutoRefresh().then(() => {
			if (currentUser.value) {
				route('/admin/dashboard', true);
			}
		});
	}, []);

	const { handleSubmit, formState, errorMsg } = useLogin(route);

	return (
		<div class="flex-1 flex items-center justify-center bg-[#f9fafb] px-4 min-h-dvh">
			<div class="w-full max-w-[400px]">
				{/* ── Logo ── */}
				<div class="text-center mb-10">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-white mb-6 shadow-sm">
						<span class="material-symbols-outlined text-3xl">admin_panel_settings</span>
					</div>
					<h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">
						GMT+3 <span class="text-gray-400 font-medium">MADAGASCAR</span>
					</h1>
					<p class="mt-2 text-sm text-gray-500 font-medium uppercase tracking-widest">
						Espace Administration
					</p>
				</div>

				{/* ── Card ── */}
				<div class="rounded-xl bg-white border border-gray-100 p-8 shadow-sm">
					<form onSubmit={handleSubmit} class="space-y-6">
						{/* ── Email ── */}
						<div>
							<label for="username" class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
								Nom d'utilisateur
							</label>
							<input
								id="username"
								name="username"
								type="text"
								placeholder="admin"
								class="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
								autocomplete="username"
								required
							/>
						</div>

						{/* ── Password ── */}
						<div>
							<label for="password" class="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
								Mot de passe
							</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								class="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-900 placeholder-gray-400 text-sm transition-all outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
								autocomplete="current-password"
								required
							/>
						</div>

						{/* ── Error ── */}
						{errorMsg.value && (
							<div class="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
								<span class="material-symbols-outlined text-sm text-red-500">error</span>
								<p class="text-sm text-red-600 font-medium">{errorMsg.value}</p>
							</div>
						)}

						{/* ── Submit ── */}
						<button
							type="submit"
							disabled={formState.value === 'loading'}
							class="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-sm transition-all hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
						>
							{formState.value === 'loading' ? (
								<span class="inline-flex items-center gap-2">
									<span class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
									Connexion...
								</span>
							) : (
								'Se connecter'
							)}
						</button>
					</form>
				</div>

				{/* ── Footer ── */}
				<p class="mt-8 text-center text-[11px] text-gray-400 font-bold tracking-widest uppercase">
					&copy; {new Date().getFullYear()} GMT+3 MADAGASCAR
				</p>
			</div>
		</div>
	);
}
