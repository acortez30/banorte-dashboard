import { fetchClient } from "@/api/fetchClient";

/* ============================= */
/* ========== TYPES ============ */
/* ============================= */

export interface LoginRequest {
  email: string;
  pass: string;
}

/* ===== LOGIN RESPONSE ===== */

export interface LoginResponse {
  mensaje_return: {
    ERROR: boolean;
    ERROR_MENSAGGE: string;
    CODE: number;
  };
  token: string;
  result: User;
  operations_propierty: any[];
  offerings_menu: any[];
  data_menu: DataMenu;
  data_company: Company;
}

/* ===== USER ===== */

export interface User {
  id_user: number;
  first_name: string;
  surname: string;
  alias_username: string | null;
  email: string;
  validate_mail: number;
  conexion_date: string;
  id_language: number;
  id_user_type: number;
  user_type: string;
  dark_mode: number;
  icon: string;
  acronym_language: string;
  id_consumer: number;
  consumer_code: string;
  phone_validate_code: string | null;
  main_tlf: string | null;
  id_propierty: number;
  code_propierty: string;
  name_propierty: string;
  map_lat_center_point: string;
  map_length_center_point: string;
}

/* ===== MENU ===== */

export interface DataMenu {
  return_menu: MenuItem[];
  return_submenu: any[];
}

export interface MenuItem {
  id: number;
  txt: string;
  route: string;
  menu_name: string;
  icon: string;
}

/* ===== COMPANY ===== */

export interface Company {
  id_user: number;
  id_language: number;
  id_user_type: number;
  user_type: string;
  status_user: number;
  first_name: string;
  surname: string;
  alias_username: string | null;
  email: string;
  email_validated_on: string | null;
  change_password: string | null;
  connection_status: number;
  ip_last_connection: string;
  conexion_date: string;
  registration_date: string;
  id_company: number;
  id_courier: number;
  address: string;
  company_name: string;
  img_logo: string;
  id_company_type: number;
  company_type: string;
  id_propierty: number;
  code_propierty: string;
  number_floor: number;
}

/* ===== GENERIC RESPONSE ===== */

export interface ApiResponse<T = any> {
  data?: T;
  mensaje_return?: {
    ERROR?: boolean;
    ERROR_MENSAGGE?: string;
    CODE?: number;
  };
}

/* ============================= */
/* ===== HELPER RESPONSE ======= */
/* ============================= */

const parseResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Error de red");
  }

  return data;
};

/* ============================= */
/* ===== AUTH SERVICE ========== */
/* ============================= */

export const authService = {
  /* ===== LOGIN ===== */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetchClient(
      "/server/user/validate-user-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return parseResponse(response);
  },

  /* ===== LOGOUT ===== */
  async logout(token?: string): Promise<void> {
    await fetchClient("/server/user/logout", {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
    });
  },

  /* ===== FORGOT PASSWORD ===== */
  async forgotPassword(
    email: string,
    language: string
  ): Promise<ApiResponse> {
    const response = await fetchClient(
      "/server/user/forgot-password-user",
      {
        method: "POST",
        body: JSON.stringify({ email, language }),
      }
    );

    return parseResponse(response);
  },

  /* ===== VALIDATE RESET TOKEN ===== */
  async validateResetToken(token: string): Promise<ApiResponse> {
    const response = await fetchClient(
      "/server/user/verify-token-reset-password",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      }
    );

    return parseResponse(response);
  },

  /* ===== CHANGE PASSWORD ===== */
  async changePassword(
    token: string,
    password: string,
    language: string
  ): Promise<ApiResponse> {
    const response = await fetchClient(
      "/server/user/reset-password-user",
      {
        method: "POST",
        body: JSON.stringify({ token, password, language }),
      }
    );

    return parseResponse(response);
  },
};