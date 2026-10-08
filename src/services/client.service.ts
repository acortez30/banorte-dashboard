// src/services/clients.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ====== CLIENTS SERVICE ====== */
/* ============================= */

export const clientsService = {

  /* ============================= */
  /* ====== GET SOBRIQUETS ======= */
  /* ============================= */
  async getSobriquets() {

    const response = await fetchClient(
      `/server/system/available-property-sobriquet`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ====== GET METRIC CLIENT ==== */
  /* ============================= */
  async getMetricClient(params?: Record<string, any>) {

    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/server/metric/query-metric-client${query}`
    );

    return handleResponse(response);
  },

  async registerConsumerFromUnit(
    propertyId: number,
    unitId: number,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      countryCode: string;
      phone: string;
    }
  ) {

    const payload = {
      consumers: [
        {
          id_unit: unitId,
          language: "es",
          first_name: data.firstName,
          surname: data.lastName,
          email: data.email,
          telephone: `${data.countryCode}${data.phone}`,
        },
      ],
    };

    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/consumer`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ====== QUERY CLIENTS ======== */
  /* ============================= */
  async queryClients(params?: Record<string, any>) {

    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/server/company/query-consumer-company${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* == QUERY CLIENTS BY PROPERTY */
  /* ============================= */
  async queryClientsByProperty(params?: Record<string, any>) {

    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/server/company/query-consumer-company${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== REGISTER BULK (EXCEL) = */
  /* ============================= */
  async registerUserFromExcel(payload: any) {

    const response = await fetchClient(
      `/server/user/register-bulk`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(response);
  },

  async registerConsumerBulk(propertyId: number, payload: any) {

    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/consumer`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== REGISTER CONSUMER ===== */
  /* ============================= */
  async registerConsumer(data: any, propertyId: string) {



    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/consumer`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CHANGE STATUS CLIENT == */
  /* ============================= */
  async changeStatusOfClient(payload: any) {

    const response = await fetchClient(
      `/server/user/update-consumer`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE ADDRESSEE ====== */
  /* ============================= */
  async updateAddressee(payload: any) {

    const response = await fetchClient(
      `/server/package/update-addressee`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE CONSUMER ======= */
  /* ============================= */
  async updateConsumer(payload: any) {

    const response = await fetchClient(
      `/server/user/update-consumer`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return handleResponse(response);
  },

};