import { Transaction, TransactionType } from "@/types/finance.types";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";

// ===============================
// 🔧 TYPES
// ===============================

interface UseFinanceFiltersProps {
  transactions: Transaction[];
  typeFilter: TransactionType | "all";
  searchQuery: string;
  dateRange?: DateRange;

  /**
   * 🔥 OPCIONAL (pro level)
   */
  sortBy?: keyof Transaction;
  sortDirection?: "asc" | "desc";
}

// ===============================
// 🧠 HOOK
// ===============================

export function useFinanceFilters({
  transactions,
  typeFilter,
  searchQuery,
  dateRange,
  sortBy,
  sortDirection = "desc",
}: UseFinanceFiltersProps) {
  return useMemo(() => {
    let result = [...transactions];

    // ===============================
    // 🏷 FILTER BY TYPE
    // ===============================
    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter);
    }

    // ===============================
    // 🔍 SEARCH
    // ===============================
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();

      result = result.filter((t) =>
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.client.toLowerCase().includes(q)
      );
    }

    // ===============================
    // 📅 DATE RANGE FILTER
    // ===============================
    if (dateRange?.from && dateRange?.to) {
      const from = startOfDay(dateRange.from);
      const to = endOfDay(dateRange.to);

      result = result.filter((t) => {
        const txnDate = parseSafeDate(t.date);
        if (!txnDate) return false;

        return txnDate >= from && txnDate <= to;
      });
    }

    // ===============================
    // 🔄 SORTING (OPTIONAL)
    // ===============================
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        // fechas
        if (sortBy === "date") {
          const dateA = parseSafeDate(aValue as string)?.getTime() || 0;
          const dateB = parseSafeDate(bValue as string)?.getTime() || 0;
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }

        // números
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // strings
        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return result;
  }, [transactions, typeFilter, searchQuery, dateRange, sortBy, sortDirection]);
}

// ===============================
// 🧩 HELPERS
// ===============================

function parseSafeDate(date: string): Date | null {
  // soporta ISO y fallback
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}