// src/types/clients.types.ts

export interface RegisterConsumerFromUnitFormData {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
}

export interface RegisterConsumerFromUnitPayload {
  consumers: Array<{
    id_unit: number;
    language: string;
    first_name: string;
    surname: string;
    email: string;
    telephone: string;
  }>;
}

export interface RegisterConsumerPayload {
  consumers: Array<{
    id_unit?: number;
    language?: string;
    first_name: string;
    surname?: string;
    email: string;
    telephone?: string;
    id_relationship?: number;
    id_user_type?: number;
  }>;
}

export interface RegisterBulkUserItem {
  first_name: string;
  surname?: string;
  email: string;
  telephone?: string;
  id_unit?: number;
  id_property?: number;
  id_relationship?: number;
  id_user_type?: number;
  language?: string;
}

export interface RegisterUserFromExcelPayload {
  language?: string;
  users?: RegisterBulkUserItem[];
  consumers?: RegisterBulkUserItem[];
}

export interface RegisterConsumerBulkPayload {
  consumers: RegisterBulkUserItem[];
}

export interface ChangeStatusOfClientPayload {
  data_user: {
    id_user?: number;
    email?: string;
    id_status?: number;
    delete_user?: boolean;
    to_propierty?: number;
  };
}

export interface UpdateAddresseePayload {
  id_package?: number;
  id_user?: number;
  addressee?: {
    first_name?: string;
    surname?: string;
    email?: string;
    telephone?: string;
  };
}

export interface UpdateConsumerPayload {
  data_user: {
    id_user?: number;
    first_name?: string;
    surname?: string;
    email?: string;
    telephone?: string;
    id_status?: number;
    id_relationship?: number;
    to_propierty?: number;
    delete_user?: boolean;
  };
}

export interface SobriquetOption {
  id_property?: number;
  property_name?: string;
  sobriquet?: string;
}

export interface SobriquetsResponse {
  mensaje_return?: {
    CODE?: number;
    MESSAGE?: string;
  };
  result_return?: SobriquetOption[];
}