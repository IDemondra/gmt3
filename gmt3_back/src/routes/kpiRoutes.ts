import { KpiController } from '../controllers/KpiController.js';
import type { RouteMap } from '../types/http.js';

export const kpiRoutes: RouteMap = {
	'/api/kpis': {
		GET: KpiController.getKpis,
	},
};
