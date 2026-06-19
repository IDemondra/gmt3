import { LocationProvider, Router, Route } from 'preact-iso';
import { AdminLogin } from './Login.jsx';
import { AdminDashboard } from './Dashboard.jsx';
import { AdminUsers } from './Users.jsx';
import { AdminClients } from './Clients.jsx';
import { AdminReservations } from './Reservations.jsx';

/**
 * SPA admin privée (CSR uniquement, montée en `client:only="preact"`).
 * preact-iso garde son routing interne sous le préfixe /admin.
 */
export default function AdminApp() {
	return (
		<LocationProvider>
			<Router>
				<Route path="/admin" component={AdminLogin} />
				<Route path="/admin/dashboard" component={AdminDashboard} />
				<Route path="/admin/utilisateurs" component={AdminUsers} />
				<Route path="/admin/clients" component={AdminClients} />
				<Route path="/admin/reservations" component={AdminReservations} />
				<Route default component={AdminLogin} />
			</Router>
		</LocationProvider>
	);
}
