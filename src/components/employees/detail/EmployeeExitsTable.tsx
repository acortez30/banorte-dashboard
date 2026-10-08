import {
  useMemo,
  useState,
} from "react";

import {
  LogOut,
} from "lucide-react";

import SortableTableHeader from "@/components/common/SortableTableHeader";
import TablePagination from "@/components/common/TablePagination";

import type {
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";
import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/employees/detail/EmployeeHistoryTable.css";

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

type HistorySortKey =
  | "date"
  | "time"
  | "locker"
  | "compartment";

interface EmployeeExitsTableProps {
  events: EmployeeAccessEvent[];
  lockers: LockerIsland[];
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function EmployeeExitsTable({
  events,
  lockers,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: EmployeeExitsTableProps) {
  const [sortKey, setSortKey] = useState<HistorySortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const lockerById = useMemo(
    () => new Map(lockers.map((locker) => [locker.id, locker])),
    [lockers],
  );

  const sortedEvents = useMemo(
    () =>
      sortRows(
        events,
        sortKey,
        sortDirection,
        {
          date: (event) => new Date(`${event.date}T12:00:00`),
          time: (event) => new Date(event.occurredAt),
          locker: (event) => lockerById.get(event.lockerId)?.alias ?? "",
          compartment: (event) => event.compartmentNumber,
        },
      ),
    [events, lockerById, sortDirection, sortKey],
  );

  const visibleEvents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedEvents.slice(start, start + pageSize);
  }, [page, pageSize, sortedEvents]);

  const handleSort = (key: HistorySortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "date" || key === "time" ? "desc" : "asc");
    }
    onPageChange(1);
  };

  return (
    <section className="employee-history-table">
      <div className="employee-history-table__scroll">
        <table>
          <thead>
            <tr>
              <SortableTableHeader
                label="Fecha"
                active={sortKey === "date"}
                direction={sortDirection}
                onSort={() => handleSort("date")}
              />
              <SortableTableHeader
                label="Hora de salida"
                active={sortKey === "time"}
                direction={sortDirection}
                onSort={() => handleSort("time")}
              />
              <SortableTableHeader
                label="Isla"
                active={sortKey === "locker"}
                direction={sortDirection}
                onSort={() => handleSort("locker")}
              />
              <SortableTableHeader
                label="Compartimento"
                active={sortKey === "compartment"}
                direction={sortDirection}
                onSort={() => handleSort("compartment")}
              />
            </tr>
          </thead>

          <tbody>
            {visibleEvents.map((event) => (
              <tr key={event.id}>
                <td>
                  {dateFormatter.format(new Date(`${event.date}T12:00:00`))}
                </td>
                <td>
                  <span className="employee-history-table__time employee-history-table__time--exit">
                    <LogOut size={13} strokeWidth={2} />
                    {timeFormatter.format(new Date(event.occurredAt))}
                  </span>
                </td>
                <td>
                  <span className="employee-history-table__locker">
                    {lockerById.get(event.lockerId)?.alias ?? "—"}
                  </span>
                </td>
                <td>
                  <strong className="employee-history-table__compartment">
                    #{String(event.compartmentNumber).padStart(3, "0")}
                  </strong>
                </td>
              </tr>
            ))}

            {!visibleEvents.length ? (
              <tr>
                <td colSpan={4} className="employee-history-table__empty">
                  No hay salidas registradas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}
