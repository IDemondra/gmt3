import { useEffect, useState } from 'preact/hooks';
import { Reveal } from '../../../components/ui/Reveal.jsx';
import { StarRating } from '../../../components/ui/StarRating.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export function TestimonialsSection() {
	const [reviews, setReviews] = useState([]);
	const [stats, setStats] = useState({ avg: 0, count: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`${API_BASE}/evenements`, { credentials: 'include' })
			.then((r) => r.json())
			.then((response) => {
				const events = Array.isArray(response.data) ? response.data : [];
				const all = [];
				for (const evt of events) {
					for (const a of (evt.avis || [])) {
						all.push({ ...a, evenement: evt.titre });
					}
				}
				if (all.length > 0) {
					const avg = Math.round((all.reduce((s, a) => s + a.note, 0) / all.length) * 10) / 10;
					setStats({ avg, count: all.length });
					// 3 meilleurs avis (note décroissante), commentaire requis
					const top = all
						.filter((a) => a.commentaire)
						.sort((a, b) => b.note - a.note)
						.slice(0, 3);
					setReviews(top.length > 0 ? top : all.slice(0, 3));
				}
			})
			.catch(() => setReviews([]))
			.finally(() => setLoading(false));
	}, []);

	if (loading || reviews.length === 0) return null;

	return (
		<section class="relative overflow-hidden bg-[#faf9f6] py-section-gap" id="temoignages">
			<div class="absolute inset-0 opacity-[0.03] pointer-events-none"
				style="background-image: radial-gradient(#1a1c1c 1px, transparent 1px); background-size: 22px 22px;" />

			<div class="relative mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
				{/* Header */}
				<div class="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
					<div class="max-w-2xl">
						<Reveal animation="fadeUp">
							<div class="flex items-center gap-3 mb-5">
								<div class="h-2 w-2 rounded-full bg-primary" />
								<span class="font-label-caps text-[10px] tracking-[0.3em] text-on-background/60 font-bold uppercase">Retours terrain</span>
							</div>
							<h2 class="font-h2 text-h2 md:text-5xl text-on-background font-black uppercase tracking-tighter leading-none">
								Ils ont vécu <br /><span class="text-primary">l'expédition</span>
							</h2>
						</Reveal>
					</div>

					<Reveal animation="fadeLeft" delay={120}>
						<div class="flex items-center gap-4 rounded-2xl border border-outline-variant/60 bg-white px-6 py-4 shadow-sm">
							<span class="font-h2 text-4xl font-black text-on-background">{stats.avg}</span>
							<div class="flex flex-col gap-1">
								<StarRating value={stats.avg} size="text-[18px]" />
								<span class="font-mono text-[10px] text-on-background/50 tracking-widest uppercase">{stats.count} avis vérifiés</span>
							</div>
						</div>
					</Reveal>
				</div>

				{/* Cards */}
				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					{reviews.map((rev, i) => (
						<Reveal key={rev.id} animation="fadeUp" delay={i * 100}>
							<figure class="h-full flex flex-col rounded-2xl border border-outline-variant/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
								<StarRating value={rev.note} size="text-[16px]" />
								<blockquote class="mt-4 flex-1 font-body-md text-secondary leading-relaxed">
									“{rev.commentaire}”
								</blockquote>
								<figcaption class="mt-6 flex items-center gap-3 border-t border-outline-variant/40 pt-4">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-black uppercase">
										{rev.nom.charAt(0)}
									</div>
									<div class="min-w-0">
										<p class="font-body-md font-bold text-on-background leading-tight truncate">{rev.nom}</p>
										<p class="font-mono text-[10px] text-on-background/40 truncate uppercase tracking-wider">{rev.evenement}</p>
									</div>
								</figcaption>
							</figure>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
