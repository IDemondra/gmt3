/**
 * @param {Object} props
 * @param {number} [props.totalEvents]
 * @param {number} [props.totalReservations]
 * @param {number} [props.limitedEvents]
 */
export function KpiCards({ totalEvents = 0, totalReservations = 0, limitedEvents = 0 }) {
	const kpis = [
		{
			icon: 'landscape',
			label: 'Expéditions',
			value: String(totalEvents),
			unit: 'Actives',
		},
		{
			icon: 'confirmation_number',
			label: 'Réservations',
			value: String(totalReservations),
			unit: 'Au total',
		},
		{
			icon: 'warning',
			label: 'Places limitées',
			value: String(limitedEvents),
			unit: 'Événements',
		},
	];

	return (
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
			{kpis.map((kpi) => (
				<div
					key={kpi.label}
					class="relative p-6 rounded-xl bg-white border border-gray-100 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
				>
					<div class="flex items-start justify-between mb-4">
						<div>
							<p class="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{kpi.label}</p>
							<span class="mt-1 inline-flex rounded-full bg-primary/8 px-2 py-0.5 text-[9px] font-extrabold tracking-[0.16em] text-primary">ANNUEL</span>
						</div>
						<div class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
							<span class="material-symbols-outlined text-lg" aria-hidden="true">{kpi.icon}</span>
						</div>
					</div>
					<div class="flex items-baseline gap-2">
						<span class="text-3xl font-extrabold text-gray-900 tracking-tight">{kpi.value}</span>
						<span class="text-xs font-medium text-gray-400">{kpi.unit}</span>
					</div>
				</div>
			))}
		</div>
	);
}
