import { handleRequest } from './app.js';

const PORT = Number(Bun.env.PORT) || 3000;

Bun.serve({
	port: PORT,
	fetch(req) {
		return handleRequest(req as Request & { params?: Record<string, string> });
	},
});

console.log(`[GMT+3] Serveur démarré sur http://localhost:${PORT}`);
