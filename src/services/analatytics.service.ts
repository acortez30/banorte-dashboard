// src/services/analytics.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";
import { AnalyticsQueryParams, ApiAnalyticsResponse } from "@/types/Analytics.types";


/* ============================= */
/* ===== ANALYTICS SERVICE ===== */
/* ============================= */

export const analyticsService = {

  /* ============================= */
  /* ======= GET ANALYTICS ======= */
  /* ============================= */

  async getAnalytics(
    params: AnalyticsQueryParams
  ): Promise<ApiAnalyticsResponse> {

    const query = new URLSearchParams({
      id_propierty: String(params.id_propierty),
      date_start:   String(params.date_start),
      date_end:     String(params.date_end),
      language:     params.language ?? "es",
    }).toString();

    const response = await fetchClient(
      `/server/metric/analytics?${query}`
    );

    return handleResponse(response);
  },

};