// @ts-nocheck
import { LocationProvider, Router, Route, hydrate, prerender as ssr, useLocation } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { Events } from './pages/Events/index.jsx';
import { EventDetail } from './pages/Events/Detail.jsx';
import { AdminLogin } from './pages/Admin/Login.jsx';
import { AdminDashboard } from './pages/Admin/Dashboard.jsx';
import { AdminUsers } from './pages/Admin/Users.jsx';
import { AdminClients } from './pages/Admin/Clients.jsx';
import { AdminReservations } from './pages/Admin/Reservations.jsx';
import { NotFound } from './pages/_404.jsx';
import './index.css';

export function App() {
	return (
		<LocationProvider>
			<AppShell />
		</LocationProvider>
	);
}

function AppShell() {
	const { url } = useLocation();
	
	// Détection ultra-robuste de la route Admin
	const currentPath = typeof window !== 'undefined' ? window.location.pathname : url;
	const isAdminPath = currentPath.split('?')[0].split('#')[0].startsWith('/admin');
	
	return (
		<>
			{!isAdminPath && <Header />}
			<main id="main-content" class="flex-1 flex flex-col min-h-screen w-full relative">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/events/:id" component={EventDetail} />
					<Route path="/events" component={Events} />
					<Route path="/admin" component={AdminLogin} />
					<Route path="/admin/dashboard" component={AdminDashboard} />
					<Route path="/admin/utilisateurs" component={AdminUsers} />
					<Route path="/admin/clients" component={AdminClients} />
					<Route path="/admin/reservations" component={AdminReservations} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</>
	);
}



if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
