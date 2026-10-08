// hooks/useOfferings.ts
// Lee el offerings_menu guardado en AuthContext al hacer login.
// Agrupa por id_offering para mostrar una tarjeta por servicio único.

import { useMemo } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES — espejo exacto del response del backend
// ─────────────────────────────────────────────────────────────

export interface OfferingOperation {
  id_offering: number;
  offering_title: string;
  offering_description: string;
  offering_icon: string;        // "send" | "swap" | "undo" | "waa" | etc.
  offering_order: number;
  id_offering_operation: number;
  operation_name: string;
  operation_description: string;
  operation_icon: string;       // "dropoff" | "pickup" | "return" | "delivery-storage" | "exchange"
  has_cost: number;
  operation_order: number;
  id_propierty: number;
  cost_type: string;
}

export interface Offering {
  id_offering: number;
  title: string;
  description: string;
  icon: string;
  order: number;
  operations: OfferingOperation[];
}

// ─────────────────────────────────────────────────────────────
// ICON MAP — operation_icon del backend → filterId para la tabla
// Ajusta según los valores reales que devuelva tu backend
// ─────────────────────────────────────────────────────────────

export const OPERATION_ICON_TO_FILTER: Record<string, string> = {
  "dropoff":          "locker-a-locker",
  "pickup":           "locker-a-direccion",
  "delivery-storage": "almacenamiento",
  "return":           "devoluciones",
  "exchange":         "intercambio",
};

// ─────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────

export function useOfferings() {
  const offerings = useMemo<Offering[]>(() => {
    try {
      const raw = localStorage.getItem("offerings_menu");
      if (!raw) return [];

      const list: OfferingOperation[] = JSON.parse(raw);
      if (!Array.isArray(list) || list.length === 0) return [];

      // Agrupar por id_offering — una tarjeta por offering único
      const map = new Map<number, Offering>();

      for (const item of list) {
        if (!map.has(item.id_offering)) {
          map.set(item.id_offering, {
            id_offering:  item.id_offering,
            title:        item.offering_title,
            description:  item.offering_description,
            icon:         item.offering_icon,
            order:        item.offering_order,
            operations:   [],
          });
        }
        map.get(item.id_offering)!.operations.push(item);
      }

      // Ordenar por offering_order
      return Array.from(map.values()).sort((a, b) => a.order - b.order);
    } catch {
      return [];
    }
  }, []); // se recalcula solo si cambia localStorage — al login siempre es nuevo montaje

  const hasOfferings = offerings.length > 0;

  // Todos los operation_icons aplanados → para filtrar la tabla
  const allFilterIds = useMemo(() => {
    return offerings.flatMap((o) =>
      o.operations.map((op) => OPERATION_ICON_TO_FILTER[op.operation_icon] ?? op.operation_icon)
    );
  }, [offerings]);

  return { offerings, hasOfferings, allFilterIds };
}
