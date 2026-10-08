/* ========================= */
/* ===== TYPES ============= */
/* ========================= */

export interface DeliveryTrendItem {
  name: string;
  value: number;
}

export interface CarrierItem {
  name: string;
  value: number;
  color: string;
}

export interface TopLockerItem {
  name: string;
  deliveries: number;
  percentage: number;
}

export interface AnalyticsStat {
  key: string; // i18n key
  value: string;
}

/* ========================= */
/* ===== DELIVERY TREND ==== */
/* ========================= */

export const deliveryTrend: DeliveryTrendItem[] = [
  { name: "Ene", value: 320 },
  { name: "Feb", value: 450 },
  { name: "Mar", value: 380 },
  { name: "Abr", value: 520 },
  { name: "May", value: 610 },
  { name: "Jun", value: 580 },
  { name: "Jul", value: 720 },
  { name: "Ago", value: 690 },
  { name: "Sep", value: 810 },
  { name: "Oct", value: 760 },
  { name: "Nov", value: 890 },
  { name: "Dic", value: 950 },
];

/* ========================= */
/* ===== CARRIER DATA ====== */
/* ========================= */

export const carrierData: CarrierItem[] = [
  {
    name: "FedEx",
    value: 35,
    color: "hsl(195, 65%, 43%)",
  },
  {
    name: "DHL",
    value: 28,
    color: "hsl(38, 92%, 50%)",
  },
  {
    name: "UPS",
    value: 22,
    color: "hsl(142, 76%, 36%)",
  },
  {
    name: "Estafeta",
    value: 15,
    color: "hsl(231, 50%, 23%)",
  },
];

/* ========================= */
/* ===== TOP LOCKERS ======= */
/* ========================= */

export const topLockers: TopLockerItem[] = [
  {
    name: "Locker Plaza Centro",
    deliveries: 1240,
    percentage: 42,
  },
  {
    name: "Locker Nuevo Sur",
    deliveries: 890,
    percentage: 30,
  },
  {
    name: "Locker San Pedro",
    deliveries: 520,
    percentage: 18,
  },
  {
    name: "Locker Cumbres",
    deliveries: 290,
    percentage: 10,
  },
];

/* ========================= */
/* ===== STATS (i18n) ====== */
/* ========================= */

export const analyticsStats: AnalyticsStat[] = [
  {
    key: "analytics.totalDeliveries",
    value: "6,940",
  },
  {
    key: "analytics.deliveryRate",
    value: "94.7%",
  },
  {
    key: "analytics.avgTime",
    value: "1.8 días",
  },
  {
    key: "analytics.activeClients",
    value: "312",
  },
];