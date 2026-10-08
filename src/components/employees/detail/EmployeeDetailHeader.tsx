import {
  ArrowLeft,
} from "lucide-react";

import Button from "@/components/common/Button";

import EmployeeHistoryExportButton from "@/components/employees/detail/EmployeeHistoryExportButton";

import type {
  Employee,
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";


interface EmployeeDetailHeaderProps {
  employee: Employee;

  history: EmployeeAccessEvent[];

  lockers: LockerIsland[];

  onBack: () => void;
}


export default function EmployeeDetailHeader({
  employee,
  history,
  lockers,
  onBack,
}: EmployeeDetailHeaderProps) {
  return (
    <header className="employee-detail-header">
      <div className="employee-detail-header__content">
        <button
          type="button"
          className="employee-detail-header__back"
          onClick={
            onBack
          }
        >
          <ArrowLeft
            size={15}
            strokeWidth={2}
          />

          <span>
            Empleados
          </span>
        </button>

        <div className="employee-detail-header__identity">
          <div>
            <div className="employee-detail-header__name-row">
              <h1>
                {employee.name}
              </h1>

              <span
                className={`
                  employee-detail-header__status

                  ${
                    employee.active
                      ? "employee-detail-header__status--active"
                      : ""
                  }
                `}
              >
                <span />

                {employee.active
                  ? "Activo"
                  : "Inactivo"}
              </span>
            </div>

            <p>
              {employee.employeeNumber}
              {" · "}
              {employee.badgeNumber}
            </p>
          </div>
        </div>
      </div>

      <EmployeeHistoryExportButton
        employee={
          employee
        }
        events={
          history
        }
        lockers={
          lockers
        }
        mode="ALL"
        label="Exportar historial"
      />
    </header>
  );
}