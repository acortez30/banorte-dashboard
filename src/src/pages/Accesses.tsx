import {
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  FileSpreadsheet,
  LogIn,
  LogOut,
  MoveHorizontal,
} from "lucide-react";

import {
  toast,
} from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import AccessesTable from "@/components/accesses/AccessesTable";

import {
  useData,
} from "@/contexts/DataContext";

import {
  exportAccessEventsToExcel,
} from "@/utils/accessExport";

import {
  getAccessEventsForDate,
  todayDateValue,
} from "@/utils/attendance";

import "@/styles/accesses/AccessesPage.css";

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function Accesses() {
  const {
    employees,
    lockers,
  } = useData();

  const today = todayDateValue();
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const events = useMemo(
    () => getAccessEventsForDate(date, employees),
    [date, employees],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return events;

    const employeeById = new Map(employees.map((employee) => [employee.id, employee]));

    return events.filter((event) => {
      const employee = employeeById.get(event.employeeId);
      const value = `${employee?.name ?? ""} ${employee?.employeeNumber ?? ""} ${employee?.badgeNumber ?? ""}`.toLowerCase();
      return value.includes(query);
    });
  }, [employees, events, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const entries = events.filter((event) => event.type === "ENTRY").length;
  const exits = events.filter((event) => event.type === "EXIT").length;

  const formattedDate = dateFormatter.format(new Date(`${date}T12:00:00`));

  const handleExport = () => {
    if (!events.length) {
      toast.error("No hay movimientos para exportar en la fecha seleccionada.");
      return;
    }

    exportAccessEventsToExcel({
      events,
      employees,
      lockers,
      date,
    });

    toast.success("Archivo de accesos generado");
  };

  return (
    <DashboardLayout>
      <main className="accesses-page">
        <PageHeader
          title="Accesos"
          description="Consulta las entradas y salidas de empleados por día."
          actions={
            <Button
              variant="secondary"
              icon={FileSpreadsheet}
              onClick={handleExport}
              disabled={!events.length}
            >
              Exportar Excel
            </Button>
          }
        />

        <section className="accesses-page__filters">
          <div className="accesses-page__date-field">
            <span>Fecha</span>
            <div className="accesses-page__date-input">
              <CalendarDays size={16} strokeWidth={2} />
              <input
                type="date"
                value={date}
                max={today}
                onChange={(event) => {
                  const next = event.target.value;
                  if (!next) return;
                  setDate(next > today ? today : next);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="accesses-page__date-copy">
            <span>{date === today ? "Hoy" : "Fecha consultada"}</span>
            <strong>{formattedDate}</strong>
            <small>No es posible consultar fechas posteriores al día actual.</small>
          </div>
        </section>

        <section className="accesses-page__metrics">
          <article>
            <div className="accesses-page__metric-icon accesses-page__metric-icon--entry"><LogIn size={18} /></div>
            <div><span>Entradas</span><strong>{entries}</strong></div>
          </article>
          <article>
            <div className="accesses-page__metric-icon accesses-page__metric-icon--exit"><LogOut size={18} /></div>
            <div><span>Salidas</span><strong>{exits}</strong></div>
          </article>
          <article>
            <div className="accesses-page__metric-icon"><MoveHorizontal size={18} /></div>
            <div><span>Movimientos</span><strong>{events.length}</strong></div>
          </article>
        </section>

        <AccessesTable
          events={paginated}
          employees={employees}
          lockers={lockers}
          search={search}
          page={page}
          pageSize={pageSize}
          total={filtered.length}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </main>
    </DashboardLayout>
  );
}
