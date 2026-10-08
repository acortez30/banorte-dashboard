export interface Message {
  id: string;
  author: string;
  role: "agent" | "system" | "client";
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  assignee: string;
  lockerRef: string;
  orderRef: string;
  createdDate: string;
  lastUpdate: string;
  description: string;
  messages: Message[];
}

export const ticketsDB: Record<string, Ticket> = {
  "TK-001": {
    id: "TK-001",
    title: "Puerta A3 no abre correctamente",
    category: "maintenance",
    status: "open",
    priority: "high",
    assignee: "Carlos M.",
    lockerRef: "Locker Centro",
    orderRef: "PKG-2024-001",
    createdDate: "21 Feb 2026",
    lastUpdate: "21 Feb 2026",
    description:
      "La puerta A3 del Locker Centro no responde al comando de apertura. El sensor de cierre parece estar desalineado.",
    messages: [
      {
        id: "m1",
        author: "Sistema",
        role: "system",
        content: "Ticket creado y asignado a Carlos M.",
        timestamp: "21 Feb 2026, 08:30",
      },
      {
        id: "m2",
        author: "María García",
        role: "client",
        content:
          "La puerta no abrió cuando intenté recoger mi paquete. La pantalla mostró un error.",
        timestamp: "21 Feb 2026, 08:32",
      },
      {
        id: "m3",
        author: "Carlos M.",
        role: "agent",
        content:
          "Gracias por reportar. Revisaré el sensor de la puerta A3 hoy.",
        timestamp: "21 Feb 2026, 09:15",
      },
    ],
  },

  "TK-002": {
    id: "TK-002",
    title: "Error en pantalla táctil",
    category: "technical",
    status: "in_progress",
    priority: "critical",
    assignee: "Ana R.",
    lockerRef: "Locker Norte",
    orderRef: "-",
    createdDate: "20 Feb 2026",
    lastUpdate: "21 Feb 2026",
    description:
      "La pantalla táctil no responde en la esquina inferior derecha.",
    messages: [
      {
        id: "m1",
        author: "Sistema",
        role: "system",
        content: "Ticket creado y asignado a Ana R.",
        timestamp: "20 Feb 2026, 14:00",
      },
      {
        id: "m2",
        author: "Operador Norte",
        role: "client",
        content:
          "No se puede ingresar código en la esquina inferior.",
        timestamp: "20 Feb 2026, 14:05",
      },
    ],
  },

  "TK-003": {
    id: "TK-003",
    title: "Problema de acceso con QR",
    category: "access",
    status: "open",
    priority: "medium",
    assignee: "Pedro L.",
    lockerRef: "Locker Sur",
    orderRef: "PKG-2024-003",
    createdDate: "19 Feb 2026",
    lastUpdate: "20 Feb 2026",
    description: "El código QR no es reconocido por el lector.",
    messages: [
      {
        id: "m1",
        author: "Sistema",
        role: "system",
        content: "Ticket creado y asignado a Pedro L.",
        timestamp: "19 Feb 2026, 11:00",
      },
    ],
  },

  "TK-004": {
    id: "TK-004",
    title: "Mantenimiento preventivo",
    category: "maintenance",
    status: "resolved",
    priority: "low",
    assignee: "María G.",
    lockerRef: "Locker Este",
    orderRef: "-",
    createdDate: "18 Feb 2026",
    lastUpdate: "20 Feb 2026",
    description: "Revisión general de puertas y sensores.",
    messages: [
      {
        id: "m1",
        author: "Sistema",
        role: "system",
        content: "Ticket creado y asignado a María G.",
        timestamp: "18 Feb 2026, 09:00",
      },
    ],
  },

  "TK-005": {
    id: "TK-005",
    title: "Cobro duplicado",
    category: "billing",
    status: "closed",
    priority: "medium",
    assignee: "Roberto S.",
    lockerRef: "-",
    orderRef: "PKG-2024-005",
    createdDate: "17 Feb 2026",
    lastUpdate: "19 Feb 2026",
    description: "Cobro duplicado del servicio mensual.",
    messages: [
      {
        id: "m1",
        author: "Sistema",
        role: "system",
        content: "Ticket creado y asignado a Roberto S.",
        timestamp: "17 Feb 2026, 10:00",
      },
    ],
  },
};