import {
  AlertTriangle,
  Boxes,
  Check,
  FilterX,
  UsersRound,
} from "lucide-react";

import {
  COMPARTMENTS_PER_LOCKER,
} from "@/data/mockData";

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
  selectedLockerId: string;
  onSelectLocker: (
    lockerId: string,
  ) => void;
}

function getOccupancyStatus(
  percentage: number,
) {
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
  selectedLockerId,
  onSelectLocker,
}: EmployeesDistributionProps) {
  const minimumLoad =
    loads.length > 0
      ? Math.min(
          ...loads.map(
            (load) => load.assigned,
          ),
        )
      : 0;

  const selectedLoad =
    selectedLockerId === "ALL"
      ? undefined
      : loads.find(
          ({ locker }) =>
            locker.id === selectedLockerId,
        );

  return (
    <section className="employees-distribution">
      <div className="employees-distribution__header">
        <div className="employees-distribution__heading">
          <div>
            <h2 className="employees-distribution__title">
              Distribución por isla
            </h2>

            <p className="employees-distribution__description">
              Selecciona una isla para filtrar la tabla de empleados.
            </p>
          </div>

          <div className="employees-distribution__capacity">
            <Boxes
              size={14}
              strokeWidth={2}
            />

            <span>
              {COMPARTMENTS_PER_LOCKER} compartimentos por isla
            </span>
          </div>
        </div>

        <div className="employees-distribution__header-actions">
          {selectedLoad ? (
            <div className="employees-distribution__active-filter">
              <span>
                Filtrando por
              </span>

              <strong>
                {selectedLoad.locker.alias}
              </strong>

              <button
                type="button"
                onClick={() => {
                  onSelectLocker("ALL");
                }}
                aria-label="Mostrar todas las islas"
                title="Mostrar todas las islas"
              >
                <FilterX
                  size={14}
                  strokeWidth={2}
                />
              </button>
            </div>
          ) : null}

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
      </div>

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
                COMPARTMENTS_PER_LOCKER
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

          const isSelected =
            selectedLockerId === locker.id;

          return (
            <button
              key={locker.id}
              type="button"
              className={`
                employees-distribution__card
                ${
                  isLowestLoad
                    ? "employees-distribution__card--priority"
                    : ""
                }
                ${
                  isSelected
                    ? "employees-distribution__card--selected"
                    : ""
                }
              `}
              onClick={() => {
                onSelectLocker(
                  isSelected
                    ? "ALL"
                    : locker.id,
                );
              }}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? "Quitar filtro de" : "Filtrar por"} ${locker.alias}`}
            >
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

                    {isSelected ? (
                      <span className="employees-distribution__selected-label">
                        <Check
                          size={11}
                          strokeWidth={2.4}
                        />
                        Seleccionada
                      </span>
                    ) : isLowestLoad ? (
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
                  de {COMPARTMENTS_PER_LOCKER}
                </span>
              </div>

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

              <div className="employees-distribution__footer">
                <span>
                  Espacios disponibles
                </span>

                <strong>
                  {available}
                </strong>
              </div>
            </button>
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
                Da de alta una isla para comenzar a distribuir empleados.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
