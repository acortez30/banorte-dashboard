// src/services/orders.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* TYPES                         */
/* ============================= */

export type PackageStatusFilter =
  | "all"
  | "in_progress"
  | "expired"
  | "completed";

export type OrdersSortBy =
  | "status"
  | "registration_date"
  | "pickup_date";

export type OrdersSortDir = "asc" | "desc";

export type PackageSearchBy = "tracking" | "email";

export type OrdersPriorityStatus =
  | "scheduled"
  | "pending_validate"
  | "pending_payment"
  | "in_transit"
  | "in_locker"
  | "expired_in_locker"
  | "completed"
  | "expired_collected";

export type OrdersTabStatus =
  | PackageStatusFilter
  | "scheduled"
  | "canceled"
  | "failure";

export interface SearchPackagesParams {
  search_by: PackageSearchBy;
  search: string;
  id_locker?: string | number;
  page?: string | number;
  page_size?: string | number;
  language?: "es" | "en" | string;
}

export interface OrdersQueryParams {
  language?: string;
  id_company?: string | number;
  id_consumer?: string | number;
  id_locker?: string | number;
  id_unit?: string | number;
  date_start?: string | number;
  date_end?: string | number;
  page?: string | number;
  limit?: string | number;
  status_filter?: PackageStatusFilter;
  sort_by?: OrdersSortBy;
  sort_dir?: OrdersSortDir;
  priority_status?: OrdersPriorityStatus;
}

/* ============================= */
/* HELPERS                       */
/* ============================= */

export function supportsOrdersQueryControls(status: OrdersTabStatus): boolean {
  return status !== "scheduled" && status !== "canceled" && status !== "failure";
}


function buildQuery(params?: Record<string, any>): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    // "all" equivale a no enviar status_filter.
    if (
      key === "status_filter" &&
      String(value).toLowerCase() === "all"
    ) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

function withoutStatusFilter(params?: OrdersQueryParams) {
  if (!params) return undefined;

  const {
    status_filter: _statusFilter,
    ...rest
  } = params;

  return rest;
}

/**
 * Los parámetros de orden/prioridad pertenecen exclusivamente a
 * /server/package/query-package-company. Evitamos enviarlos a los endpoints
 * legacy de scheduled/canceled/failure para conservar su contrato actual.
 */
function withoutQueryPackageCompanyControls(params?: OrdersQueryParams) {
  if (!params) return undefined;

  const {
    status_filter: _statusFilter,
    sort_by: _sortBy,
    sort_dir: _sortDir,
    priority_status: _priorityStatus,
    ...rest
  } = params;

  return rest;
}

/* ============================= */
/* ====== ORDERS SERVICE ======= */
/* ============================= */

export const ordersService = {
  /**
   * Búsqueda server-side por tracking o email.
   * En Locker Detail se envía id_locker para limitar los resultados al locker
   * actualmente abierto.
   */
  async searchPackages(params: SearchPackagesParams) {
    const response = await fetchClient(
      `/server/package/search-packages${buildQuery(params)}`,
    );

    return handleResponse(response);
  },

  async getOrders(params?: OrdersQueryParams) {
    const response = await fetchClient(
      `/server/package/query-package-company${buildQuery(params)}`,
    );

    return handleResponse(response);
  },

  /**
   * Método unificado para los tabs.
   *
   * all / in_progress / expired / completed
   *   -> /server/package/query-package-company
   *
   * scheduled
   *   -> /server/package/schedule
   *
   * canceled
   *   -> /server/package/cancel-package
   *
   * failure
   *   -> /server/package/failures
   *   Este endpoint solo admite id_locker como filtro opcional.
   *
   * Los filtros id_consumer / id_locker / id_unit viajan en params
   * y se conservan independientemente del endpoint seleccionado.
   */
  async getOrdersByStatus(
    status: OrdersTabStatus,
    params?: OrdersQueryParams,
  ) {
    const cleanParams = withoutStatusFilter(params);
    const legacyParams = withoutQueryPackageCompanyControls(params);

    if (status === "scheduled") {
      const response = await fetchClient(
        `/server/package/schedule${buildQuery(legacyParams)}`,
      );

      return handleResponse(response);
    }

    if (status === "canceled") {
      const response = await fetchClient(
        `/server/package/cancel-package${buildQuery(legacyParams)}`,
      );

      return handleResponse(response);
    }

    if (status === "failure") {
      const failureParams =
        legacyParams?.id_locker !== undefined &&
        legacyParams?.id_locker !== null &&
        legacyParams?.id_locker !== ""
          ? { id_locker: legacyParams.id_locker }
          : undefined;

      const response = await fetchClient(
        `/server/package/failures${buildQuery(failureParams)}`,
      );

      return handleResponse(response);
    }

    const response = await fetchClient(
      `/server/package/query-package-company${buildQuery({
        ...cleanParams,
        status_filter: status,
      })}`,
    );

    return handleResponse(response);
  },

  /**
   * Consulta general de paquetes de una unidad.
   * Se conserva por compatibilidad con otras pantallas, pero ahora usa
   * id_company + id_unit en lugar del contrato legacy by_id_unit/to_company.
   */
  async getOrdersByUnit(
    companyId: number,
    unitId: string | number,
    language: string = "es",
  ) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const response = await fetchClient(
      `/server/package/query-package-company${buildQuery({
        language,
        id_company: companyId,
        id_unit: unitId,
        date_start: startOfYear.getTime(),
        date_end: now.getTime(),
      })}`,
    );

    return handleResponse(response);
  },

  async getScheduled(params?: Record<string, any>) {
    const response = await fetchClient(
      `/server/package/schedule${buildQuery(params)}`,
    );

    return handleResponse(response);
  },

  async getCancelPackage(params?: Record<string, any>) {
    const response = await fetchClient(
      `/server/package/cancel-package${buildQuery(params)}`,
    );

    return handleResponse(response);
  },

  async getMetricsOrders(params?: Record<string, any>) {
    const response = await fetchClient(
      `/server/metric/query-metric-order${buildQuery(params)}`,
    );

    return handleResponse(response);
  },
};