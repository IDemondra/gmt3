import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { Events } from './pages/Events/index.jsx';
import { EventDetail } from './pages/Events/Detail.jsx';
import { NotFound } from './pages/_404.jsx';
import './index.css';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<Router>
				<Route path="/" component={Home} />
				<Route path="/events/:slug" component={EventDetail} />
				<Route path="/events" component={Events} />
				<Route default component={NotFound} />
			</Router>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
