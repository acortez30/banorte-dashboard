import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== STORES SERVICE ======== */
/* ============================= */

export const storesService = {

  /* ============================= */
  /* ===== GET STORES =========== */
  /* ============================= */

  async getStores() {

    const response = await fetchClient(
      `/server/company/stores`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== STORE PACKAGES LOG === */
  /* ============================= */

  async getLogPackages(idPackage: number | string) {

    const response = await fetchClient(
      `/server/company/stores/packages/logs/${idPackage}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== STORE DETAIL ========= */
  /* ============================= */

  async getStoreDetail(idStore: number | string) {

    const response = await fetchClient(
      `/server/company/stores/${idStore}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== DELETE STORE ========= */
  /* ============================= */

  async deleteStore(idStore: number | string) {

    const response = await fetchClient(
      `/server/company/stores/${idStore}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CREATE STORE ========= */
  /* ============================= */

  async addStore(body: any) {

    const response = await fetchClient(
      `/server/company/stores`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE STORE ========= */
  /* ============================= */

  async updateStore(body: any, idStore: number | string) {

    const response = await fetchClient(
      `/server/company/stores/${idStore}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE COURIER ======= */
  /* ============================= */

  async updateSignsCourier(body: any, idStoreCourier: number | string) {

    const response = await fetchClient(
      `/server/company/stores/set-courier/${idStoreCourier}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET CITIES =========== */
  /* ============================= */

  async getCities(stateId: number) {

    const response = await fetchClient(
      `/server/company/stores/data-form/${stateId}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== STORE PACKAGES ======= */
  /* ============================= */

  async getStorePackages(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/company/stores/packages?${query}`
    );

    return handleResponse(response);
  },

};