// src/services/olc-tickets.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";
import type {
  OLCTicketsListResponse,
  OLCTicketDetailResponse,
  OLCTicketDetailWithMessagesResponse,
  OLCTicketsQueryParams,
  UpdateOLCTicketPayload,
} from "@/types/olc-tickets.types";

export const olcTicketsService = {
  /**
   * Get list of OLC tickets with pagination
   * @param params - Query parameters (limit, offset, search, status, priority, category)
   */
  async getTickets(params?: OLCTicketsQueryParams) {
    const queryParams = new URLSearchParams();

    // Set default pagination
    queryParams.append("limit", String(params?.limit || 20));
    queryParams.append("offset", String(params?.offset || 0));

    // Add optional filters
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.priority) queryParams.append("priority", params.priority);
    if (params?.category) queryParams.append("category", params.category);

    const response = await fetchClient(
      `/v2/server/support/olc?${queryParams.toString()}`
    );

    return handleResponse(response);
  },

  /**
   * Get a specific OLC ticket by ID
   * @param id_olc_ticket - ID of the OLC ticket
   */
  async getTicket(id_olc_ticket: number | string) {
    const response = await fetchClient(
      `/v2/server/support/olc/${id_olc_ticket}`
    );

    return handleResponse(response);
  },

  /**
   * Get OLC ticket with messages
   * @param id_olc_ticket - ID of the OLC ticket
   */
  async getTicketWithMessages(id_olc_ticket: number | string) {
    const response = await fetchClient(
      `/v2/server/support/olc/${id_olc_ticket}/messages`
    );

    return handleResponse(response);
  },

  /**
   * Send a message to an OLC ticket
   * @param id_olc_ticket - ID of the OLC ticket
   * @param message - The message content
   */
  async sendMessage(id_olc_ticket: number | string, message: string) {
    const response = await fetchClient(
      `/v2/server/support/olc/${id_olc_ticket}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ data: { message } }),
      }
    );

    return handleResponse(response);
  },

  /**
   * Generic V3 ticket update.
   *
   * PUT /v3/server/support/olc/{id}
   * Authorization: Bearer <token>
   */
  async updateTicket(
    id_olc_ticket: number | string,
    data: UpdateOLCTicketPayload
  ) {
    const token = localStorage.getItem("token");

    const response = await fetchClient(
      `/v3/server/support/olc/${id_olc_ticket}`,
      {
        method: "PUT",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : undefined,
        body: JSON.stringify({ data }),
      }
    );

    return handleResponse(response);
  },

  /**
   * Update OLC ticket status through V3.
   */
  async updateTicketStatus(
    id_olc_ticket: number | string,
    id_status: number
  ) {
    return this.updateTicket(id_olc_ticket, { id_status });
  },

  /**
   * Update OLC ticket priority through V3.
   */
  async updateTicketPriority(
    id_olc_ticket: number | string,
    id_type_priority: number
  ) {
    return this.updateTicket(id_olc_ticket, { id_type_priority });
  },

  /**
   * Assign OLC ticket to a user through V3.
   */
  async assignTicket(
    id_olc_ticket: number | string,
    id_olc_user: number
  ) {
    return this.updateTicket(id_olc_ticket, { id_olc_user });
  },

  /**
   * Resolve OLC ticket through V3.
   */
  async resolveTicket(id_olc_ticket: number | string) {
    return this.updateTicket(id_olc_ticket, { id_status: 169 });
  },
};
