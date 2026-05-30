import { resolve } from 'path';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from '../models/schema.js';

const dbPath = resolve(process.cwd(), 'data/gmt3.db');
const sqlite = new Database(dbPath);
sqlite.run('PRAGMA journal_mode = WAL;');
sqlite.run('PRAGMA foreign_keys = ON;');

export const db = drizzle(sqlite, { schema });
export { sqlite };
