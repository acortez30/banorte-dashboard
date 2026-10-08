import type { AppModel } from "@/contexts/ModelContext";

const PRIMARY = "hsl(195, 65%, 43%)";
const SUCCESS = "hsl(142, 76%, 36%)";
const WARNING = "hsl(38, 92%, 50%)";
const DESTRUCTIVE = "hsl(0, 84%, 60%)";
const SECONDARY = "hsl(231, 50%, 23%)";
const ACCENT = "hsl(262, 60%, 55%)";

export type Spark = { value: number }[];

export interface Kpi {
  key: string;
  title: string;
  value: string;
  change: string;
  up: boolean;
  spark: Spark;
}

const spark = (seed: number, range = 8): Spark =>
  Array.from({ length: 12 }, (_, i) => ({
    value: Math.round(seed + Math.sin(i * 1.1 + seed) * range + (i % 3) * 2),
  }));

// ---------------- KPIs ----------------
export function getKpis(model: AppModel): Kpi[] {
  if (model === "work") {
    return [
      { key: "activeAssets", title: "kpi.activeAssets", value: "184", change: "+6", up: true, spark: spark(20) },
      { key: "checkedOut", title: "kpi.checkedOut", value: "47", change: "+9%", up: true, spark: spark(15) },
      { key: "onTimeReturns", title: "kpi.onTimeReturns", value: "92.3%", change: "+1.8%", up: true, spark: spark(22) },
      { key: "overdue", title: "kpi.overdue", value: "6", change: "+2", up: false, spark: spark(8) },
      { key: "activeEmployees", title: "kpi.activeEmployees", value: "58", change: "+4", up: true, spark: spark(18) },
      { key: "avgUtilization", title: "kpi.avgUtilization", value: "68%", change: "+3%", up: true, spark: spark(14) },
      { key: "maintenanceDue", title: "kpi.maintenanceDue", value: "9", change: "-1", up: true, spark: spark(7) },
      { key: "assetValueOut", title: "kpi.assetValueOut", value: "$284K", change: "+12%", up: true, spark: spark(25) },
    ];
  }
  if (model === "box") {
    return [
      { key: "reservations", title: "kpi.reservations", value: "1,284", change: "+14.2%", up: true, spark: spark(22) },
      { key: "avgSession", title: "kpi.avgSession", value: "3.4h", change: "-12min", up: true, spark: spark(16) },
      { key: "repeatUsers", title: "kpi.repeatUsers", value: "47%", change: "+5%", up: true, spark: spark(18) },
      { key: "revenue", title: "kpi.revenue", value: "$48.2K", change: "+9.6%", up: true, spark: spark(24) },
      { key: "cancellations", title: "kpi.cancellations", value: "32", change: "-8", up: true, spark: spark(9) },
      { key: "utilization", title: "kpi.utilization", value: "76%", change: "+4%", up: true, spark: spark(20) },
      { key: "totalServicesUsed", title: "kpi.totalServicesUsed", value: "2,140", change: "+11%", up: true, spark: spark(26) },
      { key: "peakHourLoad", title: "kpi.peakHourLoad", value: "94%", change: "+6%", up: true, spark: spark(23) },
    ];
  }
  // home
  return [
    { key: "totalDeliveries", title: "kpi.totalDeliveries", value: "1,842", change: "+12.3%", up: true, spark: spark(22) },
    { key: "deliveryRate", title: "kpi.deliveryRate", value: "94.7%", change: "+2.1%", up: true, spark: spark(20) },
    { key: "avgPickupTime", title: "kpi.avgPickupTime", value: "1.8h", change: "-15min", up: true, spark: spark(15) },
    { key: "overduePackages", title: "kpi.overduePackages", value: "14", change: "-3", up: true, spark: spark(10) },
    { key: "activeRecipients", title: "kpi.activeRecipients", value: "312", change: "+18", up: true, spark: spark(19) },
    { key: "occupancyRate", title: "kpi.occupancyRate", value: "73%", change: "+4%", up: true, spark: spark(21) },
    { key: "totalServicesUsed", title: "kpi.totalServicesUsed", value: "2,486", change: "+9.4%", up: true, spark: spark(24) },
    { key: "revenue", title: "kpi.revenue", value: "$36.8K", change: "+7.1%", up: true, spark: spark(23) },
  ];
}

// ---------------- Trend ----------------
export function getTrend(model: AppModel) {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const base = model === "work" ? 280 : model === "box" ? 420 : 520;
  return months.map((name, i) => ({
    name,
    primary: Math.round(base + i * 35 + Math.sin(i) * 60),
    secondary: Math.round(base * 0.85 + i * 30 + Math.cos(i) * 50),
  }));
}

