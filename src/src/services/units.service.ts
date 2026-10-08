// src/services/units.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================= */
/* TYPES                         */
/* ============================= */

export type UnitPackagesStatusFilter =
  | "all"
  | "in_progress"
  | "expired"
  | "completed";

export interface UnitPackagesQuery {
  page?: number;
  limit?: number;
  status_filter?: UnitPackagesStatusFilter;
  language?: string;
}

export interface UnitPackageItem {
  id_locker: number | null;
  id_service: number | null;
  id_user: number | null;

  id_type_rate?: number | null;

  id_package: number;
  hash_package: string | null;

  extended_package: number | null;

  id_package_code: number | null;

  id_status_code_package: number | null;
  nombre_status_code_package: string | null;

  tracking_number: string | null;
  order_number: string | null;

  first_name: string | null;
  surname: string | null;
  email: string | null;

  locker_name: string | null;
  door_number: number | null;

  status_package: number | null;
  name_status_package: string | null;

  package_delivery_date: string | null;
  expiration_date: string | null;
  package_pickup_date: string | null;

  compartment_name: string | null;
  compartment_size: string | null;

  phone_used: string | null;

  update_date: string | null;
  cancel_date: string | null;

  otp: string | null;

  id_propierty: number | null;
  name_propierty: string | null;

  id_line_service: number | null;
  name_service: string | null;

  has_debt: boolean;

  id_offering_operation: number | null;
  operation_name: string | null;

  id_offering: number | null;

  origin: string | null;
  destination: string | null;

  unit_number: string | null;
  floor: string | null;
}

export interface UnitPackagesResponse {
  mensaje_return: {
    ERROR: boolean;
    ERROR_MENSAGGE: string;
    CODE: number;
  };

  return_result: UnitPackageItem[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

/* ============================= */
/* UNITS SERVICE                 */
/* ============================= */

export const unitsService = {
  /* ---------- SYSTEM ---------- */

  async getUnitTypes(lang: string) {
    const response = await fetchClient(
      `/v2/server/system/units-types?language=${lang}`,
    );

    return handleResponse(response);
  },

  async getConsumerTypes(lang: string) {
    const response = await fetchClient(
      `/v2/server/system/consumers-types?language=${lang}`,
    );

    return handleResponse(response);
  },

  async getSobriquetTypes() {
    const response = await fetchClient(
      `/server/system/available-property-sobriquet`,
    );

    return handleResponse(response);
  },

  /* ---------- FLOORS ---------- */

  async getFloors(propertyId: number) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/floors`,
    );

    return handleResponse(response);
  },

  async postFloor(
    propertyId: number,
    payload: any,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/floors`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return handleResponse(response);
  },

  /* ---------- UNITS ---------- */

  async getAllUnits(
    propertyId: number,
    lang: string,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units?language=${lang}`,
    );

    const data = await handleResponse(response);

    return (data.units ?? []).map((unit: any) => ({
      id: unit.id_unit,
      number: unit.unit,
      code: unit.acces_code,

      registeredUsers:
        unit.current_user_registered ?? 0,

      activeUsers:
        unit.current_user_active ?? 0,

      packagesMonth:
        unit.total_packages_current_month ?? 0,

      packagesTotal:
        unit.total_packages ?? 0,
    }));
  },

  async getUnit(
    propertyId: number,
    unitId: string,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/${unitId}`,
    );

    const data = await handleResponse(response);

    const unit =
      data?.units?.[0] ??
      data?.[0];

    if (!unit) {
      throw new Error("Unidad no encontrada");
    }

    return {
      id: unit.id_unit,
      number: unit.unit,
      code: unit.acces_code,

      registeredUsers:
        unit.current_user_registered ?? 0,

      activeUsers:
        unit.current_user_active ?? 0,

      packagesTotal:
        unit.total_packages ?? 0,

      packagesMonth:
        unit.total_packages_current_month ?? 0,

      residents:
        unit.recipients?.map((resident: any) => ({
          id: String(resident.id_user),

          name:
            `${resident.first_name ?? ""} ${
              resident.surname ?? ""
            }`.trim(),

          phone:
            resident.main_tlf ?? "",

          email:
            resident.email ?? "",

          status:
            resident.id_status === 1
              ? "Activo"
              : "Inactivo",

          access:
            resident.initial_access_completed
              ? "Completado"
              : "Pendiente",

          since:
            "",
        })) ?? [],
    };
  },

  /**
   * Paquetes asociados directamente a una unidad.
   *
   * IMPORTANTE:
   * El segundo segmento del endpoint utiliza el NÚMERO DE UNIDAD,
   * no necesariamente el id_unit de la ruta.
   *
   * GET
   * /v2/server/properties/:propertyId/units/:unitNumber/packages
   *
   * Backend:
   * - page
   * - limit
   * - status_filter
   * - language
   */
  async getUnitPackages(
    propertyId: number | string,
    unitNumber: number | string,
    params: UnitPackagesQuery = {},
  ): Promise<UnitPackagesResponse> {
    const query = new URLSearchParams();

    query.set(
      "page",
      String(params.page ?? 1),
    );

    query.set(
      "limit",
      String(params.limit ?? 10),
    );

    query.set(
      "status_filter",
      params.status_filter ?? "all",
    );

    query.set(
      "language",
      params.language ?? "es",
    );

    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/${encodeURIComponent(
        String(unitNumber),
      )}/packages?${query.toString()}`,
    );

    return handleResponse(response);
  },

  async postUnit(
    propertyId: number,
    floorId: number,
    payload: any,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/floors/${floorId}/units`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return handleResponse(response);
  },

  async editUnit(
    propertyId: number,
    unitId: number,
    payload: any,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/${unitId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

    return handleResponse(response);
  },

  async deleteUnit(
    propertyId: number,
    unitId: number,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/${unitId}`,
      {
        method: "DELETE",
      },
    );

    return handleResponse(response);
  },

  /* ---------- CONSUMERS IN UNIT ---------- */

  async assignUnitToConsumer(
    propertyId: number,
    payload: any,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/consumer-relate`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

    return handleResponse(response);
  },

  async updateUnitOfResident(
    propertyId: number,
    unitId: string,
    consumerId: string,
    payload: any,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/${unitId}/consumer/${consumerId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

    return handleResponse(response);
  },

  async deleteResident(
    propertyId: number,
    unitId: string,
    consumerId: string,
  ) {
    const response = await fetchClient(
      `/v2/server/properties/${propertyId}/units/${unitId}/consumer/${consumerId}`,
      {
        method: "DELETE",
      },
    );

    return handleResponse(response);
  },

  /* ---------- METRICS ---------- */

  async getMetricsUnit() {
    const response = await fetchClient(
      `/server/metric/units`,
    );

    return handleResponse(response);
  },
};