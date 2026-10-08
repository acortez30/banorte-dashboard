import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== PAYMENTS SERVICE ====== */
/* ============================= */

export const paymentsService = {

  /* ============================= */
  /* ===== GET PAYMENTS ========= */
  /* ============================= */

  async getPayments(idProperty: number | string) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/payments`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PAYMENTS BY MONTH ==== */
  /* ============================= */

  async getPaymentsWithMonth(
    idProperty: number | string,
    startPeriodHistory?: string
  ) {

    const query = new URLSearchParams({
      start_period_history: startPeriodHistory ?? "",
      end_period_history: startPeriodHistory ?? "",
    }).toString();

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/payments?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LINK TO PAY ========== */
  /* ============================= */

  async getLinkToPay(
    folio: string,
    toProperty: number | string
  ) {

    const response = await fetchClient(
      `/v2/server/integration/properties/payments/page/${folio}?to_propierty=${toProperty}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PAYMENT STATUS ======= */
  /* ============================= */

  async getPaymentStatus(folio: string) {

    const response = await fetchClient(
      `/v2/server/integration/properties/payments/page/${folio}/status`
    );

    return handleResponse(response);
  },

};