// ---------------- Service Mix ----------------
export function getServiceMix(model: AppModel) {
  if (model === "work") {
    return [
      { name: "Mobile Devices", value: 38, color: PRIMARY },
      { name: "Tablets", value: 22, color: SUCCESS },
      { name: "Tools", value: 18, color: WARNING },
      { name: "Radios", value: 14, color: ACCENT },
      { name: "Safety Gear", value: 8, color: SECONDARY },
    ];
  }
  if (model === "box") {
    return [
      { name: "Storage", value: 42, color: PRIMARY },
      { name: "Pickup", value: 26, color: SUCCESS },
      { name: "Exchange", value: 18, color: WARNING },
      { name: "Drop-off", value: 14, color: ACCENT },
    ];
  }
  return [
    { name: "Marketplace", value: 32, color: PRIMARY },
    { name: "Reservar", value: 26, color: SUCCESS },
    { name: "Enviar", value: 21, color: WARNING },
    { name: "Intercambio", value: 13, color: ACCENT },
    { name: "Returns", value: 8, color: SECONDARY },
  ];
}

// ---------------- Top Services ----------------
export function getTopServices(model: AppModel) {
  if (model === "work") {
    return [
      { name: "Mobile Devices", count: 812, pct: 38, growth: "+12%", up: true },
      { name: "Tablets", count: 470, pct: 22, growth: "+8%", up: true },
      { name: "Tools", count: 384, pct: 18, growth: "+3%", up: true },
      { name: "Radios", count: 298, pct: 14, growth: "-2%", up: false },
      { name: "Safety Gear", count: 176, pct: 8, growth: "+5%", up: true },
    ];
  }
  if (model === "box") {
    return [
      { name: "Storage", count: 898, pct: 42, growth: "+14%", up: true },
      { name: "Pickup", count: 556, pct: 26, growth: "+9%", up: true },
      { name: "Exchange", count: 385, pct: 18, growth: "+4%", up: true },
      { name: "Drop-off", count: 301, pct: 14, growth: "-1%", up: false },
    ];
  }
  return [
    { name: "Marketplace", count: 796, pct: 32, growth: "+15%", up: true },
    { name: "Reservar", count: 646, pct: 26, growth: "+11%", up: true },
    { name: "Enviar", count: 522, pct: 21, growth: "+6%", up: true },
    { name: "Intercambio", count: 323, pct: 13, growth: "+2%", up: true },
    { name: "Returns", count: 199, pct: 8, growth: "-3%", up: false },
  ];
}

// ---------------- Heatmap (7 days × 12 hours) ----------------
// Returns COUNT of events per day-of-week × hour-of-day for the selected period.
// Deliveries peak mid-day (carriers drop off); pickups peak evenings (residents return home).
export function getHeatmap(model: AppModel, days_in_range = 30) {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const hours = ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p"];

  // Scale magnitude with the length of the selected range.
  const scale = Math.max(0.25, days_in_range / 30);
  const baseDeliveries = (model === "work" ? 6 : 8) * scale;
  const basePickups = (model === "work" ? 4 : 7) * scale;

  // Deliveries peak: weekday late-morning / early-afternoon (hour idx ~3-5, day idx 0-4)
  const deliveries = days.map((_, di) =>
    hours.map((_, hi) => {
      const hourPeak = 4; // ~12p
      const weekdayBoost = di < 5 ? 1 : 0.45;
      const dist = Math.abs(hi - hourPeak);
      const v = Math.max(0, baseDeliveries * weekdayBoost * (1 - dist * 0.12) + Math.sin(di + hi) * 2);
      return Math.max(0, Math.round(v));
    })
  );

  // Pickups peak: evenings on weekdays (hour idx ~9-11), spread on weekends
  const pickups = days.map((_, di) =>
    hours.map((_, hi) => {
      const hourPeak = di < 5 ? 10 : 6; // 6p weekdays, ~2p weekends
      const dist = Math.abs(hi - hourPeak);
      const dayBoost = di < 5 ? 1 : 0.85;
      const v = Math.max(0, basePickups * dayBoost * (1 - dist * 0.13) + Math.cos(di * 0.6 + hi) * 1.5);
      return Math.max(0, Math.round(v));
    })
  );

  return { days, hours, deliveries, pickups };
}

// ---------------- Time-to-Pickup distribution ----------------
export function getPickupDistribution(model: AppModel) {
  if (model === "work") {
    return [
      { bucket: "<1h", count: 18 },
      { bucket: "1–4h", count: 84 },
      { bucket: "4–12h", count: 162 },
      { bucket: "12–24h", count: 76 },
      { bucket: "1–2d", count: 42 },
      { bucket: "2d+", count: 14 },
    ];
  }
  return [
    { bucket: "<1h", count: 142 },
    { bucket: "1–4h", count: 386 },
    { bucket: "4–12h", count: 524 },
    { bucket: "12–24h", count: 312 },
    { bucket: "1–2d", count: 168 },
    { bucket: "2d+", count: 42 },
  ];
}

