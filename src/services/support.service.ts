// src/services/support.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

/* ============================== */
/* ====== SUPPORT SERVICE ======= */
/* ============================== */

export const supportService = {

  /**
   * Obtener lista de tickets con filtros opcionales
   * @param params - Filtros opcionales (status, priority, etc.)
   */
  async getTickets(params?: Record<string, any>) {
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/v2/server/support${query}`
    );

    return handleResponse(response);
  },

  /**
   * Obtener un ticket específico por ID
   * @param id_ticket - ID del ticket
   * @param params - Parámetros opcionales (language, etc.)
   */
  async getTicket(id_ticket: number | string, params?: Record<string, any>) {
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/v2/server/support/${id_ticket}${query}`
    );

    return handleResponse(response);
  },

  /**
   * Obtener todos los tópicos/tipos de tickets disponibles
   */
  async getTopicTickets() {
    const response = await fetchClient(
      `/v2/server/system/topic-ticket`
    );

    return handleResponse(response);
  },

  /**
   * Actualizar asunto/prioridad de un ticket
   * @param id_ticket - ID del ticket
   * @param params - Datos a actualizar (priority, etc.)
   */
  async updateSubjectOfTicket(id_ticket: number | string, params: Record<string, any>) {
    const response = await fetchClient(
      `/v2/server/support/${id_ticket}`,
      {
        method: "PUT",
        body: JSON.stringify(params),
      }
    );

    return handleResponse(response);
  },

  /**
   * Actualizar estado de un ticket
   * @param id_ticket - ID del ticket
   * @param params - Datos a actualizar (status, etc.)
   */
  async updateStatusOfTicket(id_ticket: number | string, params: Record<string, any>) {
    const response = await fetchClient(
      `/v2/server/support/${id_ticket}`,
      {
        method: "PUT",
        body: JSON.stringify(params),
      }
    );

    return handleResponse(response);
  },

/**
 * Enviar mensaje a un ticket
 * @param id_ticket - ID del ticket
 * @param params - Datos del mensaje (puede tener o no internal_memo)
 * @param isHouseAccount - Si es true, se asegura de no enviar internal_memo
 */
