import {
  DoorOpen,
  UserRound,
} from "lucide-react";

import type {
  Employee,
  LockerIsland,
} from "@/types/dashboard";

import {
  getEmployeeCompartmentNumber,
  LOCKER_COMPARTMENT_COUNT,
} from "@/utils/attendance";

import "@/styles/admin-lockers/LockerDesignGrid.css";

export interface LockerDoorView {
  number: number;
  status: "AVAILABLE" | "OCCUPIED" | "OPEN";
  employee?: Employee;
}

const COLUMN_LABELS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S",
];

export function buildLockerDoorViews({
  locker,
  employees,
  openDoors,
}: {
  locker: LockerIsland;
  employees: Employee[];
  openDoors: Set<number>;
}) {
  const employeeByDoor = new Map<number, Employee>();

  employees
    .filter((employee) => employee.lockerId === locker.id)
    .forEach((employee) => {
      employeeByDoor.set(
        getEmployeeCompartmentNumber(employee, employees),
        employee,
      );
    });

  return Array.from({ length: LOCKER_COMPARTMENT_COUNT }, (_, index): LockerDoorView => {
    const number = index + 1;
    const employee = employeeByDoor.get(number);

    return {
      number,
      employee,
      status: openDoors.has(number)
        ? "OPEN"
        : employee
          ? "OCCUPIED"
          : "AVAILABLE",
    };
  });
}

export default function LockerDesignGrid({
  doors,
  selectedDoor,
  onSelectDoor,
}: {
  doors: LockerDoorView[];
  selectedDoor?: number | null;
  onSelectDoor: (door: LockerDoorView) => void;
}) {
  return (
    <div className="locker-design">
      <div className="locker-design__scroll">
        <div className="locker-design__board">
          <div className="locker-design__columns" aria-hidden="true">
            {COLUMN_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="locker-design__grid">
            {doors.map((door) => (
              <button
                key={door.number}
                type="button"
                className={`locker-design__door locker-design__door--${door.status.toLowerCase()} ${selectedDoor === door.number ? "locker-design__door--selected" : ""}`}
                onClick={() => onSelectDoor(door)}
                aria-label={`Compartimento ${door.number}, ${door.status === "AVAILABLE" ? "disponible" : door.status === "OCCUPIED" ? "ocupado" : "abierto"}`}
                title={`Compartimento ${door.number} · Large`}
              >
                <span className="locker-design__door-number">{door.number}</span>
                <span className="locker-design__door-size">L</span>

                {door.status === "OPEN" ? (
                  <DoorOpen size={13} strokeWidth={2} className="locker-design__door-icon" />
                ) : door.employee ? (
                  <UserRound size={12} strokeWidth={2} className="locker-design__door-icon" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
