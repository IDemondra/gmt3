import { LocationProvider, Router, Route } from 'preact-iso';
import { useEffect } from 'preact/hooks';
import { authLoading, tryAutoRefresh } from '../../stores/auth.js';
import { AdminLogin } from './Login.jsx';
import { AdminDashboard } from './Dashboard.jsx';
import { AdminUsers } from './Users.jsx';
import { AdminClients } from './Clients.jsx';
import { AdminReservations } from './Reservations.jsx';
import { AdminPhotos } from './Photos.jsx';
import { AdminAvis } from './Avis.jsx';

/**
 * SPA admin privée (CSR uniquement, montée en `client:only="preact"`).
 * preact-iso garde son routing interne sous le préfixe /admin.
 */
export default function AdminApp() {
	useEffect(() => { tryAutoRefresh(); }, []);

	if (authLoading.value) {
		return <main class="min-h-dvh flex items-center justify-center bg-[#f9fafb]"><div class="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-primary" /></main>;
	}

	return (
		<LocationProvider>
			<Router>
				<Route path="/admin" component={AdminLogin} />
				<Route path="/admin/dashboard" component={AdminDashboard} />
				<Route path="/admin/utilisateurs" component={AdminUsers} />
				<Route path="/admin/clients" component={AdminClients} />
				<Route path="/admin/reservations" component={AdminReservations} />
				<Route path="/admin/photos" component={AdminPhotos} />
				<Route path="/admin/avis" component={AdminAvis} />
				<Route default component={AdminLogin} />
			</Router>
		</LocationProvider>
	);
}
