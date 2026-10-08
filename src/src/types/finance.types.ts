// ===============================
// 💰 TRANSACTION CORE
// ===============================

export type TransactionType =
  | "service_payment"
  | "late_fee"
  | "registration"
  | "refund";

export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed"
  | "refunded";

export type PaymentMethod =
  | "Tarjeta"
  | "Efectivo"
  | "Transferencia"
  | "Pendiente";

// ===============================
// 📄 MAIN ENTITY
// ===============================

export interface Transaction {
  id: string;
  description: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  client: string;

  /**
   * ⚠️ Recomendado formato ISO: "2026-02-21"
   */
  date: string;

  method: PaymentMethod;
}

// ===============================
// 📊 KPI TYPES
// ===============================

export interface FinanceKPI {
  label: string;
  value: number;
  change?: number; // % cambio
}

// ===============================
// 📈 CHART TYPES
// ===============================

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

// ===============================
// 🔍 FILTER TYPES
// ===============================

export interface FinanceFilters {
  type: TransactionType | "all";
  search: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

// ===============================
// 📤 EXPORT TYPES
// ===============================

export interface ExportHeader<T> {
  key: keyof T;
  label: string;
}

// ===============================
// 🎯 UI HELPERS
// ===============================

export interface StatusConfig {
  label: string;
  className: string;
}

export type StatusConfigMap = Record<TransactionStatus, StatusConfig>;

export type TypeLabelsMap = Record<TransactionType, string>;

// ===============================
// 🔥 FUTURO (backend ready)
// ===============================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalTransactions: number;
  pendingAmount: number;
}