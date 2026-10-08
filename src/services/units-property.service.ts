import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== UNITS PROPERTY SERVICE */
/* ============================= */

export const unitsPropertyService = {

  /* ============================= */
  /* ===== SYSTEM TYPES ========= */
  /* ============================= */

  async getUnitTypes(lang: string) {

    const response = await fetchClient(
      `/v2/server/system/units-types?language=${lang}`
    );

    return handleResponse(response);
  },

  async getConsumerTypes(lang: string) {

    const response = await fetchClient(
      `/v2/server/system/consumers-types?language=${lang}`
    );

    return handleResponse(response);
  },

  async getSobriquetTypes() {

    const response = await fetchClient(
      `/server/system/available-property-sobriquet`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== FLOORS =============== */
  /* ============================= */

  async postFloor(idProperty: number | string, body: any) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/floors`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  async getFloors(idProperty: number | string) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/floors`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UNITS ================ */
  /* ============================= */

  async postUnits(
    idProperty: number | string,
    idFloor: number | string,
    body: any
  ) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/floors/${idFloor}/units`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  async getAllUnits(idProperty: number | string, lang: string) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units?language=${lang}`
    );

    return handleResponse(response);
  },

  async getUnit(idProperty: number | string, idUnit: number | string) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/${idUnit}`
    );

    return handleResponse(response);
  },

  async deleteUnit(idProperty: number | string, idUnit: number | string) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/${idUnit}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },

  async editUnit(
    idProperty: number | string,
    idUnit: number | string,
    body: any
  ) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/${idUnit}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== RESIDENTS ============ */
  /* ============================= */

  async putResident(
    idProperty: number | string,
    body: any,
    toCompany: number | string
  ) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/consumer?to_company=${toCompany}`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  async updateUnitOfResident(
    idUnit: number | string,
    body: any,
    idConsumer: number | string,
    idProperty: number | string
  ) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/${idUnit}/consumer/${idConsumer}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  async deleteResident(
    idProperty: number | string,
    idUnit: number | string,
    idConsumer: number | string
  ) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/${idUnit}/consumer/${idConsumer}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PAYMENT STATUS ======= */
  /* ============================= */

  async paymentStatus(folio: string, sessionId: string) {

    const response = await fetchClient(
      `/v2/server/integration/properties/payments/page/${folio}/status?session_id=${sessionId}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== ASSIGN UNIT ========== */
  /* ============================= */

  async assignUniToConsumer(idProperty: number | string, body: any) {

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/units/consumer-relate`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== METRICS ============== */
  /* ============================= */

  async getMetricsUnit() {

    const response = await fetchClient(
      `/server/metric/units`
    );

    return handleResponse(response);
  },

};