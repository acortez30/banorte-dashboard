// 🎫 Ticket base
export interface Ticket {
  id: string;

  title: string;
  description?: string;

  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;

  assignee?: string;

  lockerRef?: string;
  orderRef?: string;

  createdDate: string;
  lastUpdate: string;

  commentsCount: number;
}

// 📂 Categorías
export type TicketCategory =
  | "maintenance"
  | "technical"
  | "access"
  | "billing"
  | "other";

// 📊 Status
export type TicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

// ⚡ Prioridad
export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

// 💬 Comentarios (para detalle)
export interface TicketComment {
  id: string;
  ticketId: string;

  message: string;

  author: string;
  createdAt: string;

  isInternal?: boolean; // 👈 para soporte interno
}

// 📎 Adjuntos (futuro 🔥)
export interface TicketAttachment {
  id: string;
  ticketId: string;

  fileName: string;
  fileUrl: string;
  fileType?: string;

  uploadedAt: string;
}

// 📊 KPIs (para dashboard)
export interface TicketKPIs {
  open: number;
  inProgress: number;
  resolved: number;
  total: number;
}

// 🔍 Filtros (para API / query params)
export interface TicketFilters {
  search?: string;
  status?: TicketStatus | "all";
  category?: TicketCategory | "all";
  priority?: TicketPriority | "all";
}

// 📦 Response de API (futuro)
export interface TicketsResponse {
  data: Ticket[];
  total: number;
  page: number;
  limit: number;
}