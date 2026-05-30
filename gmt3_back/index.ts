import { handleRequest } from './src/app.js';

const PORT = Number(Bun.env.PORT) || 3000;

Bun.serve({
	port: PORT,
	fetch(req) {
		const url = new URL(req.url);
		const start = performance.now();
		const method = req.method;
		const path = url.pathname;

		console.log(`\n[REQ] ${method} ${path}`);
		if (req.body) {
			try {
				const cloned = req.clone();
				cloned.text().then((body) => {
					if (body) console.log(`[BODY] ${body.slice(0, 500)}`);
				}).catch(() => {});
			} catch {}
		}

		return handleRequest(req as Request & { params?: Record<string, string> })
			.then((res) => {
				const ms = (performance.now() - start).toFixed(1);
				console.log(`[RES] ${method} ${path} -> ${res.status} (${ms}ms)`);
				res.clone().json().then((data) => {
					const snippet = JSON.stringify(data).slice(0, 300);
					console.log(`[DATA] ${snippet}`);
				}).catch(() => {});
				return res;
			})
			.catch((err) => {
				const ms = (performance.now() - start).toFixed(1);
				console.error(`[ERR] ${method} ${path} (${ms}ms):`, err);
				return new Response(JSON.stringify({ error: 'ERREUR_INTERNE' }), {
					status: 500,
					headers: { 'Content-Type': 'application/json' },
				});
			});
	},
});

console.log(`[GMT+3] Serveur démarré sur http://localhost:${PORT}`);