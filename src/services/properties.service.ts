import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

export type PropertyChargeStatus = "assigned" | "available";

export const propertiesService = {
  async getProperties(params?: Record<string, any>) {
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(`/server/company/propierty${query}`);
    return handleResponse(response);
  },

  async getPropertySettings(idProperty: number, lang: string) {
    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/settings?language=${lang}`,
      { method: "GET" }
    );

    return handleResponse(response);
  },

  async getPropertyCharges(
    idProperty: number,
    status: PropertyChargeStatus,
    lang: string
  ) {
    const query = new URLSearchParams({ language: lang, status });
    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/charges?${query.toString()}`,
      { method: "GET" }
    );

    return handleResponse(response);
  },

  async getChargesCatalog(lang: string, idCurrency?: number) {
    const query = new URLSearchParams({ language: lang });

    if (idCurrency !== undefined) {
      query.set("id_currency", String(idCurrency));
    }

    const response = await fetchClient(
      `/v2/server/properties/charges/catalog?${query.toString()}`,
      { method: "GET" }
    );

    return handleResponse(response);
  },

  async updatePropertySettings(
    body: any,
    idProperty: number,
    lang: string,
    idCompany?: number
  ) {
    const query = new URLSearchParams({ language: lang });

    if (idCompany !== undefined && idCompany !== null) {
      query.set("to_company", String(idCompany));
    }

    const response = await fetchClient(
      `/v2/server/properties/${idProperty}/settings?${query.toString()}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  // Compatibilidad con los nombres usados actualmente por carriers/tickets.
  async getStatusRequestCarrierCode(idProperty: number, lang: string) {
    return this.getPropertySettings(idProperty, lang);
  },

  async updateStatusRequestCarrierCode(
    body: any,
    idProperty: number,
    lang: string
  ) {
    return this.updatePropertySettings(body, idProperty, lang);
  },
};
