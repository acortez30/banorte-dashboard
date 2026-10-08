import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";
import type {
  PackageRecordingResponse,
  PackageRecordingUrlParams,
} from "@/types/package-recording";

const API_BASE_URL = String(import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/* ============================= */
/* ===== SYSTEM SERVICE ======== */
/* ============================= */

export const systemService = {

  /* ============================= */
  /* ===== URBANIZATION TYPES ==== */
  /* ============================= */

  async getTypesUrbanization(lang: string) {

    const response = await fetchClient(
      `/v2/server/system/types_urbanization?language=${lang}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PACKAGE RECORDINGS === */
  /* ============================= */
  /* Endpoint /recording/propierty/:id/locker/:id ya no existe (403).
     Reemplazado por getPackageRecordings más abajo.
     No borrar hasta confirmar que ningún otro componente la llama. */

  async getPackageRecordings(
    idPackage: number | string,
    language: string,
    idLocker?: number | string
  ): Promise<PackageRecordingResponse> {
    const query = new URLSearchParams({
      language,
    });

    if (idLocker !== undefined && idLocker !== null && idLocker !== "") {
      query.set("id_locker", String(idLocker));
    }

    const response = await fetchClient(
      `/v2/server/system/recording/package/${idPackage}?${query.toString()}`
    );

    return handleResponse(response) as Promise<PackageRecordingResponse>;
  },

  buildPackageRecordingUrl({
    idPackage,
    idLocker,
    eventId,
    language,
    download = false,
  }: PackageRecordingUrlParams): string {
    const token = localStorage.getItem("token") || "";

    const query = new URLSearchParams({
      language,
      token,
    });

    if (download) {
      query.set("download", "true");
    }

    return `${API_BASE_URL}/v2/server/system/recording/package/${idPackage}/locker/${idLocker}/event/${eventId}?${query.toString()}`;
  },

  /* ============================= */
  /* ===== CONSUMER TYPES ======= */
  /* ============================= */

  async getConsumerTypes(lang: string) {

    const response = await fetchClient(
      `/v2/server/system/consumers-types?language=${lang}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UNIT TYPES =========== */
  /* ============================= */

  async getUnitsTypes(lang: string) {

    const response = await fetchClient(
      `/v2/server/system/units-types?language=${lang}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== HOLIDAYS OPTIONS ===== */
  /* ============================= */

  async getHolidays() {

    const response = await fetchClient(
      `/v2/server/system/holidays-options`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== SYSTEM VERSION ======= */
  /* ============================= */

  async getVersions() {

    const response = await fetchClient(
      `/server/system/check-current-version`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== LOCKER AUDIT ========= */
  /* ============================= */

  async getAuditLocker(
    idLocker: number | string,
    lang: string,
    dateStart: string,
    dateEnd: string,
    limit: number
  ) {

    const query = new URLSearchParams({
      id_locker: String(idLocker),
      language: lang,
      date_start: dateStart,
      date_end: dateEnd,
      limit: String(limit),
    }).toString();

    const response = await fetchClient(
      `/server/system/audit-locker?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PROPERTY SOBRIQUET === */
  /* ============================= */

  async getAvailablePropertySobriquet() {

    const response = await fetchClient(
      `/server/system/available-property-sobriquet`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== PLANS ================ */
  /* ============================= */

  async getPlans(lang: string) {

    const response = await fetchClient(
      `/v2/server/system/plans?language=${lang}`
    );

    return handleResponse(response);
  },

  async getStates() {

  const response = await fetchClient(
    `/server/system/states`
  );

  return handleResponse(response);

},
async getCitiesByState(id_state: number) {

  const response = await fetchClient(
    `/server/system/cities/${id_state}`
  );

  return handleResponse(response);

},


};