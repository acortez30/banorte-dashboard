import {
  useEffect,
  useState,
} from "react";

import {
  BadgeCheck,
  Phone,
  UserRound,
} from "lucide-react";

import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";

import type {
  EmployeeImportRow,
} from "@/types/dashboard";

import type {
  BulkImportDraftRow,
} from "@/types/bulkImport";

import "@/styles/employees/BulkImportRowDialog.css";

interface BulkImportRowDialogProps {
  open: boolean;

  row:
    | BulkImportDraftRow
    | null;

  onClose: () => void;

  onSave: (
    id: string,
    value: EmployeeImportRow,
  ) => void;
}

export default function BulkImportRowDialog({
  open,
  row,
  onClose,
  onSave,
}: BulkImportRowDialogProps) {
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

  useEffect(() => {
    if (
      !open ||
      !row
    ) {
      return;
    }

    setName(
      row.name,
    );

    setPhone(
      row.phone,
    );

    setEmployeeNumber(
      row.employeeNumber,
    );

    setBadgeNumber(
      row.badgeNumber,
    );
  }, [
    open,
    row,
  ]);

  if (!row) {
    return null;
  }

  const basicValid =
    name.trim().length >=
      3 &&
    /^\d{10}$/.test(
      phone.replace(
        /\D/g,
        "",
      ),
    ) &&
    Boolean(
      employeeNumber.trim(),
    ) &&
    Boolean(
      badgeNumber.trim(),
    );

  const save = () => {
    if (!basicValid) {
      return;
    }

    onSave(
      row.id,
      {
        name:
          name.trim(),

        phone:
          phone.replace(
            /\D/g,
            "",
          ),

        employeeNumber:
          employeeNumber.trim(),

        badgeNumber:
          badgeNumber.trim(),
      },
    );
  };

  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      title={
        row.status ===
        "invalid"
          ? "Corregir empleado"
          : "Editar empleado"
      }
      description={`Fila ${row.sourceRow} del archivo cargado.`}
      width="max-w-xl"
      panelClassName="bulk-row-dialog"
      footer={
        <div className="bulk-row-dialog__footer">
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
              !basicValid
            }
            onClick={
              save
            }
          >
            Guardar cambios
          </Button>
        </div>
      }
    >
      <div className="bulk-row-dialog__form">
        <label className="bulk-row-dialog__field bulk-row-dialog__field--full">
          <span>
            Nombre
          </span>

          <div className="bulk-row-dialog__input-wrapper">
            <UserRound
              size={15}
            />

            <input
              value={
                name
              }
              onChange={(
                event,
              ) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Nombre completo"
            />
          </div>

          {row.errors.name ? (
            <small>
              {
                row.errors.name
              }
            </small>
          ) : null}
        </label>

        <label className="bulk-row-dialog__field">
          <span>
            Teléfono
          </span>

          <div className="bulk-row-dialog__input-wrapper">
            <Phone
              size={15}
            />

            <input
              value={
                phone
              }
              onChange={(
                event,
              ) =>
                setPhone(
                  event.target.value
                    .replace(
                      /\D/g,
                      "",
                    )
                    .slice(
                      0,
                      10,
                    ),
                )
              }
              inputMode="numeric"
              placeholder="10 dígitos"
            />
          </div>

          {row.errors.phone ? (
            <small>
              {
                row.errors.phone
              }
            </small>
          ) : null}
        </label>

        <label className="bulk-row-dialog__field">
          <span>
            Número de empleado
          </span>

          <div className="bulk-row-dialog__input-wrapper">
            <BadgeCheck
              size={15}
            />

            <input
              value={
                employeeNumber
              }
              onChange={(
                event,
              ) =>
                setEmployeeNumber(
                  event.target.value,
                )
              }
              placeholder="Ej. BN10482"
            />
          </div>

          {row.errors
            .employeeNumber ? (
            <small>
              {
                row.errors
                  .employeeNumber
              }
            </small>
          ) : null}
        </label>

        <label className="bulk-row-dialog__field bulk-row-dialog__field--full">
          <span>
            Número de gafete
          </span>

          <div className="bulk-row-dialog__input-wrapper">
            <BadgeCheck
              size={15}
            />

            <input
              value={
                badgeNumber
              }
              onChange={(
                event,
              ) =>
                setBadgeNumber(
                  event.target.value,
                )
              }
              placeholder="Ej. GF90817"
            />
          </div>

          {row.errors
            .badgeNumber ? (
            <small>
              {
                row.errors
                  .badgeNumber
              }
            </small>
          ) : null}
        </label>
      </div>
    </Dialog>
  );
}