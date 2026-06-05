import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
				additionalPrerenderRoutes: ['/404'],
				previewMiddlewareEnabled: true,
				previewMiddlewareFallback: '/404',
			},
		}),
	],
	server: {
		proxy: {
			'/google-img/': {
				target: 'https://lh3.googleusercontent.com/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/google-img\//, ''),
				headers: {
					'Referer': 'https://lh3.googleusercontent.com/',
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
				},
			},
		},
	},
});
