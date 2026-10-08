import {
  Pencil,
  Search,
} from "lucide-react";

import ToggleSwitch from "@/components/common/ToggleSwitch";
import TablePagination from "@/components/common/TablePagination";
import LockerFilterSelect from "@/components/common/LockerFilterSelect";

import type { Employee } from "@/types/dashboard";

import "@/styles/employees/EmployeesTable.css";

interface LockerItem {
  id: string;
  alias: string;
}

interface EmployeesTableProps {
  employees: Employee[];
  lockers: LockerItem[];

  search: string;
  lockerFilter: string;

  page: number;
  pageSize: number;
  total: number;

  onSearchChange: (
    value: string,
  ) => void;

  onLockerFilterChange: (
    value: string,
  ) => void;

  onPageChange: (
    page: number,
  ) => void;

  onPageSizeChange: (
    size: number,
  ) => void;

  onToggleEmployee: (
    employee: Employee,
    active: boolean,
  ) => void;

  onEditEmployee: (
    employee: Employee,
  ) => void;

  onViewEmployee: (
    employee: Employee,
  ) => void;
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
  const lockerById =
    new Map(
      lockers.map(
        (locker) => [
          locker.id,
          locker,
        ],
      ),
    );

  return (
    <section className="employees-table">
      {/* ===================================================
          TOOLBAR
          =================================================== */}
      <div className="employees-table__toolbar">
        {/* SEARCH */}
        <div className="employees-table__search">
          <Search
            size={17}
            strokeWidth={2}
            className="employees-table__search-icon"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              onSearchChange(
                event.target.value,
              );
            }}
            placeholder="Buscar empleado, número o gafete"
            className="employees-table__search-input"
            aria-label="Buscar empleados"
          />
        </div>

        {/* LOCKER FILTER */}
        <LockerFilterSelect
          value={lockerFilter}
          lockers={lockers}
          onChange={
            onLockerFilterChange
          }
        />
      </div>

      {/* ===================================================
          TABLE
          =================================================== */}
      <div className="employees-table__scroll">
        <table className="employees-table__content">
          <thead>
            <tr>
              <th>
                Nombre
              </th>

              <th>
                Teléfono
              </th>

              <th>
                Número de empleado
              </th>

              <th>
                Número de gafete
              </th>

              <th>
                Isla
              </th>

              <th>
                Acceso
              </th>

              <th className="employees-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {employees.map(
              (employee) => {
                const locker =
                  lockerById.get(
                    employee.lockerId,
                  );

                return (
                  <tr
                    key={
                      employee.id
                    }
                  >
                    {/* NAME */}
                    <td>
                      <button
                        type="button"
                        className="employees-table__employee-link"
                        onClick={() => {
                          onViewEmployee(
                            employee,
                          );
                        }}
                        title={`Ver detalle de ${employee.name}`}
                      >
                        {employee.name}
                      </button>
                    </td>

                    {/* PHONE */}
                    <td>
                      {
                        employee.phone
                      }
                    </td>

                    {/* EMPLOYEE NUMBER */}
                    <td>
                      {
                        employee.employeeNumber
                      }
                    </td>

                    {/* BADGE */}
                    <td>
                      {
                        employee.badgeNumber
                      }
                    </td>

                    {/* LOCKER */}
                    <td>
                      <span
                        className={
                          locker
                            ? "employees-table__locker-badge"
                            : "employees-table__locker-badge employees-table__locker-badge--empty"
                        }
                      >
                        {locker?.alias ??
                          "Sin isla"}
                      </span>
                    </td>

                    {/* ACCESS */}
                    <td>
                      <div className="employees-table__access">
                        <ToggleSwitch
                          checked={
                            employee.active
                          }
                          onChange={(
                            active,
                          ) => {
                            onToggleEmployee(
                              employee,
                              active,
                            );
                          }}
                          label={`Cambiar acceso de ${employee.name}`}
                        />
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="employees-table__action-cell">
                      <button
                        type="button"
                        className="employees-table__edit"
                        onClick={() => {
                          onEditEmployee(
                            employee,
                          );
                        }}
                        aria-label={`Editar ${employee.name}`}
                        title="Editar empleado"
                      >
                        <Pencil
                          size={16}
                          strokeWidth={2}
                        />
                      </button>
                    </td>
                  </tr>
                );
              },
            )}

            {/* =================================================
                EMPTY
                ================================================= */}
            {!employees.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="employees-table__empty"
                >
                  <div className="employees-table__empty-content">
                    <Search
                      size={22}
                      strokeWidth={1.8}
                    />

                    <div>
                      <strong>
                        No se encontraron
                        empleados
                      </strong>

                      <p>
                        Intenta cambiar la
                        búsqueda o el filtro
                        de isla.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          PAGINATION
          =================================================== */}
      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={
          onPageChange
        }
        onPageSizeChange={
          onPageSizeChange
        }
      />
    </section>
  );
}