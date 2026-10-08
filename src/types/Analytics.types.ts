// types/Analytics.types.ts
// Espejo EXACTO del response real de:
// GET /server/metric/analytics?id_propierty=4&date_start=...&date_end=...&language=es

/* ============================= */
/* ===== API TYPES (raw) ======= */
/* ============================= */

export interface ApiAnalyticsKpis {
  total_deliveries:  number;
  delivery_rate:     number;   // porcentaje, ej: 64.3
  avg_pickup_time:   number;   // horas, ej: 5
  active_recipients: number;
}

export interface ApiTrendPoint {
  month: string;   // "2026-04"
  count: number;
}

export interface ApiCarrierDistribution {
  courier_name: string;
  count:        number;
  pct:          number;   // porcentaje, ej: 50
}

export interface ApiTopLocker {
  id_locker:   number;
  locker_name: string;
  count:       number;
}

export interface ApiAnalyticsResult {
  kpis:                 ApiAnalyticsKpis;
  delivery_trend:       ApiTrendPoint[];
  carrier_distribution: ApiCarrierDistribution[];
  top_lockers:          ApiTopLocker[];
}

export interface ApiAnalyticsResponse {
  mensaje_return: {
    ERROR:         boolean;
    ERROR_MENSAGGE: string;
    CODE:          number;
  };
  return_result: ApiAnalyticsResult;
}

/* ============================= */
/* ===== UI TYPES (mapped) ===== */
/* ============================= */

export interface UiKpi {
  key: keyof ApiAnalyticsKpis;
  title: string;
  tooltip: string;
  value: string;
}

export interface UiTrendPoint {
  name:  string;   // "Abr", "May", etc.
  value: number;   // count
}

export interface UiCarrierSlice {
  name:  string;
  value: number;   // pct
  count: number;
  color: string;
}

export interface UiTopLocker {
  id_locker:   number;
  name:        string;
  count:       number;
  percentage:  number;   // calculado sobre el total
}

export interface AnalyticsData {
  kpis:                UiKpi[];
  trend:               UiTrendPoint[];
  carrierDistribution: UiCarrierSlice[];
  topLockers:          UiTopLocker[];
}
