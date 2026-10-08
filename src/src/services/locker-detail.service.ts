import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* ===== LOCKER DETAIL SERVICE = */
/* ============================= */

export const lockerDetailService = {

  /* 🔹 GRID DE PUERTAS */
  async getLockersGrid(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/locker/query-door-locker-grid?${query}`
    );

    return handleResponse(response);
  },

  /* 🔹 MÉTRICAS DEL LOCKER */
  async getMetricsLocker(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/metric/query-metric-locker-id?${query}`
    );

    return handleResponse(response);
  },

  /* 🔹 ÓRDENES */
  async getOrders(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/package/query-package-company?${query}`
    );

    return handleResponse(response);
  },

  /* 🔹 MÉTRICAS POR ID LOCKER */
  async getMetricOrdersOfLockerId(idLocker: number, language = "es") {

    const response = await fetchClient(
      `/server/metric/locker?language=${language}&id_locker=${idLocker}`
    );

    return handleResponse(response);
  },

  /* 🔹 PROGRAMADOS */
  async getScheduled(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/package/schedule?${query}`
    );

    return handleResponse(response);
  },

  /* 🔹 CANCELAR PAQUETE */
  async getCancelPackage(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/package/cancel-package?${query}`
    );

    return handleResponse(response);
  },

  /* 🔹 AUDITORÍA */
  async auditLocker(params: Record<string, any>) {

    const query = new URLSearchParams(params).toString();

    const response = await fetchClient(
      `/server/system/audit-locker?${query}`
    );

    return handleResponse(response);
  },

  /* 🔹 CAMBIAR STATUS COMPARTIMENTO */
  async changeStatusOfCompartment(
    idLocker: number,
    idLockerDimension: number,
    body: { id_status: number }
  ) {

    const response = await fetchClient(
      `/server/locker/change-status-compartment/${idLocker}/${idLockerDimension}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    return handleResponse(response);
  }

};