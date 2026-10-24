import { useEffect, useRef, useState } from 'preact/hooks';
import { getReferenceDay, millisecondsUntilNextMidnight } from '../utils/weather.js';
import { clearWeatherCache } from '../utils/weatherApi.js';

/**
 * Jour de référence (fuseau Madagascar) mis à jour au passage de minuit.
 * Permet de recalculer la cible météo et de recharger les prévisions du jour.
 * Au changement de jour, le cache mémoire est purgé : les données affichées
 * sont toujours réactualisées depuis Open-Meteo, jamais relues d'un stockage.
 */
export function useForecastDay() {
	const [day, setDay] = useState(() => getReferenceDay());
	const dayRef = useRef(day);

	useEffect(() => {
		let timer = 0;
		const applyDay = (next) => {
			if (next.getTime() === dayRef.current.getTime()) return;
			dayRef.current = next;
			clearWeatherCache();
			setDay(next);
		};
		const schedule = () => {
			timer = window.setTimeout(() => {
				applyDay(getReferenceDay());
				schedule();
			}, millisecondsUntilNextMidnight());
		};
		const onVisibilityChange = () => {
			if (document.visibilityState !== 'visible') return;
			applyDay(getReferenceDay());
		};
		schedule();
		document.addEventListener('visibilitychange', onVisibilityChange);
		return () => {
			window.clearTimeout(timer);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	}, []);

	return day;
}
