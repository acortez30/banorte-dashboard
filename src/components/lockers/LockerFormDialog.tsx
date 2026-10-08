import {
  useEffect,
  useState,
} from "react";

import {
  Boxes,
  Building2,
  DoorOpen,
} from "lucide-react";

import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import ToggleSwitch from "@/components/common/ToggleSwitch";

import type {
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/lockers/LockerFormDialog.css";


const LOCKER_CAPACITY =
  110;


interface LockerFormValue {
  alias: string;
  location: string;
  active: boolean;
}

interface LockerFormDialogProps {
  open: boolean;

  onClose: () => void;

  locker?:
    | LockerIsland
    | null;

  onSubmit: (
    value: LockerFormValue,
  ) => void;
}


export default function LockerFormDialog({
  open,
  onClose,

  locker,

  onSubmit,
}: LockerFormDialogProps) {
  const [
    alias,
    setAlias,
  ] = useState("");

  const [
    location,
    setLocation,
  ] = useState("");

  const [
    active,
    setActive,
  ] = useState(true);

  const isEditing =
    Boolean(
      locker,
    );


  /* =======================================================
     RESET
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setAlias(
      locker?.alias ??
        "",
    );

    setLocation(
      locker?.location ??
        "",
    );

    setActive(
      locker?.active ??
        true,
    );
  }, [
    locker,
    open,
  ]);


  /* =======================================================
     VALIDATION
     ======================================================= */

  const valid =
    alias
      .trim()
      .length >= 3 &&
    location
      .trim()
      .length >= 3;


  /* =======================================================
     SUBMIT
     ======================================================= */

  const submit = () => {
    if (!valid) {
      return;
    }

    onSubmit({
      alias:
        alias.trim(),

      location:
        location.trim(),

      active,
    });
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      title={
        isEditing
          ? "Editar locker"
          : "Nuevo locker"
      }
      description={
        isEditing
          ? "Actualiza los datos generales de la isla."
          : "Registra una nueva isla de lockers Banorte."
      }
      width="max-w-xl"
      panelClassName="locker-form-dialog"
      footer={
        <div className="locker-form__footer">
          <Button
            variant="secondary"
            onClick={
              onClose
            }
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            disabled={
              !valid
            }
            onClick={
              submit
            }
          >
            {isEditing
              ? "Guardar cambios"
              : "Crear locker"}
          </Button>
        </div>
      }
    >
      <div className="locker-form">
        {/* =================================================
            INFORMATION
            ================================================= */}
        <div className="locker-form__heading">
          <div className="locker-form__heading-icon">
            <Boxes
              size={17}
              strokeWidth={2}
            />
          </div>

          <div>
            <strong>
              Información de la isla
            </strong>

            <p>
              Identifica el locker y su ubicación dentro de Banorte.
            </p>
          </div>
        </div>


        {/* ALIAS */}
        <label className="locker-form__field">
          <span>
            Alias de la isla
          </span>

          <div className="locker-form__input-wrapper">
            <Boxes
              size={16}
            />

            <input
              value={
                alias
              }
              onChange={(
                event,
              ) => {
                setAlias(
                  event.target.value,
                );
              }}
              placeholder="Ej. Isla 07"
              autoFocus
            />
          </div>
        </label>


        {/* LOCATION */}
        <label className="locker-form__field">
          <span>
            Ubicación
          </span>

          <div className="locker-form__input-wrapper">
            <Building2
              size={16}
            />

            <input
              value={
                location
              }
              onChange={(
                event,
              ) => {
                setLocation(
                  event.target.value,
                );
              }}
              placeholder="Ej. Corporativo Banorte · Nivel 6"
            />
          </div>
        </label>


        {/* CAPACITY */}
        <div className="locker-form__capacity">
          <div className="locker-form__capacity-icon">
            <DoorOpen
              size={17}
              strokeWidth={2}
            />
          </div>

          <div>
            <span>
              Capacidad de la isla
            </span>

            <strong>
              {LOCKER_CAPACITY} compartimentos
            </strong>

            <p>
              La capacidad está definida para todas las islas Banorte.
            </p>
          </div>
        </div>


        {/* STATUS */}
        {isEditing ? (
          <div className="locker-form__status">
            <div>
              <strong>
                Locker activo
              </strong>

              <p>
                {active
                  ? "La isla puede recibir nuevas asignaciones."
                  : "La isla no recibirá nuevas asignaciones."}
              </p>
            </div>

            <ToggleSwitch
              checked={
                active
              }
              onChange={
                setActive
              }
              label="Cambiar estado del locker"
            />
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}