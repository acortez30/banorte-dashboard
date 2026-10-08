export type UserRole = "SUPER_ADMIN" | "ADMIN";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  registeredAt: string;
  active: boolean;
  organization: "Vivipost" | "Banorte";
  password: string;
}

export interface LockerIsland {
  id: string;
  alias: string;
  location: string;
  compartments: number;
  active: boolean;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  employeeNumber: string;
  badgeNumber: string;
  lockerId: string;
  active: boolean;
  createdAt: string;
}

export interface EmployeeImportRow {
  name: string;
  phone: string;
  employeeNumber: string;
  badgeNumber: string;
}

export type EmployeeAccessEventType = "ENTRY" | "EXIT";

export interface EmployeeAccessEvent {
  id: string;
  employeeId: string;
  type: EmployeeAccessEventType;
  date: string;
  occurredAt: string;
  lockerId: string;
  compartmentNumber: number;
}
