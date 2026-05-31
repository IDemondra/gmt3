import { KpiRepository } from '../repositories/KpiRepository.js';
import type { BunRequest } from '../types/http.js';

const kpiRepo = new KpiRepository();

export const KpiController = {
	async getKpis(_req: BunRequest): Promise<Response> {
		const data = await kpiRepo.getKpis();
		return Response.json(data);
	},
};
