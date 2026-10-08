import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BadgeCheck,
  Boxes,
  FileSpreadsheet,
  Hash,
  LogIn,
  LogOut,
  Phone,
  UserRound,
} from "lucide-react";

import Button from "@/components/common/Button";
import Dialog from "@/components/common/Dialog";
import SortableTableHeader from "@/components/common/SortableTableHeader";
import TablePagination from "@/components/common/TablePagination";

import type {
  Employee,
  LockerIsland,
} from "@/types/dashboard";

import {
  exportEmployeeHistoryToExcel,
} from "@/utils/accessExport";

import {
  getEmployeeAccessHistory,
  getEmployeeCompartmentNumber,
} from "@/utils/attendance";
import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/employees/EmployeeDetailDialog.css";

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

type EmployeeDetailSortKey =
  | "date"
  | "time"
  | "type"
  | "locker"
  | "compartment";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export default function EmployeeDetailDialog({
  open,
  onClose,
  employee,
  employees,
  lockers,
}: {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
  employees: Employee[];
  lockers: LockerIsland[];
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortKey, setSortKey] = useState<EmployeeDetailSortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const history = useMemo(
    () => employee ? getEmployeeAccessHistory(employee, employees, 30) : [],
    [employee, employees],
  );

  useEffect(() => {
    if (open) setPage(1);
  }, [employee?.id, open]);

  const lockerById = useMemo(
    () => new Map(lockers.map((item) => [item.id, item])),
    [lockers],
  );

  const sortedHistory = useMemo(
    () => sortRows(
      history,
      sortKey,
      sortDirection,
      {
        date: (event) => new Date(`${event.date}T12:00:00`),
        time: (event) => new Date(event.occurredAt),
        type: (event) => event.type === "ENTRY" ? "Entrada" : "Salida",
        locker: (event) => lockerById.get(event.lockerId)?.alias ?? "",
        compartment: (event) => event.compartmentNumber,
      },
    ),
    [history, lockerById, sortDirection, sortKey],
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedHistory.slice(start, start + pageSize);
  }, [page, pageSize, sortedHistory]);

  const handleSort = (key: EmployeeDetailSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection(key === "date" || key === "time" ? "desc" : "asc");
    }

    setPage(1);
  };

  if (!employee) return null;

  const locker = lockers.find((item) => item.id === employee.lockerId);
  const compartmentNumber = getEmployeeCompartmentNumber(employee, employees);
  const entries = history.filter((event) => event.type === "ENTRY").length;
  const exits = history.filter((event) => event.type === "EXIT").length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Detalle del empleado"
      description="Información general e historial reciente de entradas y salidas."
      width="max-w-4xl"
      panelClassName="employee-detail-dialog"
      footer={
        <div className="employee-detail__footer">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="employee-detail">
        <section className="employee-detail__identity">
          <div className="employee-detail__avatar">
            {getInitials(employee.name) || "EM"}
          </div>

          <div className="employee-detail__identity-copy">
            <div className="employee-detail__identity-title">
              <h3>{employee.name}</h3>
              <span className={employee.active ? "employee-detail__status employee-detail__status--active" : "employee-detail__status"}>
                {employee.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p>{employee.employeeNumber} · {employee.badgeNumber}</p>
          </div>

          <Button
            variant="secondary"
            icon={FileSpreadsheet}
            disabled={!history.length}
            onClick={() => exportEmployeeHistoryToExcel({ employee, events: history, lockers })}
          >
            Exportar Excel
          </Button>
        </section>

        <section className="employee-detail__data-grid">
          <article>
            <Phone size={16} />
            <div><span>Teléfono</span><strong>{employee.phone}</strong></div>
          </article>
          <article>
            <Hash size={16} />
            <div><span>Número de empleado</span><strong>{employee.employeeNumber}</strong></div>
          </article>
          <article>
            <BadgeCheck size={16} />
            <div><span>Número de gafete</span><strong>{employee.badgeNumber}</strong></div>
          </article>
          <article>
            <Boxes size={16} />
            <div><span>Locker asignado</span><strong>{locker?.alias ?? "Sin isla"} · #{compartmentNumber}</strong></div>
          </article>
        </section>

        <section className="employee-detail__history">
          <div className="employee-detail__history-header">
            <div>
              <h3>Historial de accesos</h3>
              <p>Últimos 30 días disponibles en el mockup.</p>
            </div>

            <div className="employee-detail__history-summary">
              <span><LogIn size={14} /> {entries} entradas</span>
              <span><LogOut size={14} /> {exits} salidas</span>
            </div>
          </div>

          <div className="employee-detail__table-scroll">
            <table className="employee-detail__table">
              <thead>
                <tr>
                  <SortableTableHeader
                    label="Fecha"
                    active={sortKey === "date"}
                    direction={sortDirection}
                    onSort={() => handleSort("date")}
                  />
                  <SortableTableHeader
                    label="Hora"
                    active={sortKey === "time"}
                    direction={sortDirection}
                    onSort={() => handleSort("time")}
                  />
                  <SortableTableHeader
                    label="Movimiento"
                    active={sortKey === "type"}
                    direction={sortDirection}
                    onSort={() => handleSort("type")}
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
                {paginated.map((event) => {
                  const eventLocker = lockerById.get(event.lockerId);
                  const entry = event.type === "ENTRY";

                  return (
                    <tr key={event.id}>
                      <td>{dateFormatter.format(new Date(`${event.date}T12:00:00`))}</td>
                      <td><strong>{timeFormatter.format(new Date(event.occurredAt))}</strong></td>
                      <td>
                        <span className={`employee-detail__movement ${entry ? "employee-detail__movement--entry" : "employee-detail__movement--exit"}`}>
                          {entry ? <LogIn size={13} /> : <LogOut size={13} />}
                          {entry ? "Entrada" : "Salida"}
                        </span>
                      </td>
                      <td>{eventLocker?.alias ?? "—"}</td>
                      <td>#{event.compartmentNumber}</td>
                    </tr>
                  );
                })}

                {!paginated.length ? (
                  <tr>
                    <td colSpan={5} className="employee-detail__empty">
                      No hay movimientos registrados en los últimos 30 días.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <TablePagination
            page={page}
            pageSize={pageSize}
            total={history.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </section>
      </div>
    </Dialog>
  );
}
