import {
  BadgeCheck,
  Boxes,
  Clock3,
  DoorOpen,
  Hash,
  LogIn,
  LogOut,
  Phone,
} from "lucide-react";

import type {
  Employee,
  EmployeeAccessEvent,
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/employees/detail/EmployeeDetailSummary.css";


interface EmployeeDetailSummaryProps {
  employee: Employee;

  locker?: LockerIsland;

  entryCount: number;

  exitCount: number;

  lastAccess?: EmployeeAccessEvent;
}


const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  );


function getInitials(
  value: string,
) {
  return value
    .trim()
    .split(/\s+/)
    .slice(
      0,
      2,
    )
    .map(
      (item) =>
        item[0]?.toUpperCase() ??
        "",
    )
    .join("");
}


export default function EmployeeDetailSummary({
  employee,
  locker,

  entryCount,
  exitCount,

  lastAccess,
}: EmployeeDetailSummaryProps) {
  return (
    <section className="employee-detail-summary">
      {/* ===================================================
          PROFILE
          =================================================== */}
      <div className="employee-detail-summary__profile">
        <div className="employee-detail-summary__profile-top">
          <div className="employee-detail-summary__avatar">
            {getInitials(
              employee.name,
            )}
          </div>

          <div>
            <span className="employee-detail-summary__profile-label">
              Empleado Banorte
            </span>

            <strong className="employee-detail-summary__profile-name">
              {employee.name}
            </strong>

            <span className="employee-detail-summary__profile-number">
              {employee.employeeNumber}
            </span>
          </div>
        </div>


        {/* =================================================
            FIXED ISLAND
            ================================================= */}
        <div className="employee-detail-summary__assignment">
          <span className="employee-detail-summary__assignment-label">
            Isla asignada
          </span>

          <div className="employee-detail-summary__island">
            <div className="employee-detail-summary__island-icon">
              <Boxes
                size={17}
                strokeWidth={2}
              />
            </div>

            <div>
              <strong>
                {locker?.alias ??
                  "Sin isla"}
              </strong>

              <span>
                Asignación permanente del empleado
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* ===================================================
          CONTENT
          =================================================== */}
      <div className="employee-detail-summary__content">
        {/* =================================================
            EMPLOYEE DATA
            ================================================= */}
        <div className="employee-detail-summary__info-grid">
          <article className="employee-detail-summary__info">
            <Phone
              size={15}
            />

            <div>
              <span>
                Teléfono
              </span>

              <strong>
                {employee.phone}
              </strong>
            </div>
          </article>

          <article className="employee-detail-summary__info">
            <Hash
              size={15}
            />

            <div>
              <span>
                Número de empleado
              </span>

              <strong>
                {employee.employeeNumber}
              </strong>
            </div>
          </article>

          <article className="employee-detail-summary__info">
            <BadgeCheck
              size={15}
            />

            <div>
              <span>
                Número de gafete
              </span>

              <strong>
                {employee.badgeNumber}
              </strong>
            </div>
          </article>
        </div>


        {/* =================================================
            ACCESS ACTIVITY
            ================================================= */}
        <div className="employee-detail-summary__activity">
          <article>
            <div className="employee-detail-summary__activity-icon employee-detail-summary__activity-icon--entry">
              <LogIn
                size={16}
              />
            </div>

            <div>
              <span>
                Entradas
              </span>

              <strong>
                {entryCount}
              </strong>
            </div>
          </article>


          <article>
            <div className="employee-detail-summary__activity-icon employee-detail-summary__activity-icon--exit">
              <LogOut
                size={16}
              />
            </div>

            <div>
              <span>
                Salidas
              </span>

              <strong>
                {exitCount}
              </strong>
            </div>
          </article>


          {/* ===============================================
              LAST ACCESS
              =============================================== */}
          <article>
            <div className="employee-detail-summary__activity-icon">
              <Clock3
                size={16}
              />
            </div>

            <div>
              <span>
                Último acceso
              </span>

              <strong>
                {lastAccess
                  ? dateTimeFormatter.format(
                      new Date(
                        lastAccess.occurredAt,
                      ),
                    )
                  : "Sin registros"}
              </strong>
            </div>
          </article>


          {/* ===============================================
              DYNAMIC COMPARTMENT
              =============================================== */}
          <article>
            <div className="employee-detail-summary__activity-icon">
              <DoorOpen
                size={16}
              />
            </div>

            <div>
              <span>
                Último compartimento usado
              </span>

              <strong>
                {lastAccess
                  ? `#${String(
                      lastAccess.compartmentNumber,
                    ).padStart(
                      3,
                      "0",
                    )}`
                  : "—"}
              </strong>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}