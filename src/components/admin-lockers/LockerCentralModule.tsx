import {
  Monitor,
  Wifi,
} from "lucide-react";

import {
  LockerDoor,
  type LockerDoorView,
} from "./LockerDesignGrid";

import "@/styles/admin-lockers/LockerCentralModule.css";


interface LockerCentralModuleProps {
  doors: LockerDoorView[];

  selectedDoor?: number;

  onSelectDoor: (
    door: LockerDoorView,
  ) => void;
}


export default function LockerCentralModule({
  doors,
  selectedDoor,
  onSelectDoor,
}: LockerCentralModuleProps) {
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
    <article className="locker-central-module">
      <div className="locker-central-module__body">
        {/* LEFT */}

        <div className="locker-central-module__column">
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


        {/* RIGHT */}

        <div className="locker-central-module__column">
          {rightDoors.map(
            (
              door,
              index,
            ) => {
              /*
               * The center-right compartment
               * carries the locker screen.
               *
               * It remains part of the 110
               * compartments.
               */
              const hasScreen =
                index === 2;


              return (
                <div
                  key={
                    door.number
                  }
                  className="locker-central-module__door-wrapper"
                >
                  <LockerDoor
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


                  {hasScreen ? (
                    <div
                      className="locker-central-module__screen"
                      aria-hidden="true"
                    >
                      <header className="locker-central-module__screen-header">
                        <strong>
                          BANORTE
                        </strong>

                        <span>
                          <i />

                          <Wifi
                            size={9}
                            strokeWidth={2}
                          />
                        </span>
                      </header>


                      <div className="locker-central-module__screen-content">
                        <Monitor
                          size={19}
                          strokeWidth={1.8}
                        />

                        <strong>
                          Pantalla
                        </strong>

                        <span>
                          En línea
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            },
          )}
        </div>
      </div>
    </article>
  );
}