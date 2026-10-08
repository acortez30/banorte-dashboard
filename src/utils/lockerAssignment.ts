import { COMPARTMENTS_PER_LOCKER } from "@/data/mockData";
import type { Employee, LockerIsland } from "@/types/dashboard";

export interface LockerLoad {
  locker: LockerIsland;
  assigned: number;
  available: number;
  percent: number;
}

export function getLockerLoads(
  lockers: LockerIsland[],
  employees: Employee[],
): LockerLoad[] {
  const countByLocker = new Map<string, number>();

  for (const employee of employees) {
    countByLocker.set(
      employee.lockerId,
      (countByLocker.get(employee.lockerId) ?? 0) + 1,
    );
  }

  return lockers.map((locker) => {
    const assigned = countByLocker.get(locker.id) ?? 0;
    const capacity = locker.compartments || COMPARTMENTS_PER_LOCKER;
    const available = Math.max(capacity - assigned, 0);

    return {
      locker,
      assigned,
      available,
      percent: capacity > 0 ? Math.round((assigned / capacity) * 100) : 0,
    };
  });
}

export function getBestLockerId(
  lockers: LockerIsland[],
  employees: Employee[],
): string | null {
  const availableLockers = getLockerLoads(
    lockers.filter((locker) => locker.active),
    employees,
  )
    .filter((load) => load.available > 0)
    .sort((a, b) => {
      if (a.assigned !== b.assigned) return a.assigned - b.assigned;
      return a.locker.alias.localeCompare(b.locker.alias, "es");
    });

  return availableLockers[0]?.locker.id ?? null;
}

export function requiredLockers(employeeCount: number) {
  return Math.ceil(employeeCount / COMPARTMENTS_PER_LOCKER);
}

export function capacitySummary(lockers: LockerIsland[], employees: Employee[]) {
  const activeLockers = lockers.filter((locker) => locker.active);
  const totalCapacity = activeLockers.reduce(
    (sum, locker) => sum + locker.compartments,
    0,
  );
  const assigned = employees.length;
  const required = requiredLockers(assigned);

  return {
    activeLockerCount: activeLockers.length,
    totalCapacity,
    assigned,
    available: Math.max(totalCapacity - assigned, 0),
    required,
    additionalRequired: Math.max(required - activeLockers.length, 0),
    hasCapacity: assigned <= totalCapacity,
  };
}

export function distributeNewEmployees<T extends Omit<Employee, "id" | "lockerId" | "createdAt">>(
  rows: T[],
  lockers: LockerIsland[],
  existingEmployees: Employee[],
): Employee[] | null {
  const projectedTotal = existingEmployees.length + rows.length;
  const totalCapacity = lockers
    .filter((locker) => locker.active)
    .reduce((sum, locker) => sum + locker.compartments, 0);

  if (projectedTotal > totalCapacity) return null;

  const workingEmployees = [...existingEmployees];
  const created: Employee[] = [];

  rows.forEach((row, index) => {
    const lockerId = getBestLockerId(lockers, workingEmployees);
    if (!lockerId) return;

    const employee: Employee = {
      ...row,
      id: `employee-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      lockerId,
      createdAt: new Date().toISOString(),
    };

    created.push(employee);
    workingEmployees.push(employee);
  });

  return created.length === rows.length ? created : null;
}
