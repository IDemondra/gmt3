import jwt from 'jsonwebtoken';
import type { BunRequest } from '../types/http.js';

const JWT_SECRET = Bun.env.JWT_SECRET || 'gmt3-secret-change-in-production';

export async function authMiddleware(req: BunRequest): Promise<Response | undefined> {
	const authHeader = req.headers.get('Authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return Response.json({ error: 'NON_AUTORISE' }, { status: 401 });
	}

	const token = authHeader.slice(7);
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { id: number; nomUtilisateur: string; role: string };
		(req as any).user = decoded;
		return undefined;
	} catch {
		return Response.json({ error: 'TOKEN_INVALIDE_OU_EXPIRE' }, { status: 401 });
	}
}
