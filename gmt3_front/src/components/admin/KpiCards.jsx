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
			gradient: 'from-primary/5 via-primary/5 to-transparent',
			iconBg: 'bg-primary-container',
			iconText: 'text-on-primary',
		},
		{
			icon: 'confirmation_number',
			label: 'Réservations',
			value: String(totalReservations),
			unit: 'Cette semaine',
			gradient: 'from-primary-container/5 via-primary-container/10 to-transparent',
			iconBg: 'bg-primary-container',
			iconText: 'text-on-primary',
		},
		{
			icon: 'warning',
			label: 'Places limitées',
			value: String(limitedEvents),
			unit: 'Événements',
			gradient: 'from-surface-container via-surface-container to-transparent',
			iconBg: 'bg-surface-container-high',
			iconText: 'text-on-background',
		},
	];

	return (
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
			{kpis.map((kpi) => (
				<div
					key={kpi.label}
					class={`relative overflow-hidden rounded-2xl bg-surface border border-outline-variant/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 group`}
				>
					<div class={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-60`} />
					<div class="relative z-10 flex items-start justify-between mb-5">
						<p class="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
							{kpi.label}
						</p>
						<div class={`h-10 w-10 rounded-xl ${kpi.iconBg} flex items-center justify-center shadow-md shadow-black/10`}>
							<span class={`material-symbols-outlined ${kpi.iconText} text-xl`}>{kpi.icon}</span>
						</div>
					</div>
					<div class="relative z-10 flex items-baseline gap-2">
						<span class="font-h1 text-h1 text-on-background font-black">{kpi.value}</span>
						<span class="font-body-md text-body-md text-secondary">{kpi.unit}</span>
					</div>
					<div class="relative z-10 mt-4 flex items-center gap-2">
						<span class="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
							<span class="material-symbols-outlined text-[14px]">trending_up</span>
							+12%
						</span>
						<span class="text-xs text-secondary">vs mois dernier</span>
					</div>
				</div>
			))}
		</div>
	);
}
