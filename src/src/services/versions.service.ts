import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== VERSIONS SERVICE ====== */
/* ============================= */

export const versionsService = {

  /* ============================= */
  /* ===== SYSTEM VERSION ======= */
  /* ============================= */

  async getSystemVersion() {

    const response = await fetchClient(
      `/server/system/check-current-version`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== VERSION DATA ========= */
  /* ============================= */

  async getDataVersion(params?: Record<string, any>) {

    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/server/system/query-version${query}`
    );

    return handleResponse(response);
  },

};