import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// SSR pour un vrai SEO sur données dynamiques (events qui changent).
// Passe en `output: 'static'` + getStaticPaths si le catalogue est figé au build.
export default defineConfig({
	site: 'https://gmt3-fianarantsoa.mg',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		preact({ compat: true }),
		// Exclut l'admin du sitemap (privé / noindex)
		sitemap({ filter: (page) => !page.includes('/admin') }),
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
