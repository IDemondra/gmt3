// @ts-nocheck
import { LocationProvider, Router, Route, hydrate, prerender as ssr, useLocation } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { Events } from './pages/Events/index.jsx';
import { EventDetail } from './pages/Events/Detail.jsx';
import { AdminLogin } from './pages/Admin/Login.jsx';
import { AdminDashboard } from './pages/Admin/Dashboard.jsx';
import { AdminUsers } from './pages/Admin/Users.jsx';
import { NotFound } from './pages/_404.jsx';
import './index.css';

export function App() {
	return (
		<LocationProvider>
			<Route path="/(.*)" component={AppShell} />
		</LocationProvider>
	);
}

function AppShell() {
	const { url } = useLocation();
	const isAdmin = url.startsWith('/admin');
	return (
		<>
			{!isAdmin && <Header />}
			<Router>
				<Route path="/" component={Home} />
				<Route path="/events/:slug" component={EventDetail} />
				<Route path="/events" component={Events} />
				<Route path="/admin" component={AdminLogin} />
				<Route path="/admin/dashboard" component={AdminDashboard} />
				<Route path="/admin/utilisateurs" component={AdminUsers} />
				<Route default component={NotFound} />
			</Router>
		</>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
