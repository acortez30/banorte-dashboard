import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";

interface Props<T> {
  data: T[];
  searchFields?: (keyof T)[];
  enableDateFilter?: boolean;

  externalDateRange?: DateRange;
  externalSetDateRange?: (v: DateRange | undefined) => void;
}

export function useTableFilters<T>({
  data,
  searchFields = [],
  enableDateFilter = false,
  externalDateRange,
  externalSetDateRange,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});

  /* ============================= */
  /* 📅 DEFAULT = MES ACTUAL       */
  /* ============================= */

  const defaultRange: DateRange | undefined = enableDateFilter
    ? {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }
    : undefined;

  const [internalDateRange, setInternalDateRange] =
    useState<DateRange | undefined>(defaultRange);

  // 🔥 backend mode tiene prioridad
  const dateRange = externalDateRange ?? internalDateRange;
  const setDateRange =
    externalSetDateRange ?? setInternalDateRange;

  /* ============================= */
  /* 🔧 NORMALIZE DATES            */
  /* ============================= */

  const normalizedDates = useMemo(() => {
    if (!enableDateFilter || !dateRange?.from) return null;

    const from = new Date(dateRange.from);
    from.setHours(0, 0, 0, 0);

    const to = dateRange.to
      ? new Date(dateRange.to)
      : new Date(dateRange.from);

    to.setHours(23, 59, 59, 999);

    return { from, to };
  }, [dateRange, enableDateFilter]);

  /* ============================= */
  /* 🔍 FILTER LOGIC              */
  /* ============================= */

  const filteredData = useMemo(() => {
    if (!data?.length) return [];

    let result = data;

    // 🔍 SEARCH
    if (search && searchFields.length) {
      const query = search.toLowerCase();

      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return (
            value != null &&
            String(value).toLowerCase().includes(query)
          );
        })
      );
    }

    // 🎯 FILTERS
    if (Object.keys(filters).length) {
      result = result.filter((item) =>
        Object.entries(filters).every(([key, value]) => {
          if (value === "all") return true;
          return item[key as keyof T] === value;
        })
      );
    }

    // 📅 DATE FILTER
    if (enableDateFilter && normalizedDates) {
      const { from, to } = normalizedDates;

      result = result.filter((item: any) => {
        const rawDate =
          item.receivedDate ||
          item.received_date ||
          item.createdAt ||
          item.date;

        if (!rawDate) return true;

        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return true;

        return date >= from && date <= to;
      });
    }

    return result;
  }, [data, search, filters, searchFields, normalizedDates, enableDateFilter]);

  return {
    search,
    setSearch,
    filters,
    setFilters,
    filteredData,
    dateRange,
    setDateRange,
  };
}