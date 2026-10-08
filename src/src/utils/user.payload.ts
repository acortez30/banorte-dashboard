import type {
  CreateUserFormData,
  CreateUserPayload,
} from "@/types/users.types";

export function buildCreateUserPayload(
  data: CreateUserFormData
): CreateUserPayload {
  const lang = localStorage.getItem("lang") || "es";

  return {
    language: lang,
    first_name: data.firstName,
    surname: data.lastName,
    email: data.email,
    user_type: Number(data.userType),
  };
}