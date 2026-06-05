import { resolve } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '../models/schema.js';

const ROOT = resolve(import.meta.dir, '..', '..');
const DATA_DIR = resolve(ROOT, 'data');
const dbPath = resolve(DATA_DIR, 'gmt3.db');

if (!existsSync(DATA_DIR)) {
	mkdirSync(DATA_DIR, { recursive: true });
	console.log('[DB] Created data directory');
}

const sqlite = new Database(dbPath);
sqlite.run('PRAGMA journal_mode = WAL;');
sqlite.run('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });
export { sqlite };
