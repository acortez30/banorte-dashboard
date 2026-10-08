/* ==========================================================================
   DROPPI — orders.types.ts
   Fuente única de verdad para tipos del módulo orders.
   ========================================================================== */

export type OrderStatus =
  | "completed"
  | "in_locker"
  | "in_transit"
  | "returned"
  | "expired"
  | "canceled"
  | "canceled_locker"
  | "canceled_picked"
  | "processing"
  | "scheduled"
  | "delivered"
  | "pending_validate"
  | "pending_payment"
  | "in_progress"
  | "failure";

export const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  "16-18": "completed",
  "14-17": "in_locker",
  "33-32": "returned",
  "14-32": "expired",
  "14-20": "canceled_locker",
  "33-20": "canceled_picked",
  "14-21": "in_transit",
  "53-17": "in_transit",
  "16-17": "delivered",
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",

  expired:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",

  in_locker:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",

  in_transit:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-400",

  pending_validate:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-400",

  pending_payment:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",

  in_progress:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-400",

  returned:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400",

  canceled:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400",

  canceled_locker:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400",

  canceled_picked:
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400",

  scheduled:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-400",

  failure:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",

  processing:
    "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-400",

  delivered:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
};

export const QR_ALLOWED_STATUSES: OrderStatus[] = ["expired", "in_locker"];

export interface OrderClient {
  name: string;
  email: string;
  phone: string;
}

export interface OrderProperty {
  name: string;
  address: string;
  description: string;
  scheduled_attention: {
    weekdays: string;
    weekends: string;
  };
}

export interface OrderCompartment {
  id_locker_dimension: number | null;
  id_compartment_dimension: number | null;
  door_number: string;
  position: string;
  compartment_name: string;
  compartment_size: string;
}

export interface OrderLocker {
  id_locker: number | null;
  name: string;
  door_assigned: string;
  max_length: string;
  service_type: string;
  compartments: OrderCompartment[];
}

export interface OrderTimeline {
  id: number;
  title: string;
  timestamp: string;
  description: string;
  type: "success" | "warning" | "error" | "info";
}

export interface OrderNotification {
  id: number;
  type: string;
  method: string;
  status: "Enviado" | "Error";
  send_date: string;
}

export interface OrderEvidence {
  dropoff_photo: string;
  dropoff_timestamp: string;
  pickup_photo: string;
  pickup_timestamp: string;
  video_url: string;
  video_timestamp: string;
  delivery_photos: string[];
}

export interface OrderOffering {
  id: number;
  id_offering: number | null;
  id_offering_operation: number | null;
  operation: string;
  title: string;
  amount: string;
  status_id: number;
  has_cost: boolean;
}

export interface OrderDetail {
  id_package: number | null;
  tracking_number: string;
  status: OrderStatus;
  otp: string;
  rating: number;
  position: string;
  hash_package: string;

  registration_date: string;
  registration_date_no_format: string | null;

  expiration_date: string;
  expiration_date_no_format: string | null;

  collected_date: string;
  collected_date_no_format: string | null;

  client: OrderClient;
  property: OrderProperty;
  locker: OrderLocker;
  timeline: OrderTimeline[];
  notifications: OrderNotification[];
  evidence: OrderEvidence;
  offering?: OrderOffering;
}