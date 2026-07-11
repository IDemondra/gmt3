import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const candidates = [resolve(process.cwd(), '.env'), resolve(process.cwd(), '..', '.env')];
const envFile = candidates.find((path) => existsSync(path));

if (envFile) {
	for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
		const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
		const key = match?.[1];
		if (!key || Bun.env[key]) continue;
		const value = match[2]!.replace(/^['"]|['"]$/g, '');
		Bun.env[key] = value;
	}
}
