import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';

// Astro 7: output static + prerender false par route = hybrid. Permet CDN cache + TTFB <200ms pour pages statiques, SSR frais pour landing/dynamic.
export default defineConfig({
	site: 'https://gmt3-fianarantsoa.mg',
	output: 'static',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		preact({ compat: true }),
		sitemap({ filter: (page) => !page.includes('/admin') && !page.includes('/recherche') }),
		partytown({ config: { forward: ['dataLayer.push', 'gtag'] } }),
	],
	vite: {
		// Expose aussi les variables VITE_* aux composants existants (en plus de PUBLIC_*)
		envPrefix: ['PUBLIC_', 'VITE_'],
		plugins: [tailwindcss()],
		server: {
			proxy: {
				// Images stockées par le backend (événements + galerie)
				'/uploads': {
					target: 'http://localhost:3000',
					changeOrigin: true,
				},
				'/google-img/': {
					target: 'https://lh3.googleusercontent.com/',
					changeOrigin: true,
					rewrite: (p) => p.replace(/^\/google-img\//, ''),
					headers: {
						Referer: 'https://lh3.googleusercontent.com/',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					},
				},
			},
		},
	},
});
