// src/hooks/useTransactions.ts

import { useState, useEffect, useCallback } from "react";
import {
  ApiServicesResponse,
  ApiServiceTransaction,
  ServiceTransaction,
  ServiceQueryParams,
} from "@/types/ServiceTransaction.types";
import { useAuth } from "@/contexts/AuthContext";
import { packageService } from "@/services/package.service";

// ─────────────────────────────────────────────────────────────────────────────
// MAPPER — ApiServiceTransaction → ServiceTransaction
// ─────────────────────────────────────────────────────────────────────────────

function mapTransaction(
  raw: ApiServiceTransaction,
  propertyName: string
): ServiceTransaction {
  const customer = `${raw.first_name ?? ""} ${raw.surname ?? ""}`.trim();

  const hasDebt = raw.status === "expired" || raw.status === "door_fail";

  return {
    // IDs
    id: raw.code_service,
    id_service: raw.id_service,
    id_service_transaction: raw.id_service_transaction,

    // Servicio
    service_name: raw.operation_name,
    offering_title: raw.offering_title,
    id_offering: raw.id_offering,

    // Cliente
    customer,
    email: raw.email,

    // Estado base del backend
    status: raw.status,
    id_status_service: raw.id_status_service,
    has_debt: hasDebt,

    // Fechas
    delivery_date: raw.date ?? null,
    pickup_date: null,
    cancel_date: null,
    expiration_date: null,
    expired_registration_date: null,

    // Monto
    amount: raw.amount,

    // Paquete / locker
    id_package: raw.id_package,
    id_status_package: raw.id_status_package,
    id_status_code_package: raw.id_status_code_package ?? null,
    id_locker_source: raw.id_locker_source,

    tracking_number: raw.code_service,
    order_number: String(raw.id_service_transaction),

    // Propiedad
    property_name: propertyName,

    // Campos que solo llegan en detalle
    locker_name: "—",
    position: "—",
    door_number: 0,
    compartment_name: "—",
    compartment_size: "—",
    phone: "—",
    otp: null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE FECHA
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultDateRange(): { date_start: number; date_end: number } {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  return {
    date_start: start.getTime(),
    date_end: end.getTime(),
  };
}

function getYearDateRange(): { date_start: number; date_end: number } {
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

  return {
    date_start: start.getTime(),
    date_end: end.getTime(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useTransactions
// ─────────────────────────────────────────────────────────────────────────────

export function useTransactions(
  params?: Partial<Omit<ServiceQueryParams, "id_propierty">>
) {
  const { user } = useAuth();

  const [data, setData] = useState<ServiceTransaction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propertyId = user?.id_propierty ?? null;
  const propertyName = user?.name_propierty ?? "—";

  const fetchData = useCallback(async () => {
    if (!propertyId) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { date_start, date_end } = getDefaultDateRange();

      const json: ApiServicesResponse =
        await packageService.getServiceTransactions({
          id_propierty: propertyId,
          date_start: params?.date_start ?? date_start,
          date_end: params?.date_end ?? date_end,
          language: params?.language ?? "es",
        });

      if (json.mensaje_return?.ERROR === true) {
        throw new Error(`API error: ${json.mensaje_return.ERROR_MENSAGGE}`);
      }

      const mappedTransactions = (json.return_result ?? []).map((raw) =>
        mapTransaction(raw, propertyName)
      );

      setData(mappedTransactions);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar servicios"
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  }, [
    propertyId,
    propertyName,
    params?.date_start,
    params?.date_end,
    params?.language,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useTransactionDetail
// ─────────────────────────────────────────────────────────────────────────────

export function useTransactionDetail(idService: number | null) {
  const { user } = useAuth();

  const [data, setData] = useState<ServiceTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const propertyId = user?.id_propierty ?? null;
  const propertyName = user?.name_propierty ?? "—";

  const fetchDetail = useCallback(async () => {
    if (!idService) return;

    if (!propertyId) {
      setData(null);
      setError("No hay propiedad asociada al usuario");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { date_start, date_end } = getYearDateRange();

      const json: ApiServicesResponse =
        await packageService.getServiceTransactions({
          id_propierty: propertyId,
          date_start,
          date_end,
          language: "es",
        });

      if (json.mensaje_return?.ERROR === true) {
        throw new Error(`API error: ${json.mensaje_return.ERROR_MENSAGGE}`);
      }

      const raw = (json.return_result ?? []).find(
        (transaction) => transaction.id_service === idService
      );

      if (!raw) {
        throw new Error(
          `Transacción con id_service ${idService} no encontrada`
        );
      }

      setData(mapTransaction(raw, propertyName));
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar detalle de transacción"
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  }, [idService, propertyId, propertyName]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetail,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// useTransactionActions
// ─────────────────────────────────────────────────────────────────────────────

export function useTransactionActions() {
  const [loading, setLoading] = useState(false);

  async function cancelPackage(_idService: number): Promise<boolean> {
    setLoading(true);

    try {
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function resendNotification(
    _idService: number,
    _channel: "PUSH" | "EMAIL" | "SMS"
  ): Promise<boolean> {
    setLoading(true);

    try {
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setLoading(false);
  }

  return {
    cancelPackage,
    resendNotification,
    loading,
    reset,
  };
}