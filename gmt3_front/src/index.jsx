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
import { Conditions } from './components/Conditions.jsx';
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
	
	// Liste blanche des préfixes de routes publiques
	const publicPrefixes = ['/events', '/404'];
	const isHome = url === '/';
	const isShortEvent = /^\/[a-z0-9]{10}(?:\/|$)/i.test(url);
	const isPublic = isHome || isShortEvent || publicPrefixes.some(p => url.startsWith(p));
	
	// Sécurité supplémentaire : si on voit "admin" dans l'URL, on n'est JAMAIS en public
	const showPublicHeader = isPublic && !url.includes('/admin');

	return (
		<div id="app-root" class="min-h-dvh flex flex-col relative">
			{showPublicHeader && <Header />}
			<main class="flex-1 flex flex-col">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/events/:id" component={EventDetail} />
					<Route path="/events" component={Events} />
					<Route path="/admin" component={AdminLogin} />
					<Route path="/admin/dashboard" component={AdminDashboard} />
					<Route path="/admin/utilisateurs" component={AdminUsers} />
					<Route path="/admin/clients" component={AdminClients} />
					<Route path="/admin/reservations" component={AdminReservations} />
					<Route path="/:code" component={EventDetail} />
			<Route path="/conditions-utilisation" component={Conditions} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</div>
	);
}





if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
