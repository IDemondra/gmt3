import { handleRequest } from './src/app.js';
import { sqlite } from './src/config/database.js';
import { resolve } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';

const DATA_DIR = resolve(import.meta.dir, 'data');
const DB_PATH = resolve(DATA_DIR, 'gmt3.db');
const PORT = Number(Bun.env.PORT) || 3000;

// Ensure data directory and database file exist
if (!existsSync(DATA_DIR)) {
	mkdirSync(DATA_DIR, { recursive: true });
	console.log('[DB] Created data directory');
}
if (!existsSync(DB_PATH)) {
	writeFileSync(DB_PATH, '');
	console.log('[DB] Created database file');
}

Bun.serve({
	port: PORT,
	fetch(req) {
		const url = new URL(req.url);
		const path = url.pathname;

		// Health check — real DB liveness probe, short-circuited before logging
		if (path === '/health' && req.method === 'GET') {
			const checks: Record<string, string> = {};
			let healthy = true;

			// SELECT 1 proves the SQLite engine responds — decoupled from schema/deploy state
			try {
				const row = sqlite.query('SELECT 1 AS ok').get() as { ok: number } | null;
				checks.database = row?.ok === 1 ? 'ok' : 'error';
				if (checks.database !== 'ok') healthy = false;
			} catch {
				checks.database = 'error';
				healthy = false;
			}

			// Informational only — a missing uploads dir must not flap the container
			checks.uploads = existsSync(resolve(import.meta.dir, 'uploads')) ? 'ok' : 'missing';

			return new Response(
				JSON.stringify({
					status: healthy ? 'healthy' : 'unhealthy',
					timestamp: new Date().toISOString(),
					uptime: Math.round(process.uptime?.() || 0),
					checks,
				}),
				{
					status: healthy ? 200 : 503,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		// Serve uploaded files
		if (path.startsWith('/uploads/') && req.method === 'GET') {
			const filePath = resolve(import.meta.dir, `.${path}`);
			if (existsSync(filePath)) {
				try {
					const file = readFileSync(filePath);
					const ext = path.split('.').pop() || '';
					const mime: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' };
					return new Response(file, { headers: { 'Content-Type': mime[ext] || 'application/octet-stream' } });
				} catch {
					return new Response('Not Found', { status: 404 });
				}
			}
			return new Response('Not Found', { status: 404 });
		}
		const start = performance.now();
		const method = req.method;

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