import type { APIRoute } from 'astro';
import { eventPath } from '../utils/eventUrl.js';

const SITE = 'https://gmt3-fianarantsoa.mg';

export const prerender = false;

function esc(s: string) {
	return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function toISODate(d: any) {
	if (!d) return new Date().toISOString().split('T')[0];
	if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}/.test(d)) return d.slice(0,10);
	const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(d));
	if (m) return `${m[3]}-${m[2]}-${m[1]}`;
	const dt = new Date(d);
	return isNaN(dt.getTime()) ? new Date().toISOString().split('T')[0] : dt.toISOString().split('T')[0];
}

// Sitemap dynamique : événements publiés + avis, avec lastmod/priority pour SEO
export const GET: APIRoute = async () => {
	const API = process.env.API_BASE_INTERNAL || 'http://localhost:3000/api';

	const events = await fetch(`${API}/evenements`, { headers: { accept:'application/json' } })
		.then((r) => (r.ok ? r.json() : { data: [] }))
		.then((d) => (Array.isArray(d.data) ? d.data : []).filter((e: any) => e.estPublie))
		.catch(() => [] as any[]);

	const urls = events
		.map((e: any) => {
			const loc = esc(`${SITE}${eventPath(e)}`);
			const locAvis = esc(`${SITE}${eventPath(e)}/avis`);
			const lastmod = toISODate(e.updatedAt || e.dateModification || e.dateEvenement);
			return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url><url><loc>${locAvis}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
		},
	});
};
