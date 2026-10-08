import * as XLSX from "xlsx";

import {
  FileSpreadsheet,
} from "lucide-react";

import {
  toast,
} from "sonner";

import Button from "@/components/common/Button";

import type {
  Employee,
  EmployeeAccessEvent,
  EmployeeAccessEventType,
  LockerIsland,
} from "@/types/dashboard";

type ExportMode =
  | EmployeeAccessEventType
  | "ALL";

interface EmployeeHistoryExportButtonProps {
  employee: Employee;

  events: EmployeeAccessEvent[];

  lockers: LockerIsland[];

  mode: ExportMode;

  label?: string;
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

const timeFormatter =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  );

function sanitizeFilePart(
  value: string,
) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-zA-Z0-9-_]+/g,
      "_",
    )
    .replace(
      /^_+|_+$/g,
      "",
    )
    .toLowerCase();
}

function buildRows({
  employee,
  events,
  lockers,
}: {
  employee: Employee;

  events: EmployeeAccessEvent[];

  lockers: LockerIsland[];
}) {
  const lockerById =
    new Map(
      lockers.map(
        (locker) => [
          locker.id,
          locker,
        ],
      ),
    );

  return events.map(
    (event) => ({
      Fecha:
        dateFormatter.format(
          new Date(
            `${event.date}T12:00:00`,
          ),
        ),

      Hora:
        timeFormatter.format(
          new Date(
            event.occurredAt,
          ),
        ),

      Nombre:
        employee.name,

      "Número de empleado":
        employee.employeeNumber,

      "Número de gafete":
        employee.badgeNumber,

      Isla:
        lockerById.get(
          event.lockerId,
        )?.alias ?? "",

      Compartimento:
        event.compartmentNumber,
    }),
  );
}

function createSheet(
  rows: Record<
    string,
    string | number
  >[],
) {
  const worksheet =
    XLSX.utils.json_to_sheet(
      rows,
    );

  worksheet["!cols"] = [
    {
      wch: 13,
    },
    {
      wch: 10,
    },
    {
      wch: 30,
    },
    {
      wch: 20,
    },
    {
      wch: 18,
    },
    {
      wch: 16,
    },
    {
      wch: 16,
    },
  ];

  return worksheet;
}

export default function EmployeeHistoryExportButton({
  employee,
  events,
  lockers,
  mode,
  label,
}: EmployeeHistoryExportButtonProps) {
  const exportFile = () => {
    if (
      !events.length
    ) {
      toast.error(
        "No hay registros para exportar.",
      );

      return;
    }

    const workbook =
      XLSX.utils.book_new();

    const safeName =
      sanitizeFilePart(
        employee.name,
      ) || "empleado";

    if (
      mode === "ALL"
    ) {
      const entries =
        events.filter(
          (event) =>
            event.type ===
            "ENTRY",
        );

      const exits =
        events.filter(
          (event) =>
            event.type ===
            "EXIT",
        );

      const entryRows =
        buildRows({
          employee,
          events:
            entries,
          lockers,
        });

      const exitRows =
        buildRows({
          employee,
          events:
            exits,
          lockers,
        });

      XLSX.utils.book_append_sheet(
        workbook,
        createSheet(
          entryRows,
        ),
        "Entradas",
      );

      XLSX.utils.book_append_sheet(
        workbook,
        createSheet(
          exitRows,
        ),
        "Salidas",
      );

      XLSX.writeFile(
        workbook,
        `historial_${safeName}.xlsx`,
      );

      toast.success(
        "Historial exportado con hojas de entradas y salidas.",
      );

      return;
    }

    const rows =
      buildRows({
        employee,
        events,
        lockers,
      });

    const sheetName =
      mode === "ENTRY"
        ? "Entradas"
        : "Salidas";

    const filePrefix =
      mode === "ENTRY"
        ? "entradas"
        : "salidas";

    XLSX.utils.book_append_sheet(
      workbook,
      createSheet(
        rows,
      ),
      sheetName,
    );

    XLSX.writeFile(
      workbook,
      `${filePrefix}_${safeName}.xlsx`,
    );

    toast.success(
      mode === "ENTRY"
        ? "Entradas exportadas"
        : "Salidas exportadas",
    );
  };

  return (
    <Button
      variant="secondary"
      icon={
        FileSpreadsheet
      }
      disabled={
        !events.length
      }
      onClick={
        exportFile
      }
    >
      {label ??
        "Exportar Excel"}
    </Button>
  );
}
