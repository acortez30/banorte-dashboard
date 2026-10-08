import {
  useMemo,
  useState,
} from "react";

import {
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

import AccessCalendar from "@/components/accesses/AccessCalendar";
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


const dateFormatter =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      weekday:
        "long",

      day:
        "2-digit",

      month:
        "long",

      year:
        "numeric",
    },
  );


export default function Accesses() {
  const {
    employees,
    lockers,
  } = useData();


  /* =======================================================
     STATE
     ======================================================= */

  const today =
    todayDateValue();


  const [
    date,
    setDate,
  ] = useState(
    today,
  );


  const [
    search,
    setSearch,
  ] = useState(
    "",
  );


  const [
    page,
    setPage,
  ] = useState(
    1,
  );


  /*
   * Changed from 20 to 10.
   */
  const [
    pageSize,
    setPageSize,
  ] = useState(
    10,
  );


  /* =======================================================
     EVENTS
     ======================================================= */

  const events =
    useMemo(
      () =>
        getAccessEventsForDate(
          date,
          employees,
        ),
      [
        date,
        employees,
      ],
    );


  /* =======================================================
     SEARCH
     ======================================================= */

  const employeeById =
    useMemo(
      () =>
        new Map(
          employees.map(
            (
              employee,
            ) => [
              employee.id,
              employee,
            ],
          ),
        ),
      [
        employees,
      ],
    );


  const filtered =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();


        if (
          !query
        ) {
          return events;
        }


        return events.filter(
          (
            event,
          ) => {
            const employee =
              employeeById.get(
                event.employeeId,
              );


            const value = `
              ${employee?.name ?? ""}
              ${employee?.employeeNumber ?? ""}
              ${employee?.badgeNumber ?? ""}
            `.toLowerCase();


            return value.includes(
              query,
            );
          },
        );
      },
      [
        employeeById,
        events,
        search,
      ],
    );


  /* =======================================================
     DAILY EMPLOYEES
     ======================================================= */

  const dailyEmployees =
    useMemo(
      () =>
        new Set(
          filtered.map(
            (event) =>
              event.employeeId,
          ),
        ).size,
      [
        filtered,
      ],
    );


  /* =======================================================
     METRICS
     ======================================================= */

  const entries =
    useMemo(
      () =>
        events.filter(
          (
            event,
          ) =>
            event.type ===
            "ENTRY",
        ).length,
      [
        events,
      ],
    );


  const exits =
    useMemo(
      () =>
        events.filter(
          (
            event,
          ) =>
            event.type ===
            "EXIT",
        ).length,
      [
        events,
      ],
    );


  const formattedDate =
    dateFormatter.format(
      new Date(
        `${date}T12:00:00`,
      ),
    );


  /* =======================================================
     DATE CHANGE
     ======================================================= */

  const handleDateChange = (
    value: string,
  ) => {
    const safeValue =
      value >
      today
        ? today
        : value;


    setDate(
      safeValue,
    );

    setPage(
      1,
    );
  };


  /* =======================================================
     EXPORT
     ======================================================= */

  const handleExport = () => {
    if (
      !events.length
    ) {
      toast.error(
        "No hay movimientos para exportar en la fecha seleccionada.",
      );

      return;
    }


    exportAccessEventsToExcel({
      events,
      employees,
      lockers,
      date,
    });


    toast.success(
      "Archivo de accesos generado",
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout>
      <main className="accesses-page">
        <PageHeader
          title="Accesos"
          description="Consulta las entradas y salidas de empleados por día."
          actions={
            <Button
              variant="secondary"
              icon={
                FileSpreadsheet
              }
              onClick={
                handleExport
              }
              disabled={
                !events.length
              }
            >
              Exportar Excel
            </Button>
          }
        />


        {/* =================================================
            DATE TOOLBAR
            ================================================= */}

        <section className="accesses-page__date-toolbar">
          <AccessCalendar
            value={
              date
            }
            max={
              today
            }
            onChange={
              handleDateChange
            }
          />


          <div className="accesses-page__date-summary">
            <span
              className={`
                accesses-page__date-badge

                ${
                  date ===
                  today
                    ? "accesses-page__date-badge--today"
                    : ""
                }
              `}
            >
              {date ===
              today
                ? "Hoy"
                : "Fecha consultada"}
            </span>


            <div>
              <strong>
                {formattedDate}
              </strong>

              <small>
                Consulta diaria de movimientos
              </small>
            </div>
          </div>
        </section>


        {/* =================================================
            METRICS
            ================================================= */}

        <section className="accesses-page__metrics">
          <article className="accesses-page__metric">
            <div className="accesses-page__metric-icon accesses-page__metric-icon--entry">
              <LogIn
                size={18}
                strokeWidth={2}
              />
            </div>


            <div className="accesses-page__metric-copy">
              <span>
                Entradas
              </span>

              <strong>
                {entries}
              </strong>
            </div>
          </article>


          <article className="accesses-page__metric">
            <div className="accesses-page__metric-icon accesses-page__metric-icon--exit">
              <LogOut
                size={18}
                strokeWidth={2}
              />
            </div>


            <div className="accesses-page__metric-copy">
              <span>
                Salidas
              </span>

              <strong>
                {exits}
              </strong>
            </div>
          </article>


          <article className="accesses-page__metric">
            <div className="accesses-page__metric-icon">
              <MoveHorizontal
                size={18}
                strokeWidth={2}
              />
            </div>


            <div className="accesses-page__metric-copy">
              <span>
                Movimientos
              </span>

              <strong>
                {events.length}
              </strong>
            </div>
          </article>
        </section>


        {/* =================================================
            TABLE
            ================================================= */}

        <AccessesTable
          events={
            filtered
          }
          employees={
            employees
          }
          lockers={
            lockers
          }
          search={
            search
          }
          page={
            page
          }
          pageSize={
            pageSize
          }
          total={
            dailyEmployees
          }
          onSearchChange={(
            value,
          ) => {
            setSearch(
              value,
            );

            setPage(
              1,
            );
          }}
          onPageChange={
            setPage
          }
          onPageSizeChange={(
            size,
          ) => {
            setPageSize(
              size,
            );

            setPage(
              1,
            );
          }}
        />
      </main>
    </DashboardLayout>
  );
}