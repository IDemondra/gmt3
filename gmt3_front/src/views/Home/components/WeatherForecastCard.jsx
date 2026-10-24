import { formatDateFr } from '../../../utils/dateFormatter.js';

const SKELETON_ROWS = [0, 1, 2];

export function formatTemp(value) {
	if (typeof value !== 'number') return '—';
	return `${Math.round(value)}°`;
}

export function formatMillimeters(value) {
	if (typeof value !== 'number') return null;
	if (value === 0) return '0 mm';
	return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} mm`;
}

/** Vue pure du bloc météo : testable sans réseau ni navigateur. */
export function WeatherForecastCard({ event = null, forecast = null, loading = false }) {
	if (!event) {
		if (loading) {
			return (
				<div class="rounded-xl border border-stone-200 bg-white/70 px-6 py-5 flex items-center gap-4 min-h-[132px]" aria-hidden="true">
					<div class="w-16 h-16 rounded-xl bg-stone-100 animate-pulse shrink-0" />
					<div class="space-y-2">
						{SKELETON_ROWS.map((row) => (
							<div key={row} class="h-3 rounded bg-stone-100 animate-pulse" style={`width:${72 - row * 16}px`} />
						))}
					</div>
				</div>
			);
		}
		return (
			<div class="rounded-xl border border-stone-200 bg-white/70 px-6 py-5 flex items-center gap-4 min-h-[132px]">
				<span class="material-symbols-outlined text-3xl text-stone-300 shrink-0">cloud_off</span>
				<div>
					<p class="font-label-caps text-[10px] tracking-[0.25em] text-secondary font-bold uppercase">Météo du jour</p>
					<p class="mt-2 font-body-md text-secondary">Prévisions météo momentanément indisponibles.</p>
				</div>
			</div>
		);
	}

	const status = forecast?.status;
	const hasRain = forecast?.precipitationProbability !== null && forecast?.precipitationProbability !== undefined;
	const isFallback = event.isFallback === true;
	const dateLabel = isFallback ? 'Aujourd’hui' : formatDateFr(event.dateFr) || event.dateFr;

	return (
		<div class="rounded-xl border border-stone-200 bg-white/70 px-6 py-5 min-h-[132px]">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="min-w-0">
					<p class="font-label-caps text-[10px] tracking-[0.25em] text-secondary font-bold uppercase">
						{isFallback ? 'Météo du jour' : 'Météo du jour J'}
					</p>
					<p class="mt-2 font-h3 text-lg font-black text-on-background uppercase tracking-tight truncate">{event.titre || 'Prochaine expédition'}</p>
					<p class="mt-1 font-body-md text-secondary flex items-center gap-2 flex-wrap">
						<span class="inline-flex items-center gap-1">
							<span class="material-symbols-outlined text-sm">calendar_today</span>
							{dateLabel}
						</span>
						{event.lieu && !isFallback && (
							<span class="inline-flex items-center gap-1">
								<span class="material-symbols-outlined text-sm">location_on</span>
								{event.lieu}
							</span>
						)}
					</p>
					{isFallback && (
						<p class="mt-1 font-body-md text-secondary/80">Aucune expédition à venir : météo par défaut à Fianarantsoa.</p>
					)}
				</div>

				{loading && (
					<div class="flex items-center gap-4" aria-hidden="true">
						<div class="w-16 h-16 rounded-xl bg-stone-100 animate-pulse" />
						<div class="space-y-2">
							{SKELETON_ROWS.map((row) => (
								<div key={row} class="h-3 rounded bg-stone-100 animate-pulse" style={`width:${72 - row * 16}px`} />
							))}
						</div>
					</div>
				)}

				{!loading && status === 'ok' && (
					<div class="flex items-center gap-5">
						<span class="material-symbols-outlined text-5xl text-primary shrink-0" aria-hidden="true">{forecast.icon}</span>
						<div class="text-right">
							<p class="font-h2 text-3xl font-black text-on-background leading-none">
								{formatTemp(forecast.tMax)}
								<span class="text-secondary font-bold text-lg"> / {formatTemp(forecast.tMin)}</span>
							</p>
							<p class="mt-2 font-body-md text-secondary font-medium">{forecast.label}</p>
							{hasRain && (
								<p class="mt-1 font-body-md text-secondary flex items-center gap-1 justify-end">
									<span class="material-symbols-outlined text-sm">water_drop</span>
									{forecast.precipitationProbability}% de pluie
									{formatMillimeters(forecast.precipitationSum) ? ` · ${formatMillimeters(forecast.precipitationSum)}` : ''}
								</p>
							)}
						</div>
					</div>
				)}

				{!loading && status === 'out_of_range' && (
					<div class="flex items-center gap-3 text-right">
						<span class="material-symbols-outlined text-4xl text-stone-400 shrink-0" aria-hidden="true">schedule</span>
						<p class="font-body-md text-secondary">
							Prévisions disponibles à partir de {forecast.availableFromFr ? formatDateFr(forecast.availableFromFr) : 'J-16'}.
						</p>
					</div>
				)}

				{!loading && (status === 'unavailable' || !status) && (
					<div class="flex items-center gap-3 text-right">
						<span class="material-symbols-outlined text-4xl text-stone-400 shrink-0" aria-hidden="true">cloud_off</span>
						<p class="font-body-md text-secondary">Prévisions météo momentanément indisponibles.</p>
					</div>
				)}
			</div>

			<p class="mt-4 font-body-md text-[11px] text-secondary/70">
				Données météo fournies par{' '}
				<a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary transition-colors">
					Open-Meteo.com
				</a>{' '}
				(licence{' '}
				<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary transition-colors">
					CC BY 4.0
				</a>
				)
			</p>
		</div>
	);
}
