import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  BadgeCheck,
  Phone,
  Sparkles,
  UserRound,
} from "lucide-react";

import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";
import ToggleSwitch from "@/components/common/ToggleSwitch";

import EmployeeLockerSelect from "@/components/employees/EmployeeLockerSelect";

import type {
  Employee,
  LockerIsland,
} from "@/types/dashboard";

import {
  getLockerLoads,
} from "@/utils/lockerAssignment";

import "@/styles/employees/EmployeeFormDialog.css";

interface EmployeeFormValue {
  name: string;
  phone: string;
  employeeNumber: string;
  badgeNumber: string;
  lockerId?: string;
  active: boolean;
}

interface EmployeeFormDialogProps {
  open: boolean;

  onClose: () => void;

  employee?: Employee | null;

  lockers: LockerIsland[];
  employees: Employee[];

  onSubmit: (
    value: EmployeeFormValue,
  ) => {
    ok: boolean;
    error?: string;
  };
}

export default function EmployeeFormDialog({
  open,
  onClose,

  employee,

  lockers,
  employees,

  onSubmit,
}: EmployeeFormDialogProps) {
  const [
    name,
    setName,
  ] = useState("");

  const [
    phone,
    setPhone,
  ] = useState("");

  const [
    employeeNumber,
    setEmployeeNumber,
  ] = useState("");

  const [
    badgeNumber,
    setBadgeNumber,
  ] = useState("");

  const [
    lockerId,
    setLockerId,
  ] = useState("AUTO");

  const [
    active,
    setActive,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const isEditing =
    Boolean(employee);


  /* =======================================================
     RESET FORM
     ======================================================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(
      employee?.name ?? "",
    );

    setPhone(
      employee?.phone ?? "",
    );

    setEmployeeNumber(
      employee?.employeeNumber ??
        "",
    );

    setBadgeNumber(
      employee?.badgeNumber ??
        "",
    );

    setLockerId(
      employee?.lockerId ??
        "AUTO",
    );

    setActive(
      employee?.active ??
        true,
    );

    setError("");
  }, [
    employee,
    open,
  ]);


  /* =======================================================
     LOCKER LOADS
     ======================================================= */

  const loads = useMemo(
    () =>
      getLockerLoads(
        lockers,
        employees,
      ),
    [
      lockers,
      employees,
    ],
  );


  /* =======================================================
     VALIDATION
     ======================================================= */

  const normalizedPhone =
    phone.replace(
      /\D/g,
      "",
    );

  const nameValid =
    name.trim().length >= 3;

  const phoneValid =
    /^\d{10}$/.test(
      normalizedPhone,
    );

  const employeeNumberValid =
    employeeNumber
      .trim()
      .length > 0;

  const badgeNumberValid =
    badgeNumber
      .trim()
      .length > 0;

  const valid =
    nameValid &&
    phoneValid &&
    employeeNumberValid &&
    badgeNumberValid;


  /* =======================================================
     HANDLERS
     ======================================================= */

  const handlePhoneChange = (
    value: string,
  ) => {
    const digits =
      value
        .replace(
          /\D/g,
          "",
        )
        .slice(
          0,
          10,
        );

    setPhone(
      digits,
    );
  };

  const submit = () => {
    if (!valid) {
      return;
    }

    setError("");

    const result =
      onSubmit({
        name:
          name.trim(),

        phone:
          normalizedPhone,

        employeeNumber:
          employeeNumber.trim(),

        badgeNumber:
          badgeNumber.trim(),

        lockerId:
          lockerId === "AUTO"
            ? undefined
            : lockerId,

        active,
      });

    if (result.ok) {
      onClose();
      return;
    }

    setError(
      result.error ??
        "No se pudo guardar el empleado.",
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={
        isEditing
          ? "Editar empleado"
          : "Nuevo empleado"
      }
      description={
        isEditing
          ? "Actualiza la información y asignación del empleado."
          : "Registra un empleado y asígnalo automáticamente o selecciona una isla."
      }
      width="max-w-2xl"
      panelClassName="employee-form-dialog"
      footer={
        <div className="employee-form__footer">
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
              : "Crear empleado"}
          </Button>
        </div>
      }
    >
      <div className="employee-form">
        {/* =================================================
            EMPLOYEE INFORMATION
            ================================================= */}
        <section className="employee-form__section">
          <div className="employee-form__section-header">
            <div className="employee-form__section-icon">
              <UserRound
                size={16}
                strokeWidth={2}
              />
            </div>

            <div>
              <h3>
                Datos del empleado
              </h3>

              <p>
                Información utilizada para identificar al empleado.
              </p>
            </div>
          </div>

          <div className="employee-form__grid">
            {/* NAME */}
            <label className="employee-form__field employee-form__field--full">
              <span className="employee-form__label">
                Nombre
              </span>

              <div className="employee-form__input-wrapper">
                <UserRound
                  size={16}
                  className="employee-form__input-icon"
                />

                <input
                  className="employee-form__input"
                  value={
                    name
                  }
                  onChange={(
                    event,
                  ) => {
                    setName(
                      event.target.value,
                    );
                  }}
                  placeholder="Nombre completo"
                  autoFocus
                />
              </div>
            </label>

            {/* PHONE */}
            <label className="employee-form__field">
              <span className="employee-form__label">
                Teléfono
              </span>

              <div className="employee-form__input-wrapper">
                <Phone
                  size={16}
                  className="employee-form__input-icon"
                />

                <input
                  className="employee-form__input"
                  value={
                    phone
                  }
                  onChange={(
                    event,
                  ) => {
                    handlePhoneChange(
                      event.target.value,
                    );
                  }}
                  placeholder="10 dígitos"
                  inputMode="numeric"
                />
              </div>

              {phone.length > 0 &&
              !phoneValid ? (
                <span className="employee-form__field-error">
                  Ingresa un teléfono de 10 dígitos.
                </span>
              ) : null}
            </label>

            {/* EMPLOYEE NUMBER */}
            <label className="employee-form__field">
              <span className="employee-form__label">
                Número de empleado
              </span>

              <div className="employee-form__input-wrapper">
                <BadgeCheck
                  size={16}
                  className="employee-form__input-icon"
                />

                <input
                  className="employee-form__input"
                  value={
                    employeeNumber
                  }
                  onChange={(
                    event,
                  ) => {
                    setEmployeeNumber(
                      event.target.value,
                    );
                  }}
                  placeholder="Ej. BN10482"
                />
              </div>
            </label>

            {/* BADGE */}
            <label className="employee-form__field">
              <span className="employee-form__label">
                Número de gafete
              </span>

              <div className="employee-form__input-wrapper">
                <BadgeCheck
                  size={16}
                  className="employee-form__input-icon"
                />

                <input
                  className="employee-form__input"
                  value={
                    badgeNumber
                  }
                  onChange={(
                    event,
                  ) => {
                    setBadgeNumber(
                      event.target.value,
                    );
                  }}
                  placeholder="Ej. GF90817"
                />
              </div>
            </label>

            {/* LOCKER */}
            <div className="employee-form__field">
              <span className="employee-form__label">
                Isla
              </span>

              <EmployeeLockerSelect
                value={
                  lockerId
                }
                loads={
                  loads
                }
                allowAuto={
                  !isEditing
                }
                currentLockerId={
                  employee?.lockerId
                }
                onChange={
                  setLockerId
                }
              />
            </div>
          </div>
        </section>


        {/* =================================================
            AUTOMATIC ASSIGNMENT
            ================================================= */}
        {!isEditing &&
        lockerId === "AUTO" ? (
          <div className="employee-form__auto-info">
            <div className="employee-form__auto-icon">
              <Sparkles
                size={16}
                strokeWidth={2}
              />
            </div>

            <div>
              <strong>
                Asignación automática
              </strong>

              <p>
                El sistema seleccionará la isla activa con menor
                número de empleados para mantener una distribución
                equilibrada.
              </p>
            </div>
          </div>
        ) : null}


        {/* =================================================
            ACCESS
            ================================================= */}
        {isEditing ? (
          <section className="employee-form__access">
            <div>
              <strong>
                Acceso del empleado
              </strong>

              <p>
                Permite o bloquea el acceso del empleado al servicio.
              </p>
            </div>

            <ToggleSwitch
              checked={
                active
              }
              onChange={
                setActive
              }
              label="Cambiar acceso del empleado"
            />
          </section>
        ) : null}


        {/* =================================================
            ERROR
            ================================================= */}
        {error ? (
          <div className="employee-form__error">
            <AlertCircle
              size={17}
              strokeWidth={2}
            />

            <span>
              {error}
            </span>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}