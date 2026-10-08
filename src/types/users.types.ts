export type UserStatus = "active" | "inactive";

export interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  idUserType: number;
  userType: string;
  status: UserStatus;
  daysActive: number;
}

export interface UserApiItem {
  id_user?: number | string;
  first_name?: string;
  surname?: string;
  email?: string;
  id_user_type?: number | string;
  user_type?: string;
  id_status?: number | string;
  active_days?: number | string;
}

export interface UsersApiResponse {
  mensaje_return?: {
    CODE?: number;
    MESSAGE?: string;
  };
  result_return?: UserApiItem[];
}

export interface UserTypeOption {
  id_user_type: number;
  user_type: string;
}

export interface UserTypesApiResponse {
  mensaje_return?: {
    CODE?: number;
    MESSAGE?: string;
  };
  result_list_user?: UserTypeOption[];
}

export interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
}

export interface EditUserFormData extends CreateUserFormData {
  password: string;
}

export interface CreateUserPayload {
  language: string;
  first_name: string;
  surname: string;
  email: string;
  user_type: number;
}

export interface UpdateUserPayload {
  language: string;
  data_employee: Array<{
    password?: string;
    id_type_employee: number;
    first_name: string;
    surname: string;
    email: string;
  }>;
}

export interface ToggleUserStatePayload {
  language: string;
  id_company: number | null;
  data_employee: Array<{
    id_status: number;
    email: string;
    id_type_employee: number;
  }>;
}

export interface ResetPasswordPayload {
  language: string;
  password: string;
  token: string;
}

export interface UpdateDataUserPayload {
  id_languaje: string;
  first_name?: string;
  surname?: string;
  email: string;
  company: string;
  id_user: number;
  userType: string;
}

export interface DeleteUserFromPropertyPayload {
  data_user: {
    id_user: number;
    to_propierty: number;
    delete_user: boolean;
  };
}