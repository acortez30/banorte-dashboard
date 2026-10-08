import {
  useMemo,
  useState,
} from "react";

import {
  Search,
} from "lucide-react";

import SortableTableHeader from "@/components/common/SortableTableHeader";
import TablePagination from "@/components/common/TablePagination";

import type {
  Employee,
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";

import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/accesses/AccessesTable.css";


const timeFormatter = new Intl.DateTimeFormat(
  "es-MX",
  {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
);


type AccessSortKey =
  | "employee"
  | "employeeNumber"
  | "badgeNumber"
  | "locker"
  | "compartment"
  | "time";


interface EmployeeAccessRow {
  id: string;

  employeeId: string;

  entry?: EmployeeAccessEvent;

  exit?: EmployeeAccessEvent;

  lockerId: string;

  compartmentNumber: number;
}


/* =========================================================
   GROUP EVENTS BY EMPLOYEE
   ========================================================= */

function buildEmployeeAccessRows(
  events: EmployeeAccessEvent[],
): EmployeeAccessRow[] {
  const grouped = new Map<
    string,
    EmployeeAccessEvent[]
  >();

  events.forEach((event) => {
    const current =
      grouped.get(event.employeeId) ?? [];

    current.push(event);

    grouped.set(
      event.employeeId,
      current,
    );
  });

  return Array.from(
    grouped.entries(),
  ).map(
    ([
      employeeId,
      employeeEvents,
    ]) => {
      /* ===================================================
         ORDER EVENTS CHRONOLOGICALLY
         =================================================== */

      const sorted = [
        ...employeeEvents,
      ].sort(
        (
          first,
          second,
        ) =>
          new Date(
            first.occurredAt,
          ).getTime() -
          new Date(
            second.occurredAt,
          ).getTime(),
      );


      /* ===================================================
         FIRST ENTRY OF THE DAY
         =================================================== */

      const entry =
        sorted.find(
          (event) =>
            event.type ===
            "ENTRY",
        );


      /* ===================================================
         VALID EXIT

         Only an EXIT occurring AFTER the selected ENTRY
         can close the employee session.

         Example:

         08:57 EXIT
         09:07 ENTRY

         => 09:07 – —
         =================================================== */

      const validExits =
        entry
          ? sorted.filter(
              (event) =>
                event.type ===
                  "EXIT" &&
                new Date(
                  event.occurredAt,
                ).getTime() >
                  new Date(
                    entry.occurredAt,
                  ).getTime(),
            )
          : sorted.filter(
              (event) =>
                event.type ===
                "EXIT",
            );


      const exit =
        validExits.length
          ? validExits[
              validExits.length - 1
            ]
          : undefined;


      /* ===================================================
         REFERENCE EVENT

         Prefer ENTRY because this represents the current
         employee session and its compartment.
         =================================================== */

      const referenceEvent =
        entry ??
        exit ??
        sorted[0];


      return {
        id:
          `${employeeId}-${referenceEvent?.date ?? "access"}`,

        employeeId,

        entry,

        exit,

        lockerId:
          entry?.lockerId ??
          exit?.lockerId ??
          referenceEvent?.lockerId ??
          "",

        compartmentNumber:
          entry?.compartmentNumber ??
          exit?.compartmentNumber ??
          referenceEvent?.compartmentNumber ??
          0,
      };
    },
  );
}


/* =========================================================
   TIME RANGE
   ========================================================= */

function getTimeRange(
  row: EmployeeAccessRow,
) {
  const entryTime =
    row.entry
      ? timeFormatter.format(
          new Date(
            row.entry.occurredAt,
          ),
        )
      : "—";


  const exitTime =
    row.exit
      ? timeFormatter.format(
          new Date(
            row.exit.occurredAt,
          ),
        )
      : "—";


  return {
    entryTime,

    exitTime,

    label:
      `${entryTime} – ${exitTime}`,
  };
}


/* =========================================================
   COMPONENT
   ========================================================= */

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

  onSearchChange: (
    value: string,
  ) => void;

  onPageChange: (
    page: number,
  ) => void;

  onPageSizeChange: (
    size: number,
  ) => void;
}) {
  /*
   * Seguimos ordenando inicialmente
   * por horario más reciente.
   */
  const [
    sortKey,
    setSortKey,
  ] = useState<AccessSortKey>(
    "time",
  );


  const [
    sortDirection,
    setSortDirection,
  ] = useState<SortDirection>(
    "desc",
  );


  /* =======================================================
     MAPS
     ======================================================= */

  const employeeById =
    useMemo(
      () =>
        new Map(
          employees.map(
            (employee) => [
              employee.id,
              employee,
            ],
          ),
        ),
      [
        employees,
      ],
    );


  const lockerById =
    useMemo(
      () =>
        new Map(
          lockers.map(
            (locker) => [
              locker.id,
              locker,
            ],
          ),
        ),
      [
        lockers,
      ],
    );


  /* =======================================================
     ROWS
     ======================================================= */

  const rows =
    useMemo(
      () =>
        buildEmployeeAccessRows(
          events,
        ),
      [
        events,
      ],
    );


  /* =======================================================
     SORT
     ======================================================= */

  const sortedRows =
    useMemo(
      () =>
        sortRows(
          rows,
          sortKey,
          sortDirection,
          {
            employee:
              (row) =>
                employeeById.get(
                  row.employeeId,
                )?.name ??
                "",

            employeeNumber:
              (row) =>
                employeeById.get(
                  row.employeeId,
                )
                  ?.employeeNumber ??
                "",

            badgeNumber:
              (row) =>
                employeeById.get(
                  row.employeeId,
                )
                  ?.badgeNumber ??
                "",

            locker:
              (row) =>
                lockerById.get(
                  row.lockerId,
                )?.alias ??
                "",

            compartment:
              (row) =>
                row.compartmentNumber,

            time:
              (row) => {
                const reference =
                  row.entry ??
                  row.exit;


                return reference
                  ? new Date(
                      reference.occurredAt,
                    )
                  : new Date(
                      0,
                    );
              },
          },
        ),
      [
        employeeById,
        lockerById,
        rows,
        sortDirection,
        sortKey,
      ],
    );


  /* =======================================================
     PAGINATION
     ======================================================= */

  const visibleRows =
    useMemo(
      () => {
        const start =
          (
            page -
            1
          ) *
          pageSize;


        return sortedRows.slice(
          start,
          start +
            pageSize,
        );
      },
      [
        page,
        pageSize,
        sortedRows,
      ],
    );


  /* =======================================================
     SORT HANDLER
     ======================================================= */

  const handleSort = (
    key: AccessSortKey,
  ) => {
    if (
      sortKey === key
    ) {
      setSortDirection(
        (current) =>
          current ===
          "asc"
            ? "desc"
            : "asc",
      );
    } else {
      setSortKey(
        key,
      );


      setSortDirection(
        key === "time"
          ? "desc"
          : "asc",
      );
    }


    onPageChange(
      1,
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="accesses-table">
      {/* ===================================================
          TOOLBAR
          =================================================== */}

      <div className="accesses-table__toolbar">
        <div className="accesses-table__search">
          <Search
            size={17}
            strokeWidth={2}
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
            aria-label="Buscar accesos de empleados"
          />
        </div>


        <div className="accesses-table__total">
          <strong>
            {total}
          </strong>

          <span>
            {total === 1
              ? "empleado"
              : "empleados"}
          </span>
        </div>
      </div>


      {/* ===================================================
          TABLE
          =================================================== */}

      <div className="accesses-table__scroll">
        <table className="accesses-table__content">
          <thead>
            <tr>
              {/* EMPLOYEE */}

              <SortableTableHeader
                label="Empleado"
                active={
                  sortKey ===
                  "employee"
                }
                direction={
                  sortDirection
                }
                onSort={() => {
                  handleSort(
                    "employee",
                  );
                }}
              />


              {/* EMPLOYEE NUMBER */}

              <SortableTableHeader
                label="Número de empleado"
                active={
                  sortKey ===
                  "employeeNumber"
                }
                direction={
                  sortDirection
                }
                onSort={() => {
                  handleSort(
                    "employeeNumber",
                  );
                }}
              />


              {/* BADGE */}

              <SortableTableHeader
                label="Número de gafete"
                active={
                  sortKey ===
                  "badgeNumber"
                }
                direction={
                  sortDirection
                }
                onSort={() => {
                  handleSort(
                    "badgeNumber",
                  );
                }}
              />


              {/* ISLAND */}

              <SortableTableHeader
                label="Isla"
                active={
                  sortKey ===
                  "locker"
                }
                direction={
                  sortDirection
                }
                onSort={() => {
                  handleSort(
                    "locker",
                  );
                }}
              />


              {/* COMPARTMENT */}

              <SortableTableHeader
                label="Compartimento"
                active={
                  sortKey ===
                  "compartment"
                }
                direction={
                  sortDirection
                }
                onSort={() => {
                  handleSort(
                    "compartment",
                  );
                }}
              />


              {/* SCHEDULE */}

              <SortableTableHeader
                label="Horario"
                active={
                  sortKey ===
                  "time"
                }
                direction={
                  sortDirection
                }
                onSort={() => {
                  handleSort(
                    "time",
                  );
                }}
              />
            </tr>
          </thead>


          <tbody>
            {visibleRows.map(
              (row) => {
                const employee =
                  employeeById.get(
                    row.employeeId,
                  );


                const locker =
                  lockerById.get(
                    row.lockerId,
                  );


                const timeRange =
                  getTimeRange(
                    row,
                  );


                return (
                  <tr
                    key={
                      row.id
                    }
                  >
                    {/* EMPLOYEE */}

                    <td>
                      <strong className="accesses-table__employee">
                        {employee?.name ??
                          "Empleado no encontrado"}
                      </strong>
                    </td>


                    {/* EMPLOYEE NUMBER */}

                    <td>
                      {employee?.employeeNumber ??
                        "—"}
                    </td>


                    {/* BADGE */}

                    <td>
                      {employee?.badgeNumber ??
                        "—"}
                    </td>


                    {/* ISLAND */}

                    <td>
                      <span className="accesses-table__locker">
                        {locker?.alias ??
                          "—"}
                      </span>
                    </td>


                    {/* COMPARTMENT */}

                    <td>
                      <span className="accesses-table__compartment">
                        #
                        {String(
                          row.compartmentNumber,
                        ).padStart(
                          3,
                          "0",
                        )}
                      </span>
                    </td>


                    {/* SCHEDULE */}

                    <td>
                      <div className="accesses-table__schedule">
                        <span className="accesses-table__schedule-range">
                          {timeRange.label}
                        </span>


                        {!row.exit &&
                        row.entry ? (
                          <span className="accesses-table__schedule-status">
                            En curso
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              },
            )}


            {/* =================================================
                EMPTY
                ================================================= */}

            {!visibleRows.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="accesses-table__empty"
                >
                  <strong>
                    No hay accesos para mostrar
                  </strong>

                  <p>
                    Prueba otra fecha o cambia la búsqueda.
                  </p>
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