// 🎫 OLC Ticket Types

// API Response Interfaces
export interface OLCApiTicket {
  id_olc_ticket: number;
  ticket_code: string;
  title: string;
  description?: string;
  sla_at_risk: number;
  resolved_at: string | null;
  registration_date: string;
  update_date: string;
  id_status: number;
  nombre_status: string;
  status_description?: string;
  id_type_priority: number;
  priority_name: string;
  id_olc_ticket_category: number;
  category_name: string;
  id_olc_ticket_origin: number;
  origin_name: string;
  id_olc_user: number;
  assigned_user_name: string;
  assigned_user_email?: string;
  id_hub_local: number;
  hub_name: string;
  hub_code: string;
  id_access_point: number | null;
  access_point_name: string | null;
  messages_count?: number; // 👈 NUEVO: opcional para no romper si el backend aún no lo devuelve

}

export interface OLCTicketMessage {
  id_olc_ticket_message: number;
  message: string;
  sent_at: string;
  registration_date: string;
  id_user: number;
  sender_name: string;
  sender_email: string;
  id_user_type: number;
  sender_type: string;
}

export interface OLCTicketDetail extends OLCApiTicket {
  messages?: OLCTicketMessage[];
}

// List API Response
export interface OLCTicketsListResponse {
  mensaje_return: {
    ERROR: boolean;
    ERROR_MENSAGGE: string;
    CODE: number;
  };
  summary: {
    total_active: number;
    in_progress: number;
    sla_at_risk: number;
    waiting: number;
    resolved_this_month: number;
    avg_resolution_hours: number | null;
  };
  total: number;
  tickets: OLCApiTicket[];
}

// Detail API Response
export interface OLCTicketDetailResponse {
  mensaje_return: {
    ERROR: boolean;
    ERROR_MENSAGGE: string;
    CODE: number;
  };
  ticket: OLCTicketDetail;
  messages?: OLCTicketMessage[];
}

// Detail with messages API Response
export interface OLCTicketDetailWithMessagesResponse {
  mensaje_return: {
    ERROR: boolean;
    ERROR_MENSAGGE: string;
    CODE: number;
  };
  ticket: OLCTicketDetail;
  messages: OLCTicketMessage[];
}

// Transformed interfaces for UI
export interface OLCTicket {
  id: string;
  id_olc_ticket: number;
  code: string;
  title: string;
  description?: string;
  category: string;
  status: OLCTicketStatus;
  statusName: string;
  priority: OLCTicketPriority;
  priorityName: string;
  origin: string;
  assignee: string;
  assigneeEmail?: string;
  hub: string;
  hubCode: string;
  createdDate: string;
  updatedDate: string;
  resolvedDate: string | null;
  slaAtRisk: boolean;
  rawData?: OLCApiTicket;
  messagesCount: number; // 👈 NUEVO: siempre presente, default 0

}

// Status enums for OLC
export type OLCTicketStatus = "open" | "in_progress" | "resolved" | "closed";

// Priority levels
export type OLCTicketPriority = "low" | "medium" | "high" | "critical";

// KPIs for OLC tickets
export interface OLCTicketKPIs {
  totalActive: number;
  inProgress: number;
  slaAtRisk: number;
  waiting: number;
  resolvedThisMonth: number;
  avgResolutionHours: number | null;
}

// Query params for list endpoint
export interface OLCTicketsQueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
}


// V3 - Update ticket payload
export interface UpdateOLCTicketPayload {
  id_status?: number;
  id_type_priority?: number;
  id_olc_ticket_category?: number;
  id_olc_user?: number;
  id_hub_local?: number;
  id_access_point?: number | null;
  title?: string;
  description?: string;
  sla_at_risk?: boolean;
}
