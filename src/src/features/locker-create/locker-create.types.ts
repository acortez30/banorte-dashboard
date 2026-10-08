export interface LockerFormState {
  id_locker_type: number | null
  id_locker_model: number | null
  id_locker_privacy: number | null
  id_locker_environment: number | null
  id_status: number | null
  id_state: number | null
  id_city: number | null

  locker_name: string
  serial_locker: string

  locker_address: string
  latitud: string
  longitud: string

  description: string
  installation_version: string
  lsa_version: string

  virtual: number

  require_signature: boolean
  require_carrier_code: boolean
  delivery_photo: boolean
  pickup_photo: boolean
  extra_locker: boolean

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
}

export interface StepValidationResult {
  isValid: boolean
  missingFields: string[]
  invalidFields: string[]
}

export interface LockerDraft {
  version: number
  currentStep: number
  form: LockerFormState
  selectedModuleIds: number[]
  updatedAt: string
}
