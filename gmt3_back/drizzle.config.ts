import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/models/schema.ts',
	out: './drizzle',
	dialect: 'sqlite',
	dbCredentials: {
		url: './data/gmt3.db',
	},
});
