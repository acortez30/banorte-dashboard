import {
  LogIn,
  LogOut,
  Search,
} from "lucide-react";

import TablePagination from "@/components/common/TablePagination";

import type {
  Employee,
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/accesses/AccessesTable.css";

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export default function AccessesTable({
  events,
  employees,
  lockers,
  search,
  page,
  pageSize,
  total,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
}: {
  events: EmployeeAccessEvent[];
  employees: Employee[];
  lockers: LockerIsland[];
  search: string;
  page: number;
  pageSize: number;
  total: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]));
  const lockerById = new Map(lockers.map((locker) => [locker.id, locker]));

  return (
    <section className="accesses-table">
      <div className="accesses-table__toolbar">
        <div className="accesses-table__search">
          <Search size={17} strokeWidth={2} />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar empleado, número o gafete"
            aria-label="Buscar movimientos de empleados"
          />
        </div>

        <div className="accesses-table__total">
          <strong>{total}</strong>
          <span>{total === 1 ? "movimiento" : "movimientos"}</span>
        </div>
      </div>

      <div className="accesses-table__scroll">
        <table className="accesses-table__content">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Movimiento</th>
              <th>Empleado</th>
              <th>Número de empleado</th>
              <th>Número de gafete</th>
              <th>Isla</th>
              <th>Compartimento</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => {
              const employee = employeeById.get(event.employeeId);
              const locker = lockerById.get(event.lockerId);
              const entry = event.type === "ENTRY";

              return (
                <tr key={event.id}>
                  <td>
                    <span className="accesses-table__time">
                      {timeFormatter.format(new Date(event.occurredAt))}
                    </span>
                  </td>
                  <td>
                    <span className={`accesses-table__movement ${entry ? "accesses-table__movement--entry" : "accesses-table__movement--exit"}`}>
                      {entry ? <LogIn size={14} strokeWidth={2.2} /> : <LogOut size={14} strokeWidth={2.2} />}
                      {entry ? "Entrada" : "Salida"}
                    </span>
                  </td>
                  <td><strong>{employee?.name ?? "Empleado no encontrado"}</strong></td>
                  <td>{employee?.employeeNumber ?? "—"}</td>
                  <td>{employee?.badgeNumber ?? "—"}</td>
                  <td><span className="accesses-table__locker">{locker?.alias ?? "—"}</span></td>
                  <td><span className="accesses-table__compartment">#{event.compartmentNumber}</span></td>
                </tr>
              );
            })}

            {!events.length ? (
              <tr>
                <td colSpan={7} className="accesses-table__empty">
                  <strong>No hay movimientos para mostrar</strong>
                  <p>Prueba otra fecha o cambia la búsqueda.</p>
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
