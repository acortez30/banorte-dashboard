import {
  useMemo,
  useState,
} from "react";

import {
  Pencil,
  Search,
} from "lucide-react";

import LockerFilterSelect from "@/components/common/LockerFilterSelect";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import TablePagination from "@/components/common/TablePagination";
import ToggleSwitch from "@/components/common/ToggleSwitch";

import type { Employee } from "@/types/dashboard";
import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/employees/EmployeesTable.css";

interface LockerItem {
  id: string;
  alias: string;
}

type EmployeeSortKey =
  | "name"
  | "phone"
  | "employeeNumber"
  | "badgeNumber"
  | "locker"
  | "active";

interface EmployeesTableProps {
  employees: Employee[];
  lockers: LockerItem[];
  search: string;
  lockerFilter: string;
  page: number;
  pageSize: number;
  total: number;
  onSearchChange: (value: string) => void;
  onLockerFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onToggleEmployee: (employee: Employee, active: boolean) => void;
  onEditEmployee: (employee: Employee) => void;
  onViewEmployee: (employee: Employee) => void;
}

export default function EmployeesTable({
  employees,
  lockers,
  search,
  lockerFilter,
  page,
  pageSize,
  total,
  onSearchChange,
  onLockerFilterChange,
  onPageChange,
  onPageSizeChange,
  onToggleEmployee,
  onEditEmployee,
  onViewEmployee,
}: EmployeesTableProps) {
  const [sortKey, setSortKey] = useState<EmployeeSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const lockerById = useMemo(
    () => new Map(lockers.map((locker) => [locker.id, locker])),
    [lockers],
  );

  const sortedEmployees = useMemo(
    () =>
      sortRows(
        employees,
        sortKey,
        sortDirection,
        {
          name: (employee) => employee.name,
          phone: (employee) => employee.phone,
          employeeNumber: (employee) => employee.employeeNumber,
          badgeNumber: (employee) => employee.badgeNumber,
          locker: (employee) => lockerById.get(employee.lockerId)?.alias ?? "",
          active: (employee) => employee.active,
        },
      ),
    [employees, lockerById, sortDirection, sortKey],
  );

  const visibleEmployees = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedEmployees.slice(start, start + pageSize);
  }, [page, pageSize, sortedEmployees]);

  const handleSort = (key: EmployeeSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    onPageChange(1);
  };

  return (
    <section className="employees-table">
      <div className="employees-table__toolbar">
        <div className="employees-table__search">
          <Search
            size={17}
            strokeWidth={2}
            className="employees-table__search-icon"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar empleado, número o gafete"
            className="employees-table__search-input"
            aria-label="Buscar empleados"
          />
        </div>

        <LockerFilterSelect
          value={lockerFilter}
          lockers={lockers}
          onChange={onLockerFilterChange}
        />
      </div>

      <div className="employees-table__scroll">
        <table className="employees-table__content">
          <thead>
            <tr>
              <SortableTableHeader
                label="Nombre"
                active={sortKey === "name"}
                direction={sortDirection}
                onSort={() => handleSort("name")}
              />

              <SortableTableHeader
                label="Teléfono"
                active={sortKey === "phone"}
                direction={sortDirection}
                onSort={() => handleSort("phone")}
              />

              <SortableTableHeader
                label="Número de empleado"
                active={sortKey === "employeeNumber"}
                direction={sortDirection}
                onSort={() => handleSort("employeeNumber")}
              />

              <SortableTableHeader
                label="Número de gafete"
                active={sortKey === "badgeNumber"}
                direction={sortDirection}
                onSort={() => handleSort("badgeNumber")}
              />

              <SortableTableHeader
                label="Isla"
                active={sortKey === "locker"}
                direction={sortDirection}
                onSort={() => handleSort("locker")}
              />

              <SortableTableHeader
                label="Acceso"
                active={sortKey === "active"}
                direction={sortDirection}
                onSort={() => handleSort("active")}
              />

              <th className="employees-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleEmployees.map((employee) => {
              const locker = lockerById.get(employee.lockerId);

              return (
                <tr key={employee.id}>
                  <td>
                    <button
                      type="button"
                      className="employees-table__employee-link"
                      onClick={() => onViewEmployee(employee)}
                      title={`Ver detalle de ${employee.name}`}
                    >
                      {employee.name}
                    </button>
                  </td>

                  <td>{employee.phone}</td>
                  <td>{employee.employeeNumber}</td>
                  <td>{employee.badgeNumber}</td>

                  <td>
                    <span
                      className={
                        locker
                          ? "employees-table__locker-badge"
                          : "employees-table__locker-badge employees-table__locker-badge--empty"
                      }
                    >
                      {locker?.alias ?? "Sin isla"}
                    </span>
                  </td>

                  <td>
                    <div className="employees-table__access">
                      <ToggleSwitch
                        checked={employee.active}
                        onChange={(active) => onToggleEmployee(employee, active)}
                        label={`Cambiar acceso de ${employee.name}`}
                      />
                    </div>
                  </td>

                  <td className="employees-table__action-cell">
                    <button
                      type="button"
                      className="employees-table__edit"
                      onClick={() => onEditEmployee(employee)}
                      aria-label={`Editar ${employee.name}`}
                      title="Editar empleado"
                    >
                      <Pencil size={16} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {!visibleEmployees.length ? (
              <tr>
                <td colSpan={7} className="employees-table__empty">
                  <div className="employees-table__empty-content">
                    <Search size={22} strokeWidth={1.8} />

                    <div>
                      <strong>No se encontraron empleados</strong>
                      <p>Intenta cambiar la búsqueda o el filtro de isla.</p>
                    </div>
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
