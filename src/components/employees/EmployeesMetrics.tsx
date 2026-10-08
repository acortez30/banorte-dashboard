import {
  Boxes,
  CircleGauge,
  Scale,
  UsersRound,
} from "lucide-react";

import MetricCard from "@/components/common/MetricCard";
import "@/styles/employees/EmployeesMetrics.css";

interface EmployeesMetricsProps {
  totalEmployees: number;
  activeEmployees: number;

  activeLockerCount: number;
  totalCapacity: number;

  availableCapacity: number;
  assignedEmployees: number;

  balanced: boolean;
  minLoad: number;
  maxLoad: number;

  hasCapacity: boolean;
}

export default function EmployeesMetrics({
  totalEmployees,
  activeEmployees,
  activeLockerCount,
  totalCapacity,
  availableCapacity,
  assignedEmployees,
  balanced,
  minLoad,
  maxLoad,
  hasCapacity,
}: EmployeesMetricsProps) {
  const activePercentage =
    totalEmployees > 0
      ? Math.round(
          (
            activeEmployees /
            totalEmployees
          ) * 100,
        )
      : 0;

  const availablePercentage =
    totalCapacity > 0
      ? Math.round(
          (
            availableCapacity /
            totalCapacity
          ) * 100,
        )
      : 0;

  const balanceDifference =
    maxLoad - minLoad;

  return (
    <section className="employees-metrics">
      {/* ===================================================
          EMPLOYEES
          =================================================== */}
      <MetricCard
        label="Empleados"
        value={
          totalEmployees.toLocaleString(
            "es-MX",
          )
        }
        helper={`${activeEmployees.toLocaleString(
          "es-MX",
        )} empleados con acceso activo`}
        description="Total de empleados registrados en el sistema, incluyendo empleados con acceso activo e inactivo."
        icon={UsersRound}
        tone="brand"
        metaLabel="Acceso habilitado"
        metaValue={`${activePercentage}%`}
      />

      {/* ===================================================
          LOCKERS
          =================================================== */}
      <MetricCard
        label="Islas activas"
        value={
          activeLockerCount.toLocaleString(
            "es-MX",
          )
        }
        helper={`${totalCapacity.toLocaleString(
          "es-MX",
        )} compartimentos en operación`}
        description="Número de islas disponibles para asignar empleados. Cada isla Banorte dispone de 110 compartimentos."
        icon={Boxes}
        tone="neutral"
        metaLabel="Capacidad por isla"
        metaValue="110"
      />

      {/* ===================================================
          AVAILABLE CAPACITY
          =================================================== */}
      <MetricCard
        label="Capacidad disponible"
        value={
          availableCapacity.toLocaleString(
            "es-MX",
          )
        }
        helper={`${assignedEmployees.toLocaleString(
          "es-MX",
        )} espacios actualmente asignados`}
        description="Cantidad de compartimentos que todavía pueden recibir empleados considerando únicamente las islas activas."
        icon={CircleGauge}
        tone={
          hasCapacity
            ? "success"
            : "danger"
        }
        metaLabel="Capacidad libre"
        metaValue={`${availablePercentage}%`}
      />

      {/* ===================================================
          BALANCE
          =================================================== */}
      <MetricCard
        label="Balance de asignación"
        value={
          balanced
            ? "Balanceado"
            : "Desbalanceado"
        }
        helper={
          balanced
            ? `Entre ${minLoad} y ${maxLoad} empleados por isla`
            : `Carga entre ${minLoad} y ${maxLoad} empleados por isla`
        }
        description="Mide la diferencia de empleados entre la isla con menor carga y la isla con mayor carga. El objetivo es mantener una diferencia máxima de un empleado."
        icon={Scale}
        tone={
          balanced
            ? "success"
            : "warning"
        }
        metaLabel="Diferencia máxima"
        metaValue={`${balanceDifference} ${
          balanceDifference === 1
            ? "empleado"
            : "empleados"
        }`}
      />
    </section>
  );
}