export interface DashboardMetricValue {
  value: number;
  variation: number;
}

export interface DashboardOverviewCards {
  total_packages: DashboardMetricValue;
  active_lockers: DashboardMetricValue;
  pending_pickups: DashboardMetricValue;
  delivery_rate: DashboardMetricValue;
}

export type PackageStatusGroup =
  | "in_transit"
  | "delivered"
  | "pending"
  | string;

export interface PackageStatusDistributionItem {
  status_group: PackageStatusGroup;
  total: number;
}

export interface WeeklyTrendItem {
  day: string;
  day_name: string;
  total_packages: number;
}

export interface DashboardOverview {
  cards: DashboardOverviewCards;
  package_status_distribution: PackageStatusDistributionItem[];
  weekly_trend: WeeklyTrendItem[];
}

export interface DashboardOverviewApiMessage {
  ERROR: boolean;
  ERROR_MENSAGGE: string;
  CODE: number;
}

export interface DashboardOverviewResponse {
  mensaje_return: DashboardOverviewApiMessage;
  return_result: DashboardOverview;
}