// ---------------- Compartment Performance by Size ----------------
// Six standard sizes. `count` = total compartments of this size,
// `inUse` = currently occupied. Utilization is derived from inUse/count.
export function getSizePerformance(_model: AppModel) {
  return [
    { size: "S",    count: 24, inUse: 19, turnover: 482, dwell: "3.2h" },
    { size: "M",    count: 28, inUse: 23, turnover: 612, dwell: "5.1h" },
    { size: "L",    count: 16, inUse: 11, turnover: 284, dwell: "8.4h" },
    { size: "XL",   count: 10, inUse: 5,  turnover: 96,  dwell: "14.2h" },
    { size: "XXL",  count: 6,  inUse: 2,  turnover: 38,  dwell: "22.6h" },
    { size: "XXXL", count: 4,  inUse: 1,  turnover: 14,  dwell: "31.8h" },
  ];
}

// ---------------- SLA breakdown ----------------
// SLA = % of packages picked up by the resident within `slaHours` of the
// notification being sent. Buckets are weekly within the selected range
// (or daily if the range is < 14 days).
export interface SlaPoint {
  bucketStart: Date;
  bucketEnd: Date;
  label: string;       // short axis label, e.g. "8 sep" or "Mié 12"
  rangeLabel: string;  // tooltip, e.g. "8–14 sep"
  onTime: number;
  late: number;
  failed: number;
}

export interface SlaResult {
  points: SlaPoint[];
  slaHours: number;
  targetPct: number;
  avgPct: number;
}

const MONTHS_ES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DAYS_ES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const fmtDay = (d: Date) => `${d.getDate()} ${MONTHS_ES[d.getMonth()]}`;

export function getSla(_model: AppModel, range?: { from?: Date; to?: Date }): SlaResult {
  const to = range?.to ?? new Date();
  const from = range?.from ?? new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
  const totalDays = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
  const useDaily = totalDays < 14;
  const bucketSize = useDaily ? 1 : 7;
  const bucketCount = Math.max(1, Math.ceil(totalDays / bucketSize));

  const points: SlaPoint[] = [];
  let totalOnTime = 0;
  let totalAll = 0;

  for (let i = 0; i < bucketCount; i++) {
    const bucketStart = new Date(from.getTime() + i * bucketSize * 86400000);
    const bucketEndCandidate = new Date(bucketStart.getTime() + (bucketSize - 1) * 86400000);
    const bucketEnd = bucketEndCandidate > to ? to : bucketEndCandidate;

    // Synthetic but stable counts trending slightly up over time.
    const seed = i + 1;
    const scale = useDaily ? 28 : 180;
    const onTime = Math.round(scale * (0.86 + Math.sin(seed) * 0.04 + i * 0.008));
    const late = Math.round(scale * (0.10 + Math.cos(seed) * 0.02));
    const failed = Math.max(1, Math.round(scale * (0.04 - i * 0.003)));

    totalOnTime += onTime;
    totalAll += onTime + late + failed;

    const label = useDaily
      ? `${DAYS_ES[bucketStart.getDay()]} ${bucketStart.getDate()}`
      : fmtDay(bucketStart);
    const rangeLabel = useDaily
      ? fmtDay(bucketStart)
      : `${bucketStart.getDate()}–${bucketEnd.getDate()} ${MONTHS_ES[bucketEnd.getMonth()]}`;

    points.push({ bucketStart, bucketEnd, label, rangeLabel, onTime, late, failed });
  }

  const avgPct = totalAll > 0 ? Math.round((totalOnTime / totalAll) * 1000) / 10 : 0;
  return { points, slaHours: 48, targetPct: 95, avgPct };
}

// ---------------- Funnel ----------------
export function getFunnel(model: AppModel) {
  const base = model === "work" ? 420 : 1000;
  return [
    { stage: "funnel.created", value: base, color: PRIMARY },
    { stage: "funnel.notified", value: Math.round(base * 0.96), color: PRIMARY },
    { stage: "funnel.accessed", value: Math.round(base * 0.84), color: PRIMARY },
    { stage: "funnel.pickedUp", value: Math.round(base * 0.78), color: PRIMARY },
    { stage: "funnel.closed", value: Math.round(base * 0.74), color: PRIMARY },
  ];
}

// ---------------- Anomalies ----------------
export function getAnomalies(model: AppModel) {
  if (model === "work") {
    return [
      { severity: "warning", text: "anomaly.work1" },
      { severity: "info", text: "anomaly.work2" },
      { severity: "destructive", text: "anomaly.work3" },
    ];
  }
  return [
    { severity: "warning", text: "anomaly.home1" },
    { severity: "info", text: "anomaly.home2" },
    { severity: "destructive", text: "anomaly.home3" },
    { severity: "info", text: "anomaly.home4" },
  ];
}

// ---------------- Top Compartments ----------------
export function getTopCompartments(_model: AppModel) {
  return [
    { id: "A-04", size: "M", uses: 142, dwell: "4.2h", status: "active" },
    { id: "B-12", size: "S", uses: 138, dwell: "2.8h", status: "active" },
    { id: "A-09", size: "L", uses: 124, dwell: "7.1h", status: "active" },
    { id: "C-02", size: "M", uses: 118, dwell: "5.4h", status: "maintenance" },
    { id: "B-07", size: "S", uses: 112, dwell: "3.0h", status: "active" },
  ];
}
