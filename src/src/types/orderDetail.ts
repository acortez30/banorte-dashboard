/* ==========================================================================
   DROPPI — orders.types.ts
   Fuente única de verdad para tipos del módulo orders.
   
   ⚠️  REGLA: si necesitas un OrderStatus nuevo, agrégalo AQUÍ.
        Nunca definas OrderStatus en un component o page.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Status primitivo — refleja exactamente lo que puede devolver el backend
   -------------------------------------------------------------------------- */
export type OrderStatus =
  | "completed"
  | "in_locker"
  | "in_transit"
  | "returned"
  | "expired"
  | "canceled_locker"
  | "canceled_picked"
  | "processing"
  | "scheduled"
  | "delivered"
  | "pending_validate"
  | "pending_payment"
  | "in_progress"
  | "failure";

/* --------------------------------------------------------------------------
   Mapa backend → status
   Clave: `${status_package}-${id_status_code_package}`
   -------------------------------------------------------------------------- */
export const ORDER_STATUS_MAP: Record<string, OrderStatus> = {
  "16-18": "completed",
  "14-17": "in_locker",
  "33-32": "returned",
  "14-32": "expired",
  "14-20": "canceled_locker",
  "33-20": "canceled_picked",
  "14-21": "in_transit",
  "16-17": "delivered",
};

/* --------------------------------------------------------------------------
   Badge visual — design system tokens (Tailwind)
   -------------------------------------------------------------------------- */
export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  completed:
    "bg-green-500/10 text-green-600",

  delivered:
    "bg-green-500/10 text-green-600",

  in_locker:
    "bg-blue-500/10 text-blue-600",

  in_transit:
    "bg-blue-500/10 text-blue-600",

  returned:
    "bg-purple-400/10 text-purple-600",

  expired:
    "bg-red-500/10 text-red-600",

  canceled_locker:
    "bg-gray-500/10 text-gray-600",

  canceled_picked:
    "bg-gray-500/10 text-gray-600",

  scheduled:
    "bg-yellow-500/10 text-yellow-600",

  processing:
    "bg-yellow-500/10 text-yellow-600",

  pending_validate:
    "bg-orange-500/10 text-orange-600",

  pending_payment:
    "bg-amber-500/10 text-amber-600",

  in_progress:
    "bg-blue-500/10 text-blue-600",

  failure:
    "bg-red-500/10 text-red-600",
};

/* --------------------------------------------------------------------------
   Statuses que permiten generar QR
   Centralizado aquí para que cualquier hook lo consulte
   -------------------------------------------------------------------------- */
export const QR_ALLOWED_STATUSES: OrderStatus[] = ["expired", "in_locker"];

/* --------------------------------------------------------------------------
   Entidades del dominio
   -------------------------------------------------------------------------- */

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

export interface OrderLocker {
  id_locker: number | null;
  name: string;
  door_assigned: string;
  max_length: string;
  service_type: string;
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
}

export interface OrderDetail {
  /** id del paquete (tbl_package). Fuente: result.order_details.id_package.
   *  Usado para el nuevo flujo de recording por paquete
   *  (/v2/server/system/recording/package/:id_package). */
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
}