import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";
import type {
  DashboardOverviewResponse,
} from "@/types/dashboard.types";

/* ============================= */
/* ===== DASHBOARD SERVICE ===== */
/* ============================= */

export const dashboardService = {
  /**
   * Obtiene el overview general del dashboard.
   *
   * GET /server/metric/query-metric-overview
   *
   * Incluye:
   * - total de paquetes
   * - lockers activos
   * - pickups pendientes
   * - tasa de entrega
   * - distribución de paquetes por estado
   * - tendencia semanal
   */
  async getOverview(): Promise<DashboardOverviewResponse> {
    const response = await fetchClient(
      "/server/metric/query-metric-overview",
    );

    return handleResponse(
      response,
    ) as Promise<DashboardOverviewResponse>;
  },
};
