

// ===============================
// 📄 TRANSACTIONS
// ===============================

import { RevenueData, StatusConfigMap, Transaction, TypeLabelsMap } from "@/types/finance.types";

export const sampleTransactions: Transaction[] = [
  {
    id: "TXN-001",
    description: "Servicio de locker mensual",
    type: "service_payment",
    amount: 850,
    status: "completed",
    client: "María García",
    date: "2026-02-21",
    method: "Tarjeta",
  },
  {
    id: "TXN-002",
    description: "Cargo por retraso - 3 días",
    type: "late_fee",
    amount: 120,
    status: "completed",
    client: "Carlos López",
    date: "2026-02-21",
    method: "Tarjeta",
  },
  {
    id: "TXN-003",
    description: "Registro de nuevo cliente",
    type: "registration",
    amount: 250,
    status: "completed",
    client: "Ana Martínez",
    date: "2026-02-20",
    method: "Transferencia",
  },
  {
    id: "TXN-004",
    description: "Servicio de envío express",
    type: "service_payment",
    amount: 180,
    status: "pending",
    client: "Roberto Sánchez",
    date: "2026-02-20",
    method: "Pendiente",
  },
  {
    id: "TXN-005",
    description: "Reembolso por servicio cancelado",
    type: "refund",
    amount: -350,
    status: "refunded",
    client: "Laura Hernández",
    date: "2026-02-19",
    method: "Tarjeta",
  },
  {
    id: "TXN-006",
    description: "Cargo por retraso - 5 días",
    type: "late_fee",
    amount: 200,
    status: "completed",
    client: "Pedro Ramírez",
    date: "2026-02-19",
    method: "Efectivo",
  },
  {
    id: "TXN-007",
    description: "Servicio de locker trimestral",
    type: "service_payment",
    amount: 2200,
    status: "completed",
    client: "Sofía Torres",
    date: "2026-02-18",
    method: "Transferencia",
  },
  {
    id: "TXN-008",
    description: "Registro corporativo",
    type: "registration",
    amount: 500,
    status: "pending",
    client: "Miguel Flores",
    date: "2026-02-18",
    method: "Pendiente",
  },
  {
    id: "TXN-009",
    description: "Servicio de shop",
    type: "service_payment",
    amount: 430,
    status: "failed",
    client: "Elena Ruiz",
    date: "2026-02-17",
    method: "Tarjeta",
  },
  {
    id: "TXN-010",
    description: "Cargo por retraso - 1 día",
    type: "late_fee",
    amount: 40,
    status: "completed",
    client: "Jorge Díaz",
    date: "2026-02-17",
    method: "Tarjeta",
  },
];

// ===============================
// 📈 REVENUE CHART
// ===============================

export const revenueData: RevenueData[] = [
  { month: "Sep", revenue: 28000, expenses: 12000 },
  { month: "Oct", revenue: 32000, expenses: 14000 },
  { month: "Nov", revenue: 29000, expenses: 13500 },
  { month: "Dic", revenue: 38000, expenses: 15000 },
  { month: "Ene", revenue: 35000, expenses: 14200 },
  { month: "Feb", revenue: 42000, expenses: 16000 },
];

// ===============================
// 🎯 STATUS CONFIG (UI)
// ===============================

export const getStatusConfig = (t: (key: string) => string): StatusConfigMap => ({
  completed: {
    label: t("finance.status.completed"),
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    label: t("finance.status.pending"),
    className: "bg-warning/10 text-warning border-warning/20",
  },
  failed: {
    label: t("finance.status.failed"),
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  refunded: {
    label: t("finance.status.refunded"),
    className: "bg-info/10 text-info border-info/20",
  },
});

// ===============================
// 🏷 TYPE LABELS (i18n)
// ===============================

export const getTypeLabels = (t: (key: string) => string): TypeLabelsMap => ({
  service_payment: t("finance.type.service_payment"),
  late_fee: t("finance.type.late_fee"),
  registration: t("finance.type.registration"),
  refund: t("finance.type.refund"),
});