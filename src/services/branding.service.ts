// src/services/branding.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== BRANDING SERVICE ====== */
/* ============================= */

export const brandingService = {

  async getBranding(lang: string = "en") {

    const params = new URLSearchParams({
      lang
    }).toString();

    const token = localStorage.getItem("token");

    const response = await fetchClient(
      `/v1/return-service/partner/custom-branding?${params}`,
      {
        headers: {
          "vivi-client-name": "return-portal",
          authorization: `Bearer ${token}`,
        }
      }
    );

    return handleResponse(response);
  }

};