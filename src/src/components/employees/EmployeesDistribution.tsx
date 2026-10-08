import {
  AlertTriangle,
  Boxes,
  UsersRound,
} from "lucide-react";
import "@/styles/employees/EmployeesDistribution.css";

interface LockerLoadItem {
  locker: {
    id: string;
    alias: string;
  };

  assigned: number;
  available: number;
}

interface EmployeesDistributionProps {
  loads: LockerLoadItem[];
  additionalRequired: number;
}

const LOCKER_CAPACITY = 113;

function getOccupancyStatus(percentage: number) {
  if (percentage >= 100) {
    return {
      label: "Sin capacidad",
      tone: "danger",
    };
  }

  if (percentage >= 85) {
    return {
      label: "Alta ocupación",
      tone: "warning",
    };
  }

  return {
    label: "Disponible",
    tone: "available",
  };
}

export default function EmployeesDistribution({
  loads,
  additionalRequired,
}: EmployeesDistributionProps) {
  const minimumLoad =
    loads.length > 0
      ? Math.min(
          ...loads.map(
            (load) => load.assigned,
          ),
        )
      : 0;

  return (
    <section className="employees-distribution">
      {/* ===================================================
          HEADER
          =================================================== */}
      <div className="employees-distribution__header">
        <div className="employees-distribution__heading">
          <div>
            <h2 className="employees-distribution__title">
              Distribución por isla
            </h2>

            <p className="employees-distribution__description">
              Visualiza la carga de empleados y la capacidad
              disponible en cada isla.
            </p>
          </div>

          <div className="employees-distribution__capacity">
            <Boxes
              size={14}
              strokeWidth={2}
            />

            <span>
              133 compartimentos por isla
            </span>
          </div>
        </div>

        {additionalRequired > 0 ? (
          <div className="employees-distribution__warning">
            <AlertTriangle
              size={16}
              strokeWidth={2}
            />

            <span>
              Capacidad insuficiente. Se requieren{" "}
              <strong>
                {additionalRequired}
              </strong>{" "}
              isla
              {additionalRequired === 1
                ? ""
                : "s"}{" "}
              adicional
              {additionalRequired === 1
                ? ""
                : "es"}
              .
            </span>
          </div>
        ) : null}
      </div>

      {/* ===================================================
          LOCKERS
          =================================================== */}
      <div className="employees-distribution__grid">
        {loads.map(({
          locker,
          assigned,
          available,
        }) => {
          const percentage = Math.min(
            100,
            Math.round(
              (
                assigned /
                LOCKER_CAPACITY
              ) * 100,
            ),
          );

          const status =
            getOccupancyStatus(
              percentage,
            );

          const isLowestLoad =
            assigned === minimumLoad &&
            available > 0;

          return (
            <article
              key={locker.id}
              className={`
                employees-distribution__card
                ${
                  isLowestLoad
                    ? "employees-distribution__card--priority"
                    : ""
                }
              `}
            >
              {/* CARD HEADER */}
              <div className="employees-distribution__card-header">
                <div className="employees-distribution__locker">
                  <div className="employees-distribution__locker-icon">
                    <Boxes
                      size={16}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="employees-distribution__locker-info">
                    <strong className="employees-distribution__locker-name">
                      {locker.alias}
                    </strong>

                    {isLowestLoad ? (
                      <span className="employees-distribution__priority">
                        Menor carga
                      </span>
                    ) : null}
                  </div>
                </div>

                <span
                  className={`
                    employees-distribution__status
                    employees-distribution__status--${status.tone}
                  `}
                >
                  {status.label}
                </span>
              </div>

              {/* MAIN VALUE */}
              <div className="employees-distribution__main">
                <div className="employees-distribution__assigned">
                  <UsersRound
                    size={15}
                    strokeWidth={2}
                  />

                  <span>
                    <strong>
                      {assigned}
                    </strong>

                    {" "}empleado
                    {assigned === 1
                      ? ""
                      : "s"}
                  </span>
                </div>

                <span className="employees-distribution__capacity-count">
                  de {LOCKER_CAPACITY}
                </span>
              </div>

              {/* OCCUPANCY */}
              <div className="employees-distribution__occupancy">
                <div className="employees-distribution__occupancy-header">
                  <span>
                    Ocupación
                  </span>

                  <strong>
                    {percentage}%
                  </strong>
                </div>

                <div className="employees-distribution__progress">
                  <div
                    className={`
                      employees-distribution__progress-value
                      employees-distribution__progress-value--${status.tone}
                    `}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="employees-distribution__footer">
                <span>
                  Espacios disponibles
                </span>

                <strong>
                  {available}
                </strong>
              </div>
            </article>
          );
        })}

        {!loads.length ? (
          <div className="employees-distribution__empty">
            <Boxes
              size={24}
              strokeWidth={1.8}
            />

            <div>
              <strong>
                No hay islas activas
              </strong>

              <p>
                Da de alta una isla para comenzar a
                distribuir empleados.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}