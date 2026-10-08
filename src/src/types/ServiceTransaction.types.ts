// src/types/ServiceTransaction.types.ts

// ─── UiStatus ─────────────────────────────────────────────────────────────────
export type UiStatus =
  | "completed"
  | "pending"
  | "in-progress"
  | "cancelled"
  | "expired"
  | "available"
  | "door_fail"
  | "collected";

// ─── API raw response ─────────────────────────────────────────────────────────
export interface ApiServiceTransaction {
  id_service_transaction: number;
  id_service: number;
  code_service: string;

  id_offering: number;
  offering_title: string;
  id_offering_operation: number;
  operation_name: string;

  id_user: number;
  first_name: string;
  surname: string;
  email: string;

  id_status_service: number;
  status: UiStatus;

  date: string | null;
  amount: string;

  id_package: number | null;
  id_status_package: number | null;
  id_status_code_package?: number | null;

  id_locker_source: number | null;
}

// ─── mensaje_return real del API ─────────────────────────────────────────────
export interface ApiMensajeReturn {
  ERROR: boolean;
  ERROR_MENSAGGE: string;
  CODE: number;
}

export interface ApiServicesResponse {
  mensaje_return: ApiMensajeReturn;
  return_result: ApiServiceTransaction[];
}

// ─── UI model ─────────────────────────────────────────────────────────────────
export interface ServiceTransaction {
  id: string;
  id_service: number;
  id_service_transaction: number;

  service_name: string;
  offering_title: string;
  id_offering: number;

  customer: string;
  email: string;

  status: UiStatus;
  id_status_service: number;
  has_debt: boolean;

  delivery_date: string | null;
  pickup_date: string | null;
  cancel_date: string | null;
  expiration_date: string | null;
  expired_registration_date: string | null;

  amount: string;

  id_package: number | null;
  id_status_package: number | null;
  id_status_code_package: number | null;
  id_locker_source: number | null;

  tracking_number: string;
  order_number: string;

  property_name: string;

  locker_name: string;
  position: string;
  door_number: number;
  compartment_name: string;
  compartment_size: string;
  phone: string;
  otp: string | null;
}

// ─── Query params ─────────────────────────────────────────────────────────────
export interface ServiceQueryParams {
  id_propierty: number;
  date_start: number;
  date_end: number;
  language?: "en" | "es";
}