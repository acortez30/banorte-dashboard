import { createContext, useContext, useMemo, type ReactNode } from "react";
import { MOCK_EMPLOYEES, MOCK_LOCKERS, MOCK_USERS, COMPARTMENTS_PER_LOCKER } from "@/data/mockData";
import { usePersistentState } from "@/hooks/usePersistentState";
import { distributeNewEmployees, getBestLockerId } from "@/utils/lockerAssignment";
import type { DashboardUser, Employee, EmployeeImportRow, LockerIsland } from "@/types/dashboard";

interface AddLockerInput {
  alias: string;
  location: string;
}

interface AddEmployeeInput {
  name: string;
  phone: string;
  employeeNumber: string;
  badgeNumber: string;
  lockerId?: string;
  active?: boolean;
}

interface DataContextValue {
  lockers: LockerIsland[];
  employees: Employee[];
  users: DashboardUser[];
  addLocker: (input: AddLockerInput) => LockerIsland;
  updateLocker: (id: string, patch: Partial<Pick<LockerIsland, "alias" | "location" | "active">>) => void;
  addEmployee: (input: AddEmployeeInput) => { ok: true } | { ok: false; error: string };
  updateEmployee: (id: string, patch: Partial<Omit<Employee, "id" | "createdAt">>) => { ok: true } | { ok: false; error: string };
  toggleEmployee: (id: string, active: boolean) => void;
  importEmployees: (rows: EmployeeImportRow[]) => { ok: true; created: number } | { ok: false; error: string };
  addUser: (input: Omit<DashboardUser, "id" | "registeredAt">) => { ok: true } | { ok: false; error: string };
  updateUser: (id: string, patch: Partial<Omit<DashboardUser, "id" | "registeredAt">>) => { ok: true } | { ok: false; error: string };
  toggleUser: (id: string, active: boolean) => void;
  resetMockData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [lockers, setLockers] = usePersistentState<LockerIsland[]>("banorte_mock_lockers", MOCK_LOCKERS);
  const [employees, setEmployees] = usePersistentState<Employee[]>("banorte_mock_employees", MOCK_EMPLOYEES);
  const [users, setUsers] = usePersistentState<DashboardUser[]>("banorte_mock_users", MOCK_USERS);

