import type { OrderStatus } from "@/types/orderDetail";

const STATUS_MAP: Record<string, OrderStatus> = {
  "16-18": "completed",

  "14-17": "in_locker",
  "47-17": "in_locker",
  "57-17": "in_locker",

  "14-32": "expired",
  "33-32": "returned",

  "49-17": "in_transit",
  "53-17": "in_transit",
  "97-17": "in_transit",
  "117-17": "in_transit",
  "179-17": "in_transit",

  "14-20": "canceled_locker",
  "33-20": "canceled_picked",

  "82-17": "failure" as OrderStatus,

  // Estado que ya manejaba Order Detail
  "16-17": "delivered",
};

const SERVICE_STATUS_MAP: Record<number, OrderStatus> = {
  35: "scheduled",
  42: "pending_validate" as OrderStatus,
  12: "pending_payment" as OrderStatus,
  37: "in_transit",
};

function normalize(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

export function resolveOrderStatus(order: any): OrderStatus {
  const statusPackage = Number(
    order?.id_status_package ??
      order?.status_package ??
      order?.id_package_status
  );

  const statusCodePackage = Number(
    order?.id_status_code_package ??
      order?.status_code_package ??
      order?.id_code_package_status
  );

  const serviceStatus = Number(
    order?.id_status ??
      order?.service_status ??
      order?.id_service_status
  );

  const statusName = normalize(
    order?.nombre_status ??
      order?.status_name ??
      order?.name_status_package
  );

  const codeStatusName = normalize(
    order?.nombre_status_code_package ??
      order?.name_status_code_package
  );

  /* CANCELADOS */

  if (
    statusName === "CANCELED_UNUSED" ||
    statusName === "ELIMINADO" ||
    statusName === "CANCELADO" ||
    statusName.includes("CANCELED") ||
    statusName.includes("CANCEL")
  ) {
    return "canceled_locker";
  }

  /* STATUS PACKAGE + CODE */

  if (
    Number.isFinite(statusPackage) &&
    Number.isFinite(statusCodePackage)
  ) {
    const key = `${statusPackage}-${statusCodePackage}`;

    if (STATUS_MAP[key]) {
      return STATUS_MAP[key];
    }
  }

  /* ESTADOS LOGÍSTICOS */

  if (
    statusName.includes("IN_TRANSIT") ||
    statusName.includes("ROUTE") ||
    statusName.includes("WAREHOUSE") ||
    statusName.includes("CEDIS") ||
    statusName.includes("ALMACEN") ||
    statusName.includes("ALMACÉN") ||
    statusName.includes("ASSIGNED_CARRIER") ||
    codeStatusName === "ASIGNADO"
  ) {
    return "in_transit";
  }

  if (statusName.includes("IN_LOCKER")) {
    return "in_locker";
  }

  /* SERVICE STATUS */

  if (
    Number.isFinite(serviceStatus) &&
    SERVICE_STATUS_MAP[serviceStatus]
  ) {
    return SERVICE_STATUS_MAP[serviceStatus];
  }

  /* NOMBRES DEL BACKEND */

  if (statusName === "SCHEDULED") {
    return "scheduled";
  }

  if (
    statusName === "TO_BE_APPROVED" ||
    statusName === "PENDING_VALIDATE"
  ) {
    return "pending_validate" as OrderStatus;
  }

  if (
    statusName === "PENDIENTE_POR_PAGO" ||
    statusName === "PENDING_PAYMENT"
  ) {
    return "pending_payment" as OrderStatus;
  }

  return "processing" as OrderStatus;
}