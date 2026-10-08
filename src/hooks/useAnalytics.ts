// hooks/useAnalytics.ts
import { useState, useEffect, useCallback } from "react";
import { subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/analatytics.service";
import type {
  ApiAnalyticsKpis,
  ApiTrendPoint,
  ApiCarrierDistribution,
  ApiTopLocker,
  AnalyticsData,
  UiKpi,
  UiTrendPoint,
  UiCarrierSlice,
  UiTopLocker,
} from "@/types/Analytics.types";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const MONTH_LABELS: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

const DONUT_COLORS = [
  "hsl(195, 65%, 43%)",
  "hsl(38, 92%, 50%)",
  "hsl(142, 76%, 36%)",
  "hsl(231, 50%, 23%)",
  "hsl(280, 60%, 50%)",
];

// i18n keys para cada KPI — coinciden con el key del objeto plano del API
const KPI_TITLE_KEYS: Record<keyof ApiAnalyticsKpis, string> = {
  total_deliveries:  "analytics.totalDeliveries",
  delivery_rate:     "analytics.deliveryRate",
  avg_pickup_time:   "analytics.avgTime",
  active_recipients: "analytics.activeClients",
};

const KPI_TOOLTIP_KEYS: Record<keyof ApiAnalyticsKpis, string> = {
  total_deliveries: "analytics.tooltips.totalDeliveries",
  delivery_rate: "analytics.tooltips.deliveryRate",
  avg_pickup_time: "analytics.tooltips.avgTime",
  active_recipients: "analytics.tooltips.activeClients",
};

// ─────────────────────────────────────────────────────────────
// FORMATTERS
// ─────────────────────────────────────────────────────────────

function formatKpiValue(key: keyof ApiAnalyticsKpis, value: number): string {
  if (key === "delivery_rate")  return `${value}%`;
  if (key === "avg_pickup_time") return `${value}h`;
  return value.toLocaleString();
}

// ─────────────────────────────────────────────────────────────
// MAPPERS — transforman API → UI
// ─────────────────────────────────────────────────────────────

function mapKpis(kpis: ApiAnalyticsKpis): UiKpi[] {
  return (Object.keys(kpis) as (keyof ApiAnalyticsKpis)[]).map((key) => ({
    key,
    title: KPI_TITLE_KEYS[key] ?? key,
    tooltip: KPI_TOOLTIP_KEYS[key] ?? "",
    value: formatKpiValue(key, kpis[key]),
  }));
}

function mapTrend(trend: ApiTrendPoint[]): UiTrendPoint[] {
  return trend.map((p) => {
    const monthPart = p.month.split("-")[1];
    return {
      name:  MONTH_LABELS[monthPart] ?? p.month,
      value: p.count,
    };
  });
}

function mapCarrierDistribution(data: ApiCarrierDistribution[]): UiCarrierSlice[] {
  return data.map((s, i) => ({
    name:  s.courier_name,
    value: s.pct,
    count: s.count,
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));
}

function mapTopLockers(data: ApiTopLocker[]): UiTopLocker[] {
  const total = data.reduce((acc, l) => acc + l.count, 0);
  return data.map((l) => ({
    id_locker:  l.id_locker,
    name:       l.locker_name,
    count:      l.count,
    percentage: total > 0 ? Math.round((l.count / total) * 100) : 0,
  }));
}

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useAnalytics(range?: DateRange) {
  const { user } = useAuth();

  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Admins sin propiedad asignada → id_propierty null → no llamar API
  const propertyId = user?.id_propierty ?? null;

  const fetchData = useCallback(async () => {
    if (!propertyId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const to   = range?.to   ?? new Date();
      const from = range?.from ?? subDays(to, 30);

      const json = await analyticsService.getAnalytics({
        id_propierty: propertyId,
        date_start:   from.getTime(),
        date_end:     to.getTime(),
        language:     "es",
      });

      if (json.mensaje_return?.ERROR === true) {
        throw new Error(json.mensaje_return?.ERROR_MENSAGGE ?? "API error");
      }

      const r = json.return_result;

      setData({
        kpis:                mapKpis(r.kpis),
        trend:               mapTrend(r.delivery_trend ?? []),
        carrierDistribution: mapCarrierDistribution(r.carrier_distribution ?? []),
        topLockers:          mapTopLockers(r.top_lockers ?? []),
      });
    } catch (err: unknown) {
      console.error("useAnalytics error:", err);
      setError(err instanceof Error ? err.message : "Error al cargar analytics");
    } finally {
      setLoading(false);
    }
  }, [propertyId, range?.from, range?.to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
