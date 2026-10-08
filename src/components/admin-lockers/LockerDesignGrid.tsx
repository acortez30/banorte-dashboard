import {
  UserRound,
} from "lucide-react";

import LockerCentralModule from "@/components/admin-lockers/LockerCentralModule";

import type {
  Employee,
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/admin-lockers/LockerDesignGrid.css";


/* =========================================================
   TYPES
   ========================================================= */

export type LockerDoorStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "OPEN";


export interface LockerDoorView {
  number: number;

  moduleId: string;

  side:
    | "LEFT"
    | "RIGHT";

  row: number;

  size: "L";

  status: LockerDoorStatus;

  employee?: Employee;
}


interface BuildLockerDoorViewsProps {
  locker: LockerIsland;

  employees: Employee[];

  openDoors: Set<number>;
}


interface LockerDesignGridProps {
  doors: LockerDoorView[];

  selectedDoor?: number;

  onSelectDoor: (
    door: LockerDoorView,
  ) => void;
}


interface ModuleSpec {
  id: string;

  type:
    | "STANDARD"
    | "CENTRAL";
}


/* =========================================================
   CONFIGURATION

   11 modules
   10 Large compartments per module

   11 × 10 = 110
   ========================================================= */

export const LOCKER_CAPACITY =
  110;


const ROWS = [
  1,
  2,
  3,
  4,
  5,
];


const MODULE_SPECS:
  ModuleSpec[] = [
    {
      id: "L1",
      type: "STANDARD",
    },
    {
      id: "L2",
      type: "STANDARD",
    },
    {
      id: "L3",
      type: "STANDARD",
    },
    {
      id: "L4",
      type: "STANDARD",
    },
    {
      id: "L5",
      type: "STANDARD",
    },

    {
      id: "CM",
      type: "CENTRAL",
    },

    {
      id: "R1",
      type: "STANDARD",
    },
    {
      id: "R2",
      type: "STANDARD",
    },
    {
      id: "R3",
      type: "STANDARD",
    },
    {
      id: "R4",
      type: "STANDARD",
    },
    {
      id: "R5",
      type: "STANDARD",
    },
  ];


/* =========================================================
   BLUEPRINT

   Every module:
   LEFT  = 5
   RIGHT = 5
   TOTAL = 10
   ========================================================= */

function createBlueprints() {
  const positions: Array<{
    number: number;

    moduleId: string;

    side:
      | "LEFT"
      | "RIGHT";

    row: number;
  }> = [];


  let currentNumber =
    1;


  MODULE_SPECS.forEach(
    (module) => {
      ROWS.forEach(
        (row) => {
          positions.push({
            number:
              currentNumber,

            moduleId:
              module.id,

            side:
              "LEFT",

            row,
          });

          currentNumber +=
            1;
        },
      );


      ROWS.forEach(
        (row) => {
          positions.push({
            number:
              currentNumber,

            moduleId:
              module.id,

            side:
              "RIGHT",

            row,
          });

          currentNumber +=
            1;
        },
      );
    },
  );


  return positions;
}


const BLUEPRINTS =
  createBlueprints();


/* =========================================================
   MOCK CURRENT COMPARTMENT

   Employee:
   permanent -> island
   dynamic   -> compartment
   ========================================================= */

function getMockCurrentDoor(
  employee: Employee,
  index: number,
) {
  const seed =
    employee.id
      .split("")
      .reduce(
        (
          total,
          character,
        ) =>
          total +
          character.charCodeAt(
            0,
          ),
        0,
      );


  return (
    (
      seed +
      index * 17
    ) %
      LOCKER_CAPACITY
  ) + 1;
}


/* =========================================================
   BUILD DOORS
   ========================================================= */

export function buildLockerDoorViews({
  locker,
  employees,
  openDoors,
}: BuildLockerDoorViewsProps):
  LockerDoorView[] {
  const lockerEmployees =
    employees.filter(
      (employee) =>
        employee.active &&
        employee.lockerId ===
          locker.id,
    );


  const currentAssignments =
    new Map<
      number,
      Employee
    >();


  const usedDoors =
    new Set<number>();


  lockerEmployees.forEach(
    (
      employee,
      index,
    ) => {
      let number =
        getMockCurrentDoor(
          employee,
          index,
        );


      while (
        usedDoors.has(
          number,
        )
      ) {
        number =
          number >=
          LOCKER_CAPACITY
            ? 1
            : number + 1;
      }


      usedDoors.add(
        number,
      );


      currentAssignments.set(
        number,
        employee,
      );
    },
  );


  return BLUEPRINTS.map(
    (position) => {
      const employee =
        currentAssignments.get(
          position.number,
        );


      let status:
        LockerDoorStatus =
        employee
          ? "OCCUPIED"
          : "AVAILABLE";


      if (
        openDoors.has(
          position.number,
        )
      ) {
        status =
          "OPEN";
      }


      return {
        ...position,

        size:
          "L",

        status,

        employee,
      };
    },
  );
}


/* =========================================================
   DOOR
   ========================================================= */

export function LockerDoor({
  door,
  selected,
  onSelect,
}: {
  door: LockerDoorView;

  selected: boolean;

  onSelect: (
    door: LockerDoorView,
  ) => void;
}) {
  return (
    <button
      type="button"
      className={`
        locker-design__door
        locker-design__door--${door.status.toLowerCase()}

        ${
          selected
            ? "locker-design__door--selected"
            : ""
        }
      `}
      onClick={() => {
        onSelect(
          door,
        );
      }}
      title={
        door.employee
          ? `Compartimento ${door.number} · ${door.employee.name}`
          : `Compartimento ${door.number} · Large`
      }
      aria-label={
        `Compartimento ${door.number}`
      }
    >
      <div className="locker-design__door-header">
        <span className="locker-design__door-size">
          L
        </span>

        {door.employee ? (
          <span className="locker-design__door-employee">
            <UserRound
              size={12}
              strokeWidth={2}
            />
          </span>
        ) : null}
      </div>


      <strong className="locker-design__door-number">
        {String(
          door.number,
        ).padStart(
          3,
          "0",
        )}
      </strong>


      <div className="locker-design__door-footer">
        <i
          className={`
            locker-design__door-status
            locker-design__door-status--${door.status.toLowerCase()}
          `}
        />

        <span>
          {door.status ===
          "OCCUPIED"
            ? "Ocupado"
            : door.status ===
                "OPEN"
              ? "Abierto"
              : "Disponible"}
        </span>
      </div>
    </button>
  );
}


/* =========================================================
   STANDARD MODULE
   ========================================================= */

function StandardLockerModule({
  doors,
  selectedDoor,
  onSelectDoor,
}: {
  doors: LockerDoorView[];

  selectedDoor?: number;

  onSelectDoor: (
    door: LockerDoorView,
  ) => void;
}) {
  const leftDoors =
    doors.filter(
      (door) =>
        door.side ===
        "LEFT",
    );


  const rightDoors =
    doors.filter(
      (door) =>
        door.side ===
        "RIGHT",
    );


  return (
    <article className="locker-module">
      <div className="locker-module__body">
        <div className="locker-module__column">
          {leftDoors.map(
            (door) => (
              <LockerDoor
                key={
                  door.number
                }
                door={
                  door
                }
                selected={
                  selectedDoor ===
                  door.number
                }
                onSelect={
                  onSelectDoor
                }
              />
            ),
          )}
        </div>


        <div className="locker-module__column">
          {rightDoors.map(
            (door) => (
              <LockerDoor
                key={
                  door.number
                }
                door={
                  door
                }
                selected={
                  selectedDoor ===
                  door.number
                }
                onSelect={
                  onSelectDoor
                }
              />
            ),
          )}
        </div>
      </div>
    </article>
  );
}


/* =========================================================
   GRID
   ========================================================= */

export default function LockerDesignGrid({
  doors,
  selectedDoor,
  onSelectDoor,
}: LockerDesignGridProps) {
  const modules =
    MODULE_SPECS.map(
      (module) => ({
        ...module,

        doors:
          doors.filter(
            (door) =>
              door.moduleId ===
              module.id,
          ),
      }),
    );


  return (
    <div className="locker-design">
      <div className="locker-design__viewport">
        <div className="locker-design__modules">
          {modules.map(
            (module) => {
              if (
                module.type ===
                "CENTRAL"
              ) {
                return (
                  <LockerCentralModule
                    key={
                      module.id
                    }
                    doors={
                      module.doors
                    }
                    selectedDoor={
                      selectedDoor
                    }
                    onSelectDoor={
                      onSelectDoor
                    }
                  />
                );
              }


              return (
                <StandardLockerModule
                  key={
                    module.id
                  }
                  doors={
                    module.doors
                  }
                  selectedDoor={
                    selectedDoor
                  }
                  onSelectDoor={
                    onSelectDoor
                  }
                />
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}