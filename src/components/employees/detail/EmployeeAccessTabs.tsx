import {
  useEffect,
  useState,
} from "react";

import {
  LogIn,
  LogOut,
} from "lucide-react";

import EmployeeEntriesTable from "@/components/employees/detail/EmployeeEntriesTable";
import EmployeeExitsTable from "@/components/employees/detail/EmployeeExitsTable";
import EmployeeHistoryExportButton from "@/components/employees/detail/EmployeeHistoryExportButton";

import type {
  Employee,
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/employees/detail/EmployeeAccessTabs.css";

type AccessTab =
  | "ENTRY"
  | "EXIT";

interface EmployeeAccessTabsProps {
  employee: Employee;

  entries: EmployeeAccessEvent[];

  exits: EmployeeAccessEvent[];

  lockers: LockerIsland[];
}

export default function EmployeeAccessTabs({
  employee,
  entries,
  exits,
  lockers,
}: EmployeeAccessTabsProps) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<AccessTab>(
      "ENTRY",
    );

  const [
    entryPage,
    setEntryPage,
  ] = useState(1);

  const [
    exitPage,
    setExitPage,
  ] = useState(1);

  const [
    entryPageSize,
    setEntryPageSize,
  ] = useState(10);

  const [
    exitPageSize,
    setExitPageSize,
  ] = useState(10);


  /* =======================================================
     PAGE SAFETY
     ======================================================= */

  useEffect(() => {
    const totalPages =
      Math.max(
        1,
        Math.ceil(
          entries.length /
            entryPageSize,
        ),
      );

    if (
      entryPage >
      totalPages
    ) {
      setEntryPage(
        totalPages,
      );
    }
  }, [
    entries.length,
    entryPage,
    entryPageSize,
  ]);

  useEffect(() => {
    const totalPages =
      Math.max(
        1,
        Math.ceil(
          exits.length /
            exitPageSize,
        ),
      );

    if (
      exitPage >
      totalPages
    ) {
      setExitPage(
        totalPages,
      );
    }
  }, [
    exits.length,
    exitPage,
    exitPageSize,
  ]);


  /* =======================================================
     ACTIVE DATA
     ======================================================= */

  const activeEvents =
    activeTab ===
    "ENTRY"
      ? entries
      : exits;

  const activeLabel =
    activeTab ===
    "ENTRY"
      ? "Exportar entradas"
      : "Exportar salidas";


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section className="employee-access-tabs">
      <header className="employee-access-tabs__header">
        <div>
          <h2>
            Historial de accesos
          </h2>

          <p>
            Consulta por separado las entradas y salidas registradas durante los últimos 12 meses.
          </p>
        </div>

        <EmployeeHistoryExportButton
          employee={
            employee
          }
          events={
            activeEvents
          }
          lockers={
            lockers
          }
          mode={
            activeTab
          }
          label={
            activeLabel
          }
        />
      </header>

      <div
        className="employee-access-tabs__navigation"
        role="tablist"
        aria-label="Historial de entradas y salidas"
      >
        <button
          type="button"
          role="tab"
          aria-selected={
            activeTab ===
            "ENTRY"
          }
          className={`
            employee-access-tabs__tab

            ${
              activeTab ===
              "ENTRY"
                ? "employee-access-tabs__tab--active"
                : ""
            }
          `}
          onClick={() => {
            setActiveTab(
              "ENTRY",
            );
          }}
        >
          <LogIn
            size={16}
            strokeWidth={2}
          />

          <span>
            Entradas
          </span>

          <strong>
            {entries.length}
          </strong>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            activeTab ===
            "EXIT"
          }
          className={`
            employee-access-tabs__tab

            ${
              activeTab ===
              "EXIT"
                ? "employee-access-tabs__tab--active"
                : ""
            }
          `}
          onClick={() => {
            setActiveTab(
              "EXIT",
            );
          }}
        >
          <LogOut
            size={16}
            strokeWidth={2}
          />

          <span>
            Salidas
          </span>

          <strong>
            {exits.length}
          </strong>
        </button>
      </div>

      <div
        className="employee-access-tabs__content"
        role="tabpanel"
      >
        {activeTab ===
        "ENTRY" ? (
          <EmployeeEntriesTable
            events={
              entries
            }
            lockers={
              lockers
            }
            page={
              entryPage
            }
            pageSize={
              entryPageSize
            }
            total={
              entries.length
            }
            onPageChange={
              setEntryPage
            }
            onPageSizeChange={(
              size,
            ) => {
              setEntryPageSize(
                size,
              );

              setEntryPage(1);
            }}
          />
        ) : (
          <EmployeeExitsTable
            events={
              exits
            }
            lockers={
              lockers
            }
            page={
              exitPage
            }
            pageSize={
              exitPageSize
            }
            total={
              exits.length
            }
            onPageChange={
              setExitPage
            }
            onPageSizeChange={(
              size,
            ) => {
              setExitPageSize(
                size,
              );

              setExitPage(1);
            }}
          />
        )}
      </div>
    </section>
  );
}