async sendMessage(
  id_ticket: number | string,
  params: {
    message: string;
    internal_memo?: boolean;
    language?: string;
  },
  isHouseAccount: boolean = false,
  isSupport: boolean = false
) {
  const { language = "es", ...rest } = params;
  const query = new URLSearchParams({ language }).toString();

  let url = "";
  let body: any = {};

  /* =========================
     🏠 HOUSE ACCOUNT
  ========================= */
  if (isHouseAccount) {
    url = `/v2/server/support/${id_ticket}/new-message?${query}`;

    body = {
      message: rest.message,
    };
  }

  /* =========================
     🧑‍💻 SOPORTE
  ========================= */
  else if (isSupport) {
    url = `/v2/server/support/${id_ticket}/messages?${query}`;

    body = {
      data: {
        message: rest.message,
      },
    };

    if (rest.internal_memo !== undefined) {
      body.data.internal_memo = rest.internal_memo;
    }
  }

  /* =========================
     👤 FALLBACK (cliente normal)
  ========================= */
  else {
    url = `/v2/server/support/${id_ticket}/new-message?${query}`;

    body = {
      message: rest.message,
    };
  }

  const response = await fetchClient(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return handleResponse(response);
},
  /**
   * Eliminar un ticket
   * @param id_ticket - ID del ticket
   */
  async deleteTicket(id_ticket: number | string) {
    const response = await fetchClient(
      `/v2/server/support/${id_ticket}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },

  /**
   * Obtener mensajes de un ticket
   * @param id_ticket - ID del ticket
   * @param language - Idioma para la respuesta
   */
  async getMessages(id_ticket: number | string, language: string = "es") {
    const query = new URLSearchParams({ language }).toString();

    const response = await fetchClient(
      `/v2/server/support/${id_ticket}/messages?${query}`
    );

    return handleResponse(response);
  },

  /**
   * Obtener todos los usuarios de soporte de una propiedad
   * @param id_propierty - ID de la propiedad
   * @param id_user_propierty_support - ID del usuario de soporte
   */
  async getAllUsersSupport(id_propierty: number | string, id_user_propierty_support: number | string) {
    const response = await fetchClient(
      `/v2/server/system/propierty/${id_propierty}/user-support/${id_user_propierty_support}`
    );

    return handleResponse(response);
  },

  /**
   * Asignar un usuario a un ticket
   * @param id_ticket - ID del ticket
   * @param params - Datos de asignación
   */
  async assignUserToTicket(id_ticket: number | string, params: Record<string, any>) {
    const response = await fetchClient(
      `/v2/server/support/${id_ticket}`,
      {
        method: "PUT",
        body: JSON.stringify(params),
      }
    );

    return handleResponse(response);
  },

  /**
   * Obtener estadísticas de tickets
   * @param params - Parámetros de filtro (property_id, etc.)
   */
  async getTicketStats(params?: Record<string, any>) {
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/v2/server/support/stats${query}`
    );

    return handleResponse(response);
  },

  /**
   * Obtener historial de cambios de un ticket
   * @param id_ticket - ID del ticket
   * @param params - Parámetros opcionales
   */
  async getTicketHistory(id_ticket: number | string, params?: Record<string, any>) {
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";

    const response = await fetchClient(
      `/v2/server/support/${id_ticket}/history${query}`
    );

    return handleResponse(response);
  },

  /**
   * Adjuntar archivo a un mensaje
   * @param id_ticket - ID del ticket
   * @param messageId - ID del mensaje
   * @param file - Archivo a adjuntar
   */
  async attachFile(id_ticket: number | string, messageId: number | string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetchClient(
      `/v2/server/support/${id_ticket}/messages/${messageId}/attachments`,
      {
        method: "POST",
        body: formData,
        headers: {
          // No establecer Content-Type, fetch lo hará automáticamente con FormData
        },
      }
    );

    return handleResponse(response);
  },

  /**
   * Eliminar adjunto de un mensaje
   * @param id_ticket - ID del ticket
   * @param messageId - ID del mensaje
   * @param attachmentId - ID del adjunto
   */
  async deleteAttachment(id_ticket: number | string, messageId: number | string, attachmentId: number | string) {
    const response = await fetchClient(
      `/v2/server/support/${id_ticket}/messages/${messageId}/attachments/${attachmentId}`,
      {
        method: "DELETE",
      }
    );

    return handleResponse(response);
  },

  /**
   * Obtener notificaciones de tickets
   * @param userId - ID del usuario
   */
  async getNotifications(userId: number | string) {
    const response = await fetchClient(
      `/v2/server/support/notifications/${userId}`
    );

    return handleResponse(response);
  },

  /**
   * Crear un nuevo ticket
   * @param params - Datos del nuevo ticket
   */
  async createTicket(params: {
    id_consumer: number;
    title: string;
    metadata: string;
    id_topic_ticket: number;
    id_type_priority: number;
    id_locker?: number;
    locker_name?: string;
    code_service?: string;
  }) {
    const response = await fetchClient(
      `/v2/server/support/new-ticket`,
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    );

    return handleResponse(response);
  },

  /**
   * Marcar notificación como leída
   * @param notificationId - ID de la notificación
   */
  async markNotificationAsRead(notificationId: number | string) {
    const response = await fetchClient(
      `/v2/server/support/notifications/${notificationId}/read`,
      {
        method: "PUT",
      }
    );

    return handleResponse(response);
  },

async updateTicket(
  id_ticket: number | string,
  body: Record<string, any>,
  language: string = "es"
) {
  const query = new URLSearchParams({ language }).toString();

  const response = await fetchClient(
    `/v2/server/support/${id_ticket}?${query}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    }
  );

  return handleResponse(response);
}
};