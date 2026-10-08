import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== WORKER SERVICE ======== */
/* ============================= */

export const workerService = {

  /* ============================= */
  /* ===== REBOOT SESSION ======= */
  /* ============================= */

  async rebotSession(body: any) {

    const response = await fetchClient(
      `/server/workers/rebot-session?language=es&refresh_code=false`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== REFRESH CODE ========= */
  /* ============================= */

  async refreshCode(body: any) {

    const response = await fetchClient(
      `/server/workers/rebot-session?language=es&refresh_code=true`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== WORKER METRICS ======= */
  /* ============================= */

  async getMetrics() {

    const response = await fetchClient(
      `/server/metric/workers`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== TABLE DATA =========== */
  /* ============================= */

  async getDataTable(
    language: string,
    dateStart: string,
    dateEnd: string
  ) {

    const query = new URLSearchParams({
      language,
      date_start: dateStart,
      date_end: dateEnd,
    }).toString();

    const response = await fetchClient(
      `/server/workers/packages?${query}`
    );

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== WORKER TABLE ========= */
  /* ============================= */

  async getDataTableOfWorker(
    language: string,
    dateStart: string,
    dateEnd: string,
    idUser: number | string
  ) {

    const query = new URLSearchParams({
      language,
      date_start: dateStart,
      date_end: dateEnd,
    }).toString();

    const response = await fetchClient(
      `/server/workers/packages/${idUser}?${query}`
    );

    return handleResponse(response);
  },

};