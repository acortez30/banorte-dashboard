// src/services/account.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== RESPONSE HANDLER ====== */
/* ============================= */


/* ============================= */
/* ===== ACCOUNT SERVICE ======= */
/* ============================= */

export const accountService = {

  /* ============================= */
  /* ===== UPDATE USER DATA ====== */
  /* ============================= */

  async updateDataUser(body: any) {

    const response = await fetchClient(
      `/server/user/update-data-user`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* === UPDATE USER PREFERENCES = */
  /* ============================= */

  async updateDataPreferencesUser(body: any) {

    const response = await fetchClient(
      `/server/user/update-data-preferences`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CHANGE PASSWORD ======= */
  /* ============================= */

  async changePassword(body: any) {

    const response = await fetchClient(
      `/server/user/reset-password-user`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ========= LOGOUT ============ */
  /* ============================= */

  async logout(body: any) {

    const response = await fetchClient(
      `/server/user/logout`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

};