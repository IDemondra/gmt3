import { handleRequest } from './src/app.js';
import { db, sqlite } from './src/config/database.js';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { resolve } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

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

migrate(db, { migrationsFolder: resolve(import.meta.dir, 'drizzle') });
console.log('[DB] Migrations applied');

Bun.serve({
	port: PORT,
	idleTimeout: 300, // uploads multi-photos: réseau lent + conversion HEIC/sharp côté serveur
	async fetch(req) {
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

		// Serve uploaded files — Bun.file() (streaming, non-bloquant) + cache conditionnel.
		// Les galeries peuvent être remplacées en conservant le même nom de fichier
		// (photoGallery.ts), donc pas de cache "immutable" : max-age modéré + revalidation
		// via Last-Modified pour que le navigateur détecte un remplacement (304 sinon).
		if (path.startsWith('/uploads/') && req.method === 'GET') {
			const filePath = resolve(import.meta.dir, `.${path}`);
			const file = Bun.file(filePath);
			if (!(await file.exists())) {
				return new Response('Not Found', { status: 404 });
			}

			const lastModified = new Date(file.lastModified).toUTCString();
			const ifModifiedSince = req.headers.get('if-modified-since');
			if (ifModifiedSince && ifModifiedSince === lastModified) {
				return new Response(null, { status: 304 });
			}

			const ext = path.split('.').pop() || '';
			const mime: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml' };
			return new Response(file, {
				headers: {
					'Content-Type': mime[ext] || 'application/octet-stream',
					'Cache-Control': 'public, max-age=3600, must-revalidate',
					'Last-Modified': lastModified,
				},
			});
		}
		const start = performance.now();
		const method = req.method;

		console.log(`\n[REQ] ${method} ${path}`);

		return handleRequest(req as Request & { params?: Record<string, string> })
			.then((res) => {
				const ms = (performance.now() - start).toFixed(1);
				console.log(`[RES] ${method} ${path} -> ${res.status} (${ms}ms)`);
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
