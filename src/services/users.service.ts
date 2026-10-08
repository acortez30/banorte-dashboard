// src/services/users.service.ts

import { fetchClient } from "@/api/fetchClient";
import { handleResponse } from "@/api/handleResponse";
import {
  type ApiQueryParams,
  type ApiResponse,
  buildQueryParams,
} from "@/types/api.types";
import type {
  CreateUserPayload,
  DeleteUserFromPropertyPayload,
  ResetPasswordPayload,
  ToggleUserStatePayload,
  UpdateDataUserPayload,
  UpdateUserPayload,
  UsersApiResponse,
  UserTypesApiResponse,
} from "@/types/users.types";

/* ============================= */
/* ===== USERS SERVICE ========= */
/* ============================= */

export const usersService = {
  /* ─────────────────────────── */
  /* Get Admin Users             */
  /* ─────────────────────────── */
  async getAdmins(params: ApiQueryParams): Promise<ApiResponse> {
    const query = buildQueryParams(params);

    const response = await fetchClient(`/server/user/admin${query}`);

    return handleResponse(response);
  },

  /* ─────────────────────────── */
  /* Get Company Users           */
  /* ─────────────────────────── */
  async getUsersCompany(params: ApiQueryParams): Promise<ApiResponse> {
    const query = buildQueryParams(params);

    const response = await fetchClient(`/server/user/company${query}`);

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== DELETE USER PROPERTY == */
  /* ============================= */
  async deleteUserFromProperty(
    userId: number,
    propertyId: number
  ): Promise<ApiResponse> {
    const payload: DeleteUserFromPropertyPayload = {
      data_user: {
        id_user: userId,
        to_propierty: propertyId,
        delete_user: true,
      },
    };

    const response = await fetchClient(`/server/user/update-consumer`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== RESET PASSWORD ======== */
  /* ============================= */
  async resetPassword(body: ResetPasswordPayload): Promise<ApiResponse> {
    const response = await fetchClient(`/server/user/reset-password-user`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== GET USERS ============ */
  /* ============================= */
  async getUsers(lang: string): Promise<UsersApiResponse> {
    const response = await fetchClient(`/server/user/company?lang=${lang}`);

    return handleResponse(response);
  },

  /* ============================= */
  /* ===== UPDATE USER ========== */
  /* ============================= */
  async updateUser(body: UpdateUserPayload): Promise<ApiResponse> {
    const response = await fetchClient(`/server/company/update-employee`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  async updateDataUser(body: UpdateDataUserPayload): Promise<ApiResponse> {
    const response = await fetchClient(`/server/user/update-data-user`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ─────────────────────────── */
  /* Toggle User State           */
  /* ─────────────────────────── */
  async toggleUserState(
    body: ToggleUserStatePayload
  ): Promise<ApiResponse> {
    const response = await fetchClient(`/server/user/toggle-user-state`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ─────────────────────────── */
  /* Get User Types              */
  /* ─────────────────────────── */
  async getUserTypes(
    params?: ApiQueryParams
  ): Promise<UserTypesApiResponse> {
    const query = buildQueryParams(params);

    const response = await fetchClient(`/server/user/list-type-user${query}`);

    return handleResponse(response);
  },

  /* ─────────────────────────── */
  /* Create User                 */
  /* ─────────────────────────── */
  async createUser(body: CreateUserPayload): Promise<ApiResponse> {
    const response = await fetchClient(`/server/user/register-user`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ─────────────────────────── */
  /* Update Employee             */
  /* ─────────────────────────── */
  async updateEmployee(body: UpdateUserPayload): Promise<ApiResponse> {
    const response = await fetchClient(`/server/company/update-employee`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  /* ─────────────────────────── */
  /* Delete User                 */
  /* ─────────────────────────── */
  async deleteUser(idUser: string): Promise<ApiResponse> {
    const response = await fetchClient(`/server/user/${idUser}`, {
      method: "DELETE",
    });

    return handleResponse(response);
  },
};