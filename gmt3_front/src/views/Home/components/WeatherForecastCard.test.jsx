import { describe, expect, test } from 'bun:test';
import { render } from 'preact-render-to-string';
import { WeatherForecastCard } from './WeatherForecastCard.jsx';

const EVENT = {
	titre: 'Randonnée',
	lieu: 'Ranomafana',
	dateFr: '02/11/2026',
	dateIso: '2026-11-02',
};

describe('WeatherForecastCard', () => {
	test('affiche le message d’absence d’expédition', () => {
		const html = render(<WeatherForecastCard event={null} />);
		expect(html).toContain('Météo du jour J');
		expect(html).toContain('Aucune expédition à venir');
	});

	test('affiche le squelette pendant le chargement', () => {
		const html = render(<WeatherForecastCard event={EVENT} loading />);
		expect(html).toContain('animate-pulse');
		expect(html).not.toContain('% de pluie');
	});

	test('affiche température, libellé et pluie quand la prévision est disponible', () => {
		const html = render(
			<WeatherForecastCard
				event={EVENT}
				forecast={{
					status: 'ok',
					label: 'Pluie modérée',
					icon: 'rainy',
					tMax: 25.6,
					tMin: 15.6,
					precipitationSum: 2.7,
					precipitationProbability: 80,
				}}
			/>,
		);
		expect(html).toContain('26°');
		expect(html).toContain('16°');
		expect(html).toContain('Pluie modérée');
		expect(html).toContain('80% de pluie');
		expect(html).toContain('2,7 mm');
		expect(html).toContain('Open-Meteo.com');
		expect(html).toContain('CC BY 4.0');
	});

	test('indique la date de disponibilité hors horizon', () => {
		const html = render(
			<WeatherForecastCard event={EVENT} forecast={{ status: 'out_of_range', availableFromFr: '18/10/2026' }} />,
		);
		expect(html).toContain('Prévisions disponibles à partir de');
		expect(html).toContain('18 Octobre 2026');
	});

	test('affiche un message quand l’API échoue', () => {
		const html = render(<WeatherForecastCard event={EVENT} forecast={{ status: 'unavailable' }} />);
		expect(html).toContain('momentanément indisponibles');
	});
});
