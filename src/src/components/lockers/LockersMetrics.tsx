import {
  Boxes,
  CircleGauge,
  DoorOpen,
  Info,
  UsersRound,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import "@/styles/lockers/LockersMetrics.css";


interface LockersMetricsProps {
  activeLockers: number;
  registeredLockers: number;
  totalCompartments: number;
  assignedEmployees: number;
  availableCapacity: number;
}

interface MetricProps {
  label: string;
  value: string | number;

  helper: string;

  tooltip: string;

  icon: LucideIcon;

  tone?:
    | "default"
    | "success"
    | "primary";
}


function LockerMetric({
  label,
  value,

  helper,

  tooltip,

  icon: Icon,

  tone = "default",
}: MetricProps) {
  return (
    <article
      className={`
        lockers-metric
        lockers-metric--${tone}
      `}
    >
      <div className="lockers-metric__header">
        <div className="lockers-metric__label">
          <span>
            {label}
          </span>

          <div className="lockers-metric__tooltip">
            <button
              type="button"
              className="lockers-metric__info"
              aria-label={`Información sobre ${label}`}
            >
              <Info
                size={13}
                strokeWidth={2}
              />
            </button>

            <div
              className="lockers-metric__tooltip-content"
              role="tooltip"
            >
              {tooltip}
            </div>
          </div>
        </div>

        <div className="lockers-metric__icon">
          <Icon
            size={18}
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="lockers-metric__body">
        <strong className="lockers-metric__value">
          {value}
        </strong>

        <span className="lockers-metric__helper">
          {helper}
        </span>
      </div>
    </article>
  );
}


export default function LockersMetrics({
  activeLockers,
  registeredLockers,

  totalCompartments,

  assignedEmployees,

  availableCapacity,
}: LockersMetricsProps) {
  return (
    <section className="lockers-metrics">
      <LockerMetric
        label="Islas activas"
        value={
          activeLockers
        }
        helper={`${registeredLockers} registradas`}
        tooltip="Número de islas que actualmente están habilitadas para recibir asignaciones de empleados."
        icon={
          Boxes
        }
        tone="primary"
      />

      <LockerMetric
        label="Compartimentos"
        value={
          totalCompartments.toLocaleString(
            "es-MX",
          )
        }
        helper="133 por cada isla"
        tooltip="Capacidad total disponible considerando únicamente las islas activas. Cada isla Banorte cuenta con 133 compartimentos."
        icon={
          DoorOpen
        }
      />

      <LockerMetric
        label="Empleados asignados"
        value={
          assignedEmployees.toLocaleString(
            "es-MX",
          )
        }
        helper="Asignados a islas activas"
        tooltip="Cantidad de empleados que actualmente tienen una isla asignada dentro de las islas activas."
        icon={
          UsersRound
        }
      />

      <LockerMetric
        label="Capacidad disponible"
        value={
          availableCapacity.toLocaleString(
            "es-MX",
          )
        }
        helper="Espacios sin asignar"
        tooltip="Número de asignaciones que todavía pueden realizarse antes de alcanzar la capacidad total de las islas activas."
        icon={
          CircleGauge
        }
        tone="success"
      />
    </section>
  );
}