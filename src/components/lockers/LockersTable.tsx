import {
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  Search,
} from "lucide-react";

import SortableTableHeader from "@/components/common/SortableTableHeader";
import StatusBadge from "@/components/common/StatusBadge";
import TablePagination from "@/components/common/TablePagination";

import type {
  LockerIsland,
} from "@/types/dashboard";
import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/lockers/LockersTable.css";

interface LockerLoad {
  locker: LockerIsland;
  assigned: number;
  available: number;
  percent: number;
}

type LockerSortKey =
  | "alias"
  | "location"
  | "compartments"
  | "assigned"
  | "available"
  | "active";

interface LockersTableProps {
  loads: LockerLoad[];
  search: string;
  page: number;
  pageSize: number;
  total: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (locker: LockerIsland) => void;
}

export default function LockersTable({
  loads,
  search,
  page,
  pageSize,
  total,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onEdit,
}: LockersTableProps) {
  const [sortKey, setSortKey] = useState<LockerSortKey>("alias");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedLoads = useMemo(
    () =>
      sortRows(
        loads,
        sortKey,
        sortDirection,
        {
          alias: (load) => load.locker.alias,
          location: (load) => load.locker.location,
          compartments: (load) => load.locker.compartments,
          assigned: (load) => load.assigned,
          available: (load) => load.available,
          active: (load) => load.locker.active,
        },
      ),
    [loads, sortDirection, sortKey],
  );

  const visibleLoads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedLoads.slice(start, start + pageSize);
  }, [page, pageSize, sortedLoads]);

  const handleSort = (key: LockerSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    onPageChange(1);
  };

  return (
    <section className="lockers-table">
      <div className="lockers-table__toolbar">
        <div className="lockers-table__search">
          <Search
            size={17}
            strokeWidth={2}
            className="lockers-table__search-icon"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="lockers-table__search-input"
            placeholder="Buscar locker o ubicación"
            aria-label="Buscar lockers"
          />
        </div>

        <div className="lockers-table__count">
          <strong>{total}</strong>
          <span>{total === 1 ? "isla" : "islas"}</span>
        </div>
      </div>

      <div className="lockers-table__scroll">
        <table className="lockers-table__content">
          <thead>
            <tr>
              <SortableTableHeader
                label="Locker / Isla"
                active={sortKey === "alias"}
                direction={sortDirection}
                onSort={() => handleSort("alias")}
              />

              <SortableTableHeader
                label="Ubicación"
                active={sortKey === "location"}
                direction={sortDirection}
                onSort={() => handleSort("location")}
              />

              <SortableTableHeader
                label="Compartimentos"
                active={sortKey === "compartments"}
                direction={sortDirection}
                onSort={() => handleSort("compartments")}
              />

              <SortableTableHeader
                label="Empleados asignados"
                active={sortKey === "assigned"}
                direction={sortDirection}
                onSort={() => handleSort("assigned")}
              />

              <SortableTableHeader
                label="Disponibles"
                active={sortKey === "available"}
                direction={sortDirection}
                onSort={() => handleSort("available")}
              />

              <SortableTableHeader
                label="Estado"
                active={sortKey === "active"}
                direction={sortDirection}
                onSort={() => handleSort("active")}
              />

              <th className="lockers-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleLoads.map(({
              locker,
              assigned,
              available,
              percent,
            }) => (
              <tr key={locker.id}>
                <td>
                  <div className="lockers-table__locker">
                    <strong>{locker.alias}</strong>

                    <div className="lockers-table__occupancy">
                      <div className="lockers-table__occupancy-track">
                        <div
                          className="lockers-table__occupancy-value"
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <span>{percent}%</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="lockers-table__location">
                    {locker.location}
                  </span>
                </td>

                <td><span className="lockers-table__number">{locker.compartments}</span></td>
                <td><span className="lockers-table__number">{assigned}</span></td>

                <td>
                  <span
                    className={`lockers-table__available ${available <= 15 ? "lockers-table__available--low" : ""}`}
                  >
                    {available}
                  </span>
                </td>

                <td>
                  <StatusBadge active={locker.active} />
                </td>

                <td className="lockers-table__action">
                  <button
                    type="button"
                    className="lockers-table__edit"
                    onClick={() => onEdit(locker)}
                    aria-label={`Editar ${locker.alias}`}
                    title="Editar locker"
                  >
                    <Pencil size={16} strokeWidth={2} />
                  </button>
                </td>
              </tr>
            ))}

            {!visibleLoads.length ? (
              <tr>
                <td colSpan={7} className="lockers-table__empty">
                  <div>
                    <strong>No se encontraron lockers</strong>
                    <p>Intenta cambiar el término de búsqueda.</p>
                  </div>
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
