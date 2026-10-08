import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== TRANSPORTER DETAILS ==== */
/* ============================= */

export const transporterDetailsService = {

  /* ============================= */
  /* ===== COURIER METRICS ====== */
  /* ============================= */

  async getMetrics(idCourier: number | string) {

    const response = await fetchClient(
      `/server/metric/couriers/${idCourier}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== COURIER PACKAGES ===== */
  /* ============================= */

  async getDataPackages(
    idPropertyCourier: number | string,
    lang: string,
    dateStart: string,
    dateEnd: string,
    scheduled: boolean = false,
    canceled: boolean = false
  ) {

    const query = new URLSearchParams({
      language: lang,
      date_start: dateStart,
      date_end: dateEnd,
      scheduled: String(scheduled),
      canceled: String(canceled),
    }).toString();

    const response = await fetchClient(
      `/server/couriers/packages/${idPropertyCourier}?${query}`
    );

    return handleResponse(response);
  },

};