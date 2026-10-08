import {
  DoorOpen,
  LockKeyhole,
  UserRound,
} from "lucide-react";

import Button from "@/components/common/Button";
import Dialog from "@/components/common/Dialog";

import type {
  LockerIsland,
} from "@/types/dashboard";

import type {
  LockerDoorView,
} from "@/components/admin-lockers/LockerDesignGrid";

import "@/styles/admin-lockers/CompartmentActionDialog.css";

export default function CompartmentActionDialog({
  open,
  door,
  locker,
  onClose,
  onOpenDoor,
}: {
  open: boolean;
  door: LockerDoorView | null;
  locker: LockerIsland | null;
  onClose: () => void;
  onOpenDoor: (door: LockerDoorView) => void;
}) {
  if (!door || !locker) return null;

  const alreadyOpen = door.status === "OPEN";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Compartimento ${door.number}`}
      description={`${locker.alias} · ${locker.location}`}
      width="max-w-md"
      panelClassName="compartment-action-dialog"
      footer={
        <div className="compartment-action__footer">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            icon={DoorOpen}
            disabled={alreadyOpen}
            onClick={() => onOpenDoor(door)}
          >
            {alreadyOpen ? "Compartimento abierto" : "Abrir compartimento"}
          </Button>
        </div>
      }
    >
      <div className="compartment-action">
        <div className={`compartment-action__door compartment-action__door--${door.status.toLowerCase()}`}>
          {alreadyOpen ? <DoorOpen size={24} strokeWidth={2} /> : <LockKeyhole size={24} strokeWidth={2} />}
          <strong>{door.number}</strong>
          <span>Large</span>
        </div>

        <div className="compartment-action__details">
          <div>
            <span>Estado</span>
            <strong>
              {alreadyOpen ? "Abierto" : door.employee ? "Ocupado" : "Disponible"}
            </strong>
          </div>

          <div>
            <span>Tamaño</span>
            <strong>Large</strong>
          </div>
        </div>

        {door.employee ? (
          <div className="compartment-action__employee">
            <div className="compartment-action__employee-icon">
              <UserRound size={17} strokeWidth={2} />
            </div>
            <div>
              <span>Asignado a</span>
              <strong>{door.employee.name}</strong>
              <small>{door.employee.employeeNumber} · {door.employee.badgeNumber}</small>
            </div>
          </div>
        ) : null}

        <p className="compartment-action__notice">
          La apertura requiere confirmación para evitar acciones accidentales desde el dashboard.
        </p>
      </div>
    </Dialog>
  );
}
