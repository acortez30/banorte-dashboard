import * as XLSX from "xlsx";

import type {
  Employee,
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function sanitizeFilePart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export function exportAccessEventsToExcel({
  events,
  employees,
  lockers,
  date,
}: {
  events: EmployeeAccessEvent[];
  employees: Employee[];
  lockers: LockerIsland[];
  date: string;
}) {
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]));
  const lockerById = new Map(lockers.map((locker) => [locker.id, locker]));

  const eventsByEmployee = new Map<string, EmployeeAccessEvent[]>();

  events.forEach((event) => {
    const current = eventsByEmployee.get(event.employeeId) ?? [];
    current.push(event);
    eventsByEmployee.set(event.employeeId, current);
  });

  const rows = Array.from(eventsByEmployee.entries())
    .map(([employeeId, employeeEvents]) => {
      const employee = employeeById.get(employeeId);
      const sorted = [...employeeEvents].sort(
        (first, second) =>
          new Date(first.occurredAt).getTime() -
          new Date(second.occurredAt).getTime(),
      );

      const entries = sorted.filter((event) => event.type === "ENTRY");
      const exits = sorted.filter((event) => event.type === "EXIT");
      const entry = entries[0];
      const exit = exits[exits.length - 1];
      const referenceEvent = entry ?? exit ?? sorted[0];
      const locker = lockerById.get(referenceEvent?.lockerId ?? "");

      return {
        Fecha: formatDate(date),
        Entrada: entry ? formatTime(entry.occurredAt) : "",
        Salida: exit ? formatTime(exit.occurredAt) : "",
        Horario: `${entry ? formatTime(entry.occurredAt) : "—"} - ${exit ? formatTime(exit.occurredAt) : "—"}`,
        Nombre: employee?.name ?? "Empleado no encontrado",
        "Número de empleado": employee?.employeeNumber ?? "",
        "Número de gafete": employee?.badgeNumber ?? "",
        Isla: locker?.alias ?? "",
        Compartimento: referenceEvent?.compartmentNumber ?? "",
      };
    })
    .sort((first, second) => first.Nombre.localeCompare(second.Nombre, "es"));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 18 },
    { wch: 28 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
    { wch: 15 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Accesos");
  XLSX.writeFile(workbook, `accesos_banorte_${date}.xlsx`);
}

export function exportEmployeeHistoryToExcel({
  employee,
  events,
  lockers,
}: {
  employee: Employee;
  events: EmployeeAccessEvent[];
  lockers: LockerIsland[];
}) {
  const lockerById = new Map(lockers.map((locker) => [locker.id, locker]));

  const rows = events.map((event) => ({
    Fecha: formatDate(event.date),
    Hora: formatTime(event.occurredAt),
    Movimiento: event.type === "ENTRY" ? "Entrada" : "Salida",
    Nombre: employee.name,
    "Número de empleado": employee.employeeNumber,
    "Número de gafete": employee.badgeNumber,
    Isla: lockerById.get(event.lockerId)?.alias ?? "",
    Compartimento: event.compartmentNumber,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 12 },
    { wch: 10 },
    { wch: 13 },
    { wch: 28 },
    { wch: 18 },
    { wch: 18 },
    { wch: 14 },
    { wch: 15 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
  XLSX.writeFile(
    workbook,
    `historial_${sanitizeFilePart(employee.name) || "empleado"}.xlsx`,
  );
}
