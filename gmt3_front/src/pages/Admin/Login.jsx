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
		<div class="relative min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a2e] to-[#16213e] overflow-hidden px-4">
			{/* ── Decorative blobs ── */}
			<div class="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl pointer-events-none" />
			<div class="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/15 to-transparent blur-3xl pointer-events-none" />
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-blue-500/5 blur-3xl pointer-events-none" />

			<div class="relative w-full max-w-[420px]">
				{/* ── Logo ── */}
				<div class="text-center mb-8">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 mb-4 shadow-xl">
						<span class="material-symbols-outlined text-3xl text-primary-container">admin_panel_settings</span>
					</div>
					<h1 class="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
						GMT+3
					</h1>
					<p class="mt-2 text-sm text-white/50 font-medium tracking-wide uppercase">
						Administration
					</p>
				</div>

				{/* ── Card ── */}
				<div class="rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
					<form onSubmit={handleSubmit} class="space-y-5">
						{/* ── Email ── */}
						<div>
						<label for="username" class="block text-xs font-bold text-white/60 uppercase tracking-[0.12em] mb-2">
								Nom d'utilisateur
							</label>
							<input
								id="username"
								name="username"
								type="text"
								placeholder="admin"
								class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 font-medium text-sm transition-all duration-200 focus:outline-none focus:border-primary-container/50 focus:ring-2 focus:ring-primary-container/20"
								autocomplete="username"
							/>
						</div>

						{/* ── Password ── */}
						<div>
							<label for="password" class="block text-xs font-bold text-white/60 uppercase tracking-[0.12em] mb-2">
								Mot de passe
							</label>
							<input
								id="password"
								name="password"
								type="password"
								placeholder="••••••••"
								class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 font-medium text-sm transition-all duration-200 focus:outline-none focus:border-primary-container/50 focus:ring-2 focus:ring-primary-container/20"
								autocomplete="current-password"
							/>
						</div>

						{/* ── Error ── */}
						{errorMsg.value && (
							<div class="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
								<span class="material-symbols-outlined text-sm text-red-400">error</span>
								<p class="text-sm text-red-300 font-medium">{errorMsg.value}</p>
							</div>
						)}

						{/* ── Submit ── */}
						<button
							type="submit"
							disabled={formState.value === 'loading'}
							class="w-full py-3 rounded-xl bg-primary-container text-white font-bold text-sm uppercase tracking-[0.08em] transition-all duration-300 hover:shadow-lg hover:shadow-primary-container/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
				<p class="mt-6 text-center text-xs text-white/25 font-medium">
					&copy; {new Date().getFullYear()} GMT+3 Madagascar. Accès réservé.
				</p>
			</div>
		</div>
	);
}
