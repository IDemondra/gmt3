import { handleRequest } from './src/app.js';
import { db, sqlite } from './src/config/database.js';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { resolve } from 'path';
import { createHash } from 'crypto';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';

const DATA_DIR = resolve(import.meta.dir, 'data');
const DB_PATH = resolve(DATA_DIR, 'gmt3.db');
const MIGRATIONS_DIR = resolve(import.meta.dir, 'drizzle');
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

function bootstrapLegacyMigrationHistory() {
	const journalPath = resolve(MIGRATIONS_DIR, 'meta', '_journal.json');
	if (!existsSync(journalPath)) return;

	let baseline: { when: number; hash: string; tableNames: string[] };
	try {
		const journal = JSON.parse(readFileSync(journalPath, 'utf8')) as { entries?: { tag?: string; when?: number }[] };
		const firstEntry = [...(journal.entries || [])].sort((a, b) => Number(a.when || 0) - Number(b.when || 0))[0];
		if (!firstEntry?.tag || typeof firstEntry.when !== 'number') return;
		const baselineSql = readFileSync(resolve(MIGRATIONS_DIR, `${firstEntry.tag}.sql`), 'utf8');
		const tableNames = [...baselineSql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?["`]?([A-Za-z0-9_]+)["`]?/gi)]
			.map((match) => match[1])
			.filter((name): name is string => Boolean(name));
		if (tableNames.length === 0) return;
		baseline = {
			when: firstEntry.when,
			hash: createHash('sha256').update(baselineSql).digest('hex'),
			tableNames,
		};
	} catch {
		return;
	}

	const existingTables = new Set((sqlite.query("SELECT name FROM sqlite_master WHERE type = 'table'").all() as { name: string }[]).map(({ name }) => name));
	if (!baseline.tableNames.every((tableName) => existingTables.has(tableName))) return;

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id SERIAL PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`);
	const latestMigration = sqlite.query('SELECT created_at FROM "__drizzle_migrations" ORDER BY created_at DESC LIMIT 1').get() as { created_at: number } | null;
	if (Number(latestMigration?.created_at ?? 0) >= baseline.when) return;

	sqlite.query('INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES (?, ?)').run(baseline.hash, baseline.when);
	console.log('[DB] Legacy schema detected — migration baseline registered');
}

bootstrapLegacyMigrationHistory();
migrate(db, { migrationsFolder: MIGRATIONS_DIR });
console.log('[DB] Migrations applied');

Bun.serve({
	port: PORT,
	idleTimeout: 255, // limite Bun: uploads multi-photos + conversion HEIC/sharp
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
