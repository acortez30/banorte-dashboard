import type {
  Employee,
  EmployeeAccessEvent,
} from "@/types/dashboard";

export const LOCKER_COMPARTMENT_COUNT = 110;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayDateValue() {
  return toDateInputValue(new Date());
}

export function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function dateTimeForMinutes(date: string, minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${date}T${pad(hours)}:${pad(mins)}:00`;
}

function currentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function minutesBetween(seed: number, min: number, max: number) {
  if (max <= min) return min;
  return min + (seed % (max - min + 1));
}

export function getEmployeeCompartmentNumber(
  employee: Employee,
  employees: Employee[],
) {
  const sameLocker = employees
    .filter((item) => item.lockerId === employee.lockerId)
    .sort((a, b) => a.id.localeCompare(b.id));

  const index = Math.max(
    0,
    sameLocker.findIndex((item) => item.id === employee.id),
  );

  // 17 es coprimo con 110, así cada posición produce un compartimento único.
  return ((index * 17 + 5) % LOCKER_COMPARTMENT_COUNT) + 1;
}

function shouldAttend(employee: Employee, date: string) {
  if (!employee.active) return false;

  const day = parseLocalDate(date).getDay();
  const weekend = day === 0 || day === 6;
  const score = hashString(`${employee.id}:${date}:attendance`) % 100;

  return score < (weekend ? 18 : 86);
}

function buildEventsForEmployee(
  employee: Employee,
  employees: Employee[],
  date: string,
): EmployeeAccessEvent[] {
  if (!shouldAttend(employee, date)) return [];

  const seed = hashString(`${employee.id}:${date}`);
  const entryMinutes = minutesBetween(seed, 6 * 60 + 45, 9 * 60 + 35);

  const earlyExit = seed % 17 === 0;
  const exitMinutes = earlyExit
    ? minutesBetween(seed >> 3, 11 * 60 + 30, 14 * 60 + 30)
    : minutesBetween(seed >> 5, 16 * 60, 19 * 60 + 20);

  const today = todayDateValue();
  const maxMinute = date === today ? currentMinutes() : Number.POSITIVE_INFINITY;
  const compartmentNumber = getEmployeeCompartmentNumber(employee, employees);

  const events: EmployeeAccessEvent[] = [];

  if (entryMinutes <= maxMinute) {
    events.push({
      id: `${employee.id}-${date}-entry`,
      employeeId: employee.id,
      type: "ENTRY",
      date,
      occurredAt: dateTimeForMinutes(date, entryMinutes),
      lockerId: employee.lockerId,
      compartmentNumber,
    });
  }

  if (exitMinutes <= maxMinute) {
    events.push({
      id: `${employee.id}-${date}-exit`,
      employeeId: employee.id,
      type: "EXIT",
      date,
      occurredAt: dateTimeForMinutes(date, exitMinutes),
      lockerId: employee.lockerId,
      compartmentNumber,
    });
  }

  return events;
}

export function getAccessEventsForDate(
  date: string,
  employees: Employee[],
) {
  return employees
    .flatMap((employee) => buildEventsForEmployee(employee, employees, date))
    .sort(
      (a, b) =>
        new Date(b.occurredAt).getTime() -
        new Date(a.occurredAt).getTime(),
    );
}

export function getEmployeeAccessHistory(
  employee: Employee,
  employees: Employee[],
  days = 30,
) {
  const today = new Date();
  const events: EmployeeAccessEvent[] = [];

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    const dateValue = toDateInputValue(date);

    events.push(...buildEventsForEmployee(employee, employees, dateValue));
  }

  return events.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() -
      new Date(a.occurredAt).getTime(),
  );
}
