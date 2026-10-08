import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";

import type {
  SortDirection,
} from "@/utils/tableSort";

import "@/styles/common/SortableTableHeader.css";

interface SortableTableHeaderProps {
  label: string;
  active: boolean;
  direction: SortDirection;
  onSort: () => void;
  className?: string;
  align?: "left" | "center" | "right";
}

export default function SortableTableHeader({
  label,
  active,
  direction,
  onSort,
  className = "",
  align = "left",
}: SortableTableHeaderProps) {
  const Icon = active
    ? direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  const nextDirection =
    active && direction === "asc"
      ? "descendente"
      : "ascendente";

  return (
    <th
      className={`sortable-table-header sortable-table-header--${align} ${className}`.trim()}
      aria-sort={
        active
          ? direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        type="button"
        className={`sortable-table-header__button ${active ? "sortable-table-header__button--active" : ""}`}
        onClick={onSort}
        title={`Ordenar ${label.toLowerCase()} de forma ${nextDirection}`}
      >
        <span>{label}</span>
        <Icon
          size={13}
          strokeWidth={2.1}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}
