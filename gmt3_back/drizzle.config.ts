import { defineConfig } from 'drizzle-kit';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const databasePath = resolve(process.cwd(), 'data', 'gmt3.db');
mkdirSync(dirname(databasePath), { recursive: true });

export default defineConfig({
	schema: './src/models/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: './data/gmt3.db',
	},
});
