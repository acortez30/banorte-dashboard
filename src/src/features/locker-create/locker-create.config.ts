import type { LockerFormState } from "./locker-create.types"

export const LOCKER_DRAFT_STORAGE_KEY = "droppi_new_locker_draft_v2"
export const LOCKER_DRAFT_VERSION = 2

export const INITIAL_LOCKER_FORM: LockerFormState = {
  id_locker_type: null,
  id_locker_model: null,
  id_locker_privacy: null,
  id_locker_environment: null,
  id_status: 1,
  id_state: null,
  id_city: null,

  locker_name: "",
  serial_locker: "",

  locker_address: "",
  latitud: "",
  longitud: "",

  description: "",
  installation_version: "1.0.1",
  lsa_version: "1.0.1",

  virtual: 0,

  require_signature: false,
  require_carrier_code: false,
  delivery_photo: false,
  pickup_photo: false,
  extra_locker: false,

  pc_locker: {
    name_pc_locker: "",
    ip_pc_locker: "",
    description_pc_locker: "",
  },

  ap_locker: {
    ap_name_locker: "",
    ip_ap_locker: "",
    serial_ap_locker: "",
    description: "",
  },
}

export const WIZARD_STEPS = [
  {
    id: 1,
    name: "Configuración inicial",
    description: "Tipo, modelo, privacidad y ambiente",
    requiredFields: [
      "id_locker_type",
      "id_locker_model",
      "id_locker_privacy",
      "id_locker_environment",
    ],
  },
  {
    id: 2,
    name: "Datos generales",
    description: "Identidad y versiones del locker",
    requiredFields: ["locker_name", "serial_locker", "description"],
  },
  {
    id: 3,
    name: "Ubicación",
    description: "Estado, ciudad, dirección y coordenadas",
    requiredFields: [
      "id_state",
      "id_city",
      "locker_address",
      "latitud",
      "longitud",
    ],
  },
  {
    id: 4,
    name: "Configuración de red",
    description: "PC y access point del locker",
    requiredFields: ["pc_locker.name_pc_locker", "pc_locker.ip_pc_locker"],
  },
  {
    id: 5,
    name: "Preferencias",
    description: "Firma, códigos, fotografías y configuración adicional",
    requiredFields: [],
  },
  {
    id: 6,
    name: "Constructor de módulos",
    description: "Selecciona y ordena la configuración física",
    requiredFields: [],
  },
] as const

export type WizardStepId = (typeof WIZARD_STEPS)[number]["id"]

export const FIELD_LABELS: Record<string, string> = {
  id_locker_type: "Tipo de locker",
  id_locker_model: "Modelo",
  id_locker_privacy: "Privacidad",
  id_locker_environment: "Ambiente",
  locker_name: "Nombre del locker",
  serial_locker: "Número de serie",
  description: "Descripción",
  id_state: "Estado",
  id_city: "Ciudad",
  locker_address: "Dirección",
  latitud: "Latitud",
  longitud: "Longitud",
  "pc_locker.name_pc_locker": "Nombre de la PC",
  "pc_locker.ip_pc_locker": "IP de la PC",
}
