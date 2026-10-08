// src/services/company.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== COMPANY SERVICE ======= */
/* ============================= */

export const companyService = {

  /* ============================= */
  /* ===== GET COMPANY ========== */
  /* ============================= */

  async getCompany() {

    const response = await fetchClient(
      `/server/company`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET COMPANY BY ID ==== */
  /* ============================= */

  async getCompanyId(idCompany: number | string) {

    const response = await fetchClient(
      `/server/company/${idCompany}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CREATE COMPANY ======= */
  /* ============================= */

  async postCompany(body: any) {

    const response = await fetchClient(
      `/server/company`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET PROPERTIES ======= */
  /* ============================= */

  async getProperties(idCompany: number) {

    const response = await fetchClient(
      `/server/company/${idCompany}/propierty`
    );

    return handleResponse(response);
  },

  async getConsumers(language: string = "en") {
    const response = await fetchClient(
      `/server/company/query-consumer-company?language=${language}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET SERVICES PROPERTY = */
  /* ============================= */

  async getServicesOfProperty(idProperty: number) {

    const response = await fetchClient(
      `/server/company/propierty/${idProperty}/line-service`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET PROPERTY DETAIL == */
  /* ============================= */

  async getPropertiesID(idCompany: number, idProperty: number) {

    const response = await fetchClient(
      `/server/company/${idCompany}/propierty/${idProperty}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CREATE PROPERTY ====== */
  /* ============================= */

  async postProperties(body: any, idCompany: number) {

    const response = await fetchClient(
      `/server/company/${idCompany}/propierty`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET LINE SERVICE ===== */
  /* ============================= */

  async getLineService(lineService: number) {

    const response = await fetchClient(
      `/server/company/propierty/${lineService}/line-service`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CREATE LINE SERVICE == */
  /* ============================= */

  async postLineService(body: any, idProperty: number) {

    const response = await fetchClient(
      `/server/company/propierty/${idProperty}/line-service`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== STATES =============== */
  /* ============================= */

  async getStates() {

    const response = await fetchClient(
      `/server/system/states`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== CITIES =============== */
  /* ============================= */

  async getCity(idState: number) {

    const response = await fetchClient(
      `/server/system/cities/${idState}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LINE SERVICES ======== */
  /* ============================= */

  async getLineServices() {

    const response = await fetchClient(
      `/server/system/available-line-services`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LOCKERS AVAILABLE ==== */
  /* ============================= */

  async getLockersAvailables() {

    const response = await fetchClient(
      `/server/system/available-lockers`
    );

    return handleResponse(response);
  },



};