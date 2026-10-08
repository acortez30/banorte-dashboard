import {
  useMemo,
} from "react";

import {
  ArrowLeft,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";

import EmployeeDetailHeader from "@/components/employees/detail/EmployeeDetailHeader";
import EmployeeDetailSummary from "@/components/employees/detail/EmployeeDetailSummary";
import EmployeeAccessTabs from "@/components/employees/detail/EmployeeAccessTabs";

import {
  useData,
} from "@/contexts/DataContext";

import {
  getEmployeeAccessHistory,
} from "@/utils/attendance";

import "@/styles/employees/detail/EmployeeDetail.css";


export default function EmployeeDetail() {
  const {
    employeeId,
  } = useParams<{
    employeeId: string;
  }>();

  const navigate =
    useNavigate();

  const {
    employees,
    lockers,
  } = useData();


  /* =======================================================
     EMPLOYEE
     ======================================================= */

  const employee =
    useMemo(
      () =>
        employees.find(
          (item) =>
            item.id ===
            employeeId,
        ),
      [
        employeeId,
        employees,
      ],
    );


  /* =======================================================
     HISTORY
     ======================================================= */

  const history =
    useMemo(
      () =>
        employee
          ? getEmployeeAccessHistory(
              employee,
              employees,
              365,
            )
          : [],
      [
        employee,
        employees,
      ],
    );


  /* =======================================================
     ENTRIES / EXITS
     ======================================================= */

  const entries =
    useMemo(
      () =>
        history.filter(
          (event) =>
            event.type ===
            "ENTRY",
        ),
      [
        history,
      ],
    );

  const exits =
    useMemo(
      () =>
        history.filter(
          (event) =>
            event.type ===
            "EXIT",
        ),
      [
        history,
      ],
    );


  /* =======================================================
     LAST ACCESS

     El compartimento NO pertenece al empleado.
     Pertenece a cada evento de acceso.
     ======================================================= */

  const lastAccess =
    useMemo(
      () => {
        if (
          history.length ===
          0
        ) {
          return undefined;
        }

        return [...history].sort(
          (
            first,
            second,
          ) =>
            new Date(
              second.occurredAt,
            ).getTime() -
            new Date(
              first.occurredAt,
            ).getTime(),
        )[0];
      },
      [
        history,
      ],
    );


  /* =======================================================
     FIXED LOCKER / ISLAND

     La isla SÍ permanece asignada al empleado.
     ======================================================= */

  const locker =
    useMemo(
      () =>
        employee
          ? lockers.find(
              (item) =>
                item.id ===
                employee.lockerId,
            )
          : undefined,
      [
        employee,
        lockers,
      ],
    );


  /* =======================================================
     NOT FOUND
     ======================================================= */

  if (!employee) {
    return (
      <DashboardLayout>
        <main className="employee-detail-page">
          <section className="employee-detail-page__not-found">
            <div className="employee-detail-page__not-found-icon">
              <UserRound
                size={24}
                strokeWidth={1.9}
              />
            </div>

            <strong>
              Empleado no encontrado
            </strong>

            <p>
              El empleado solicitado no existe o ya no está disponible.
            </p>

            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => {
                navigate(
                  "/employees",
                );
              }}
            >
              Volver a empleados
            </Button>
          </section>
        </main>
      </DashboardLayout>
    );
  }


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout>
      <main className="employee-detail-page">
        <div className="employee-detail-page__container">
          <EmployeeDetailHeader
            employee={
              employee
            }
            history={
              history
            }
            lockers={
              lockers
            }
            onBack={() => {
              navigate(
                "/employees",
              );
            }}
          />

          <EmployeeDetailSummary
            employee={
              employee
            }
            locker={
              locker
            }
            entryCount={
              entries.length
            }
            exitCount={
              exits.length
            }
            lastAccess={
              lastAccess
            }
          />

          <EmployeeAccessTabs
            employee={
              employee
            }
            entries={
              entries
            }
            exits={
              exits
            }
            lockers={
              lockers
            }
          />
        </div>
      </main>
    </DashboardLayout>
  );
}