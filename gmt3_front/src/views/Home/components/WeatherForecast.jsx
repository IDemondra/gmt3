import { useEffect, useState } from 'preact/hooks';
import { getEventForecast } from '../../../utils/weatherApi.js';
import { WeatherForecastCard } from './WeatherForecastCard.jsx';

/**
 * Bloc météo du jour J de la prochaine expédition.
 * Données Open-Meteo (offre gratuite, sans clé), chargées côté client.
 */
export function WeatherForecast({ event = null, pending = false }) {
	const [forecast, setForecast] = useState(null);
	const [loading, setLoading] = useState(Boolean(event));

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
		getEventForecast(event)
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
	}, [event?.dateIso, event?.lieu, pending]);

	return <WeatherForecastCard event={event} forecast={forecast} loading={loading || pending} />;
}