  const value = useMemo<DataContextValue>(() => ({
    lockers,
    employees,
    users,
    addLocker(input) {
      const locker: LockerIsland = {
        id: `locker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        alias: input.alias.trim(),
        location: input.location.trim(),
        compartments: COMPARTMENTS_PER_LOCKER,
        active: true,
        createdAt: new Date().toISOString(),
      };
      setLockers((current) => [...current, locker]);
      return locker;
    },
    updateLocker(id, patch) {
      setLockers((current) => current.map((locker) => locker.id === id ? { ...locker, ...patch } : locker));
    },
    addEmployee(input) {
      const duplicate = employees.some((employee) =>
        employee.employeeNumber.toLowerCase() === input.employeeNumber.trim().toLowerCase() ||
        employee.badgeNumber.toLowerCase() === input.badgeNumber.trim().toLowerCase(),
      );
      if (duplicate) return { ok: false, error: "El número de empleado o gafete ya existe." };

      let lockerId = input.lockerId;
      if (!lockerId || lockerId === "AUTO") {
        lockerId = getBestLockerId(lockers, employees) ?? undefined;
      }
      if (!lockerId) return { ok: false, error: "No hay capacidad disponible en las islas activas." };

      const target = lockers.find((locker) => locker.id === lockerId && locker.active);
      if (!target) return { ok: false, error: "La isla seleccionada no está disponible." };

      const assigned = employees.filter((employee) => employee.lockerId === lockerId).length;
      if (assigned >= target.compartments) return { ok: false, error: `${target.alias} ya alcanzó sus ${target.compartments} asignaciones.` };

      const employee: Employee = {
        id: `employee-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: input.name.trim(),
        phone: input.phone.trim(),
        employeeNumber: input.employeeNumber.trim(),
        badgeNumber: input.badgeNumber.trim(),
        lockerId,
        active: input.active ?? true,
        createdAt: new Date().toISOString(),
      };
      setEmployees((current) => [...current, employee]);
      return { ok: true };
    },
    updateEmployee(id, patch) {
      const currentEmployee = employees.find((employee) => employee.id === id);
      if (!currentEmployee) return { ok: false, error: "Empleado no encontrado." };

      const duplicate = employees.some((employee) => employee.id !== id && (
        (patch.employeeNumber && employee.employeeNumber.toLowerCase() === patch.employeeNumber.trim().toLowerCase()) ||
        (patch.badgeNumber && employee.badgeNumber.toLowerCase() === patch.badgeNumber.trim().toLowerCase())
      ));
      if (duplicate) return { ok: false, error: "El número de empleado o gafete ya existe." };

      if (patch.lockerId && patch.lockerId !== currentEmployee.lockerId) {
        const target = lockers.find((locker) => locker.id === patch.lockerId && locker.active);
        if (!target) return { ok: false, error: "La isla seleccionada no está disponible." };
        const assigned = employees.filter((employee) => employee.id !== id && employee.lockerId === patch.lockerId).length;
        if (assigned >= target.compartments) return { ok: false, error: `${target.alias} ya alcanzó sus ${target.compartments} asignaciones.` };
      }

      setEmployees((current) => current.map((employee) => employee.id === id ? { ...employee, ...patch } : employee));
      return { ok: true };
    },
    toggleEmployee(id, active) {
      setEmployees((current) => current.map((employee) => employee.id === id ? { ...employee, active } : employee));
    },
    importEmployees(rows) {
      const existingEmployeeNumbers = new Set(employees.map((employee) => employee.employeeNumber.toLowerCase()));
      const existingBadges = new Set(employees.map((employee) => employee.badgeNumber.toLowerCase()));
      const incomingEmployeeNumbers = new Set<string>();
      const incomingBadges = new Set<string>();

      for (const row of rows) {
        const employeeNumber = row.employeeNumber.trim().toLowerCase();
        const badgeNumber = row.badgeNumber.trim().toLowerCase();
        if (existingEmployeeNumbers.has(employeeNumber) || incomingEmployeeNumbers.has(employeeNumber)) {
          return { ok: false, error: `Número de empleado duplicado: ${row.employeeNumber}` };
        }
        if (existingBadges.has(badgeNumber) || incomingBadges.has(badgeNumber)) {
          return { ok: false, error: `Número de gafete duplicado: ${row.badgeNumber}` };
        }
        incomingEmployeeNumbers.add(employeeNumber);
        incomingBadges.add(badgeNumber);
      }

      const created = distributeNewEmployees(
        rows.map((row) => ({ ...row, active: true })),
        lockers,
        employees,
      );

      if (!created) {
        const capacity = lockers.filter((locker) => locker.active).reduce((sum, locker) => sum + locker.compartments, 0);
        return {
          ok: false,
          error: `Capacidad insuficiente. El total proyectado sería ${employees.length + rows.length} empleados y la capacidad actual es ${capacity}.`,
        };
      }

      setEmployees((current) => [...current, ...created]);
      return { ok: true, created: created.length };
    },
    addUser(input) {
      const exists = users.some((user) => user.email.toLowerCase() === input.email.trim().toLowerCase());
      if (exists) return { ok: false, error: "Ya existe un usuario con ese correo." };

      const user: DashboardUser = {
        ...input,
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        registeredAt: new Date().toISOString(),
      };
      setUsers((current) => [...current, user]);
      return { ok: true };
    },
    updateUser(id, patch) {
      if (patch.email) {
        const exists = users.some((user) => user.id !== id && user.email.toLowerCase() === patch.email!.trim().toLowerCase());
        if (exists) return { ok: false, error: "Ya existe un usuario con ese correo." };
      }
      setUsers((current) => current.map((user) => user.id === id ? { ...user, ...patch, email: patch.email?.trim().toLowerCase() ?? user.email } : user));
      return { ok: true };
    },
    toggleUser(id, active) {
      setUsers((current) => current.map((user) => user.id === id ? { ...user, active } : user));
    },
    resetMockData() {
      setLockers(MOCK_LOCKERS);
      setEmployees(MOCK_EMPLOYEES);
      setUsers(MOCK_USERS);
    },
  }), [lockers, employees, users, setLockers, setEmployees, setUsers]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataProvider");
  return context;
}
