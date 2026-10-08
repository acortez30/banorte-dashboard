import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== TRANSPORTER SERVICE ==== */
/* ============================= */

export const transporterService = {

  /* ============================= */
  /* ===== CREATE CARRIER ======= */
  /* ============================= */

  async createCarrier(body: any) {

    const response = await fetchClient(
      `/server/couriers`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET COURIERS ========= */
  /* ============================= */

  async getCouriers() {

    const response = await fetchClient(
      `/server/couriers`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE CARRIER ======= */
  /* ============================= */

  async updateCarrier(body: any) {

    const response = await fetchClient(
      `/server/couriers`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== DELETE COURIER ======= */
  /* ============================= */

  async deleteCourier(idCourier: number | string) {

    const response = await fetchClient(
      `/server/couriers/${idCourier}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== COURIER METRICS ====== */
  /* ============================= */

  async getMetrics() {

    const response = await fetchClient(
      `/server/metric/couriers?from=2025-01-01T00:00:00Z&to=2025-04-01T00:00:00Z`
    );

    return handleResponse(response);
  },

};