import type { APIRoute } from 'astro';
import { eventPath } from '../utils/eventUrl.js';

const SITE = 'https://gmt3-fianarantsoa.mg';

// Sitemap dynamique : liste tous les événements publiés avec leur code public.
export const GET: APIRoute = async () => {
	const API = process.env.API_BASE_INTERNAL || 'http://localhost:3000/api';

	const events = await fetch(`${API}/evenements`)
		.then((r) => (r.ok ? r.json() : { data: [] }))
		.then((d) => (Array.isArray(d.data) ? d.data : []).filter((e: any) => e.estPublie))
		.catch(() => [] as any[]);

	const urls = events
		.map(
			(e: any) =>
				`<url><loc>${SITE}${eventPath(e)}</loc><changefreq>weekly</changefreq></url><url><loc>${SITE}${eventPath(e)}/avis</loc><changefreq>weekly</changefreq></url>`,
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
