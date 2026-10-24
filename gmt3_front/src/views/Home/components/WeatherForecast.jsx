import { useEffect, useState } from 'preact/hooks';
import { clearWeatherCache, getEventForecast } from '../../../utils/weatherApi.js';
import { WeatherForecastCard } from './WeatherForecastCard.jsx';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

/**
 * Bloc météo du jour J de la prochaine expédition.
 * Données Open-Meteo (offre gratuite, sans clé), chargées côté client.
 * Aucun stockage : chaque changement de jour Madagascar (`day`), retour de
 * visibilité de l'onglet ou écoulement du délai de revalidation déclenche une
 * nouvelle interrogation de l'API.
 */
export function WeatherForecast({ event = null, pending = false, day = null }) {
	const [forecast, setForecast] = useState(null);
	const [loading, setLoading] = useState(Boolean(event));
	const [revision, setRevision] = useState(0);

	useEffect(() => {
		if (pending || !event?.dateIso) return undefined;
		const timer = window.setInterval(() => {
			clearWeatherCache();
			setRevision((value) => value + 1);
		}, REFRESH_INTERVAL_MS);
		const onVisibilityChange = () => {
			if (document.visibilityState !== 'visible') return;
			clearWeatherCache();
			setRevision((value) => value + 1);
		};
		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			window.clearInterval(timer);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, [event?.dateIso, pending]);

	useEffect(() => {
		if (pending) {
			setLoading(true);
			return;
		}
		if (!event?.dateIso) {
			setLoading(false);
			setForecast(null);
			return;
		}
		let active = true;
		setLoading(true);
		getEventForecast(event, day ?? undefined)
			.then((result) => {
				if (active) setForecast(result);
			})
			.catch(() => {
				if (active) setForecast({ status: 'unavailable' });
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, [event?.dateIso, event?.lieu, pending, day?.getTime(), revision]);

	return <WeatherForecastCard event={event} forecast={forecast} loading={loading || pending} />;
}
