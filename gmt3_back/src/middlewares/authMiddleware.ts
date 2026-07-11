import jwt from 'jsonwebtoken';
import type { BunRequest } from '../types/http.js';
import { UserRepository } from '../repositories/UserRepository.js';
import '../config/env.js';

const JWT_SECRET = Bun.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env var is required');
const _JWT_SECRET: string = JWT_SECRET;
const userRepository = new UserRepository();

export async function authMiddleware(req: BunRequest): Promise<Response | undefined> {
	const authHeader = req.headers.get('Authorization');
	if (!authHeader?.startsWith('Bearer ')) {
		return Response.json({ error: 'NON_AUTORISE' }, { status: 401 });
	}

	const token = authHeader.slice(7);
	try {
		const decoded = jwt.verify(token, _JWT_SECRET) as { id: number; nomUtilisateur: string; role: string };
		const user = await userRepository.findById(decoded.id);
		if (!user || !user.actif) return Response.json({ error: 'NON_AUTORISE' }, { status: 401 });
		req.user = { id: user.id, nomUtilisateur: user.nomUtilisateur, role: user.role };
		return undefined;
	} catch {
		return Response.json({ error: 'TOKEN_INVALIDE_OU_EXPIRE' }, { status: 401 });
	}
}
