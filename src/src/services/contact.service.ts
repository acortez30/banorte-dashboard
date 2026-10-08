import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";

export type ContactLanguage = "es" | "en";

export interface ContactData {
  name: string;
  surname: string;
  email: string;
  company_name?: string;
  how_hear_about_us: string;
  message?: string;
}

export interface ContactPayload {
  contact_data: ContactData;
}

export interface ContactSuccessResponse {
  mensaje_return: {
    ERROR: false;
    ERROR_MENSAGGE: string;
    CODE: number;
  };
}

function sanitizeContactData(data: ContactData): ContactData {
  return {
    name: data.name.trim(),
    surname: data.surname.trim(),
    email: data.email.trim(),
    company_name: data.company_name?.trim() || undefined,
    how_hear_about_us: data.how_hear_about_us.trim(),
    message: data.message?.trim() || undefined,
  };
}

export const contactService = {
  /**
   * Envía una solicitud de contacto.
   *
   * POST /v2/server/contact?language={es|en}
   *
   * Backend:
   * - no requiere autenticación
   * - máximo 5 solicitudes cada 2 minutos por IP
   */
  async sendContactRequest(
    data: ContactData,
    language: ContactLanguage = "es",
  ): Promise<ContactSuccessResponse> {
    const payload: ContactPayload = {
      contact_data: sanitizeContactData(data),
    };

    const response = await fetchClient(
      `/v2/server/contact?language=${encodeURIComponent(language)}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    return handleResponse(response) as Promise<ContactSuccessResponse>;
  },
};
