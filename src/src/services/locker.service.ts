import { fetchClient } from "@/api/fetchClient"
import { handleResponse } from "@/api/handleResponse"

// ─────────────────────────────────────────────
// PARÁMETROS DE QUERY
// ─────────────────────────────────────────────

export interface LockerQueryParams {
  page?: number
  limit?: number
  search?: string
  id_status?: number
  id_locker_type?: number
  [key: string]: string | number | boolean | undefined
}

// ─────────────────────────────────────────────
// PAYLOAD: postLocker
// Debe coincidir con LockerFormState + modules
// ─────────────────────────────────────────────

export interface PostLockerPayload {
  // Catálogos
  id_locker_type: number
  id_locker_model: number
  id_locker_privacy: number
  id_locker_environment: number
  id_status: number

  // Ubicación
  id_state: number
  id_city: number
  locker_address: string
  latitud: string
  longitud: string

  // Datos generales
  locker_name: string
  serial_locker: string
  description: string
  installation_version: string
  lsa_version: string

  // Flags
  virtual: number
  require_signature: boolean
  require_carrier_code: boolean
  delivery_photo: boolean
  pickup_photo: boolean
  extra_locker: boolean

  // Red
  pc_locker: {
    name_pc_locker: string
    ip_pc_locker: string
    description_pc_locker: string
  }
  ap_locker: {
    ap_name_locker: string
    ip_ap_locker: string
    serial_ap_locker: string
    description: string
  }

  // Módulos seleccionados
  modules: number[]
}

// ─────────────────────────────────────────────
// PAYLOAD: settings
// El backend todavía no documenta el contrato.
// ─────────────────────────────────────────────

export type UpdateLockerSettingsPayload = Record<string, unknown>

// ─────────────────────────────────────────────
// PAYLOAD: changeStatusOfCompartment
// ─────────────────────────────────────────────

export type CompartmentStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "OPEN"
  | "BLOCKED"
  | "OFFLINE"

export interface ChangeCompartmentStatusPayload {
  id_status: CompartmentStatus
  reason?: string
}

// ─────────────────────────────────────────────
// INSTALLATION IMAGES
// ─────────────────────────────────────────────

/**
 * IMPORTANTE:
 * La colección de Postman documenta el endpoint, pero NO documenta
 * el nombre del campo multipart/form-data.
 *
 * Se usa "images" como supuesto aislado para poder conectar la UI.
 * Si backend confirma otro nombre (por ejemplo "files" o "photos"),
 * cambia únicamente esta constante.
 */
export const INSTALLATION_IMAGE_FORM_KEY = "images"

function getStoredUser(): any {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}")
  } catch {
    return {}
  }
}

function isStoredSuperUser(): boolean {
  const user = getStoredUser()

  const idUserType = Number(
    user?.id_user_type ?? user?.data_company?.id_user_type ?? 0
  )

  const userTypeName = String(
    user?.user_type ??
      user?.type_user ??
      user?.name_user_type ??
      user?.data_company?.user_type ??
      user?.data_company?.type_user ??
      user?.data_company?.name_user_type ??
      ""
  )
    .trim()
    .toUpperCase()

  return (
    idUserType === 1 ||
    userTypeName.includes("SUPER USUARIO") ||
    userTypeName.includes("SUPER USER") ||
    userTypeName === "SUPER"
  )
}

// ─────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────

export const lockersService = {
  async queryLockerWarehouse(params: LockerQueryParams) {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()

    const response = await fetchClient(
      `/server/locker/query-locker-warehouse?${query}`
    )
    return handleResponse(response)
  },

  async getLockers(params: LockerQueryParams) {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()

    const response = await fetchClient(
      `/server/locker/query-locker-retail?${query}`
    )
    return handleResponse(response)
  },

  async getMetricsLocker(params: LockerQueryParams) {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()

    const response = await fetchClient(
      `/server/metric/query-metric-locker?${query}`
    )
    return handleResponse(response)
  },

  async getAllModules() {
    const response = await fetchClient(`/v2/server/locker/modules`)
    return handleResponse(response)
  },

  async getLockerEnvironments() {
    const response = await fetchClient(`/v2/server/system/locker-environments`)
    return handleResponse(response)
  },

  async getLockerTypes() {
    const response = await fetchClient(`/v2/server/system/locker-types`)
    return handleResponse(response)
  },

  async getLockerModels() {
    const response = await fetchClient(`/v2/server/system/locker-models`)
    return handleResponse(response)
  },

  async getLockerPrivacy() {
    const response = await fetchClient(`/v2/server/system/locker-privacy`)
    return handleResponse(response)
  },

  async postLocker(body: PostLockerPayload) {
    const response = await fetchClient(`/v2/server/locker/assemble`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    return handleResponse(response)
  },

  /**
   * Modifica parámetros de configuración del locker.
   * Acción reservada en frontend al usuario SUPER.
   */
  async updateLockerSettings(
    id_locker: string | number,
    body: UpdateLockerSettingsPayload
  ) {
    if (!isStoredSuperUser()) {
      throw new Error(
        "No autorizado. Solo el usuario SUPER puede modificar la configuración del locker."
      )
    }

    const response = await fetchClient(
      `/v2/server/lockers/${id_locker}/settings`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    )

    return handleResponse(response)
  },

  /**
   * Sube evidencias fotográficas de instalación.
   * Acción reservada en frontend al usuario SUPER.
   *
   * POST /v2/server/lockers/{id_locker}/images/installation
   */
  async uploadInstallationImages(
    id_locker: string | number,
    files: File[]
  ) {
    if (!isStoredSuperUser()) {
      throw new Error(
        "No autorizado. Solo el usuario SUPER puede subir evidencias de instalación."
      )
    }

    if (!files.length) {
      throw new Error("Selecciona al menos una fotografía.")
    }

    const formData = new FormData()

    files.forEach((file) => {
      formData.append(INSTALLATION_IMAGE_FORM_KEY, file)
    })

    const response = await fetchClient(
      `/v2/server/lockers/${id_locker}/images/installation`,
      {
        method: "POST",
        body: formData,
      }
    )

    return handleResponse(response)
  },

  async changeStatusOfCompartment(
    id_locker: string,
    id_locker_dimension: string,
    body: ChangeCompartmentStatusPayload
  ) {
    const response = await fetchClient(
      `/v2/server/locker/${id_locker}/door/${id_locker_dimension}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    )
    return handleResponse(response)
  },

  /**
   * Puerta en FALLO sin paquete: cambia el compartimento a CERRADO (id_status 5).
   * Endpoint exclusivo para usuarios de Soporte.
   */
  async closeFailedCompartment(
    id_locker: number,
    id_locker_dimension: number,
    language = "es"
  ) {
    const query = new URLSearchParams({ language }).toString()
    const response = await fetchClient(
      `/v2/server/locker/${id_locker}/door/${id_locker_dimension}?${query}`,
      {
        method: "PUT",
        body: JSON.stringify({ id_status: 5 }),
      }
    )

    return handleResponse(response)
  },

  /**
   * Puerta en FALLO con paquete pendiente de validación (status 82).
   * El backend mueve el paquete a status 14 y conserva la puerta en FALLO.
   */
  async verifyPackageInFailedCompartment(
    id_locker: number,
    id_locker_dimension: number,
    language = "es"
  ) {
    const query = new URLSearchParams({
      language,
      action: "verify",
    }).toString()

    const response = await fetchClient(
      `/v2/server/locker/${id_locker}/door/${id_locker_dimension}?${query}`,
      {
        method: "PUT",
        body: JSON.stringify({}),
      }
    )

    return handleResponse(response)
  },
}
