import type {
  UserApiItem,
  UserRow,
  UsersApiResponse,
} from "@/types/users.types";

export function mapUsers(response: UsersApiResponse): UserRow[] {
  if (!Array.isArray(response?.result_return)) {
    return [];
  }

  return response.result_return.map((user: UserApiItem): UserRow => ({
    id: String(user.id_user ?? ""),
    firstName: user.first_name ?? "",
    lastName: user.surname ?? "",
    email: user.email ?? "",
    idUserType: Number(user.id_user_type ?? 0),
    userType: user.user_type ?? "",
    status: Number(user.id_status) === 1 ? "active" : "inactive",
    daysActive: Number(user.active_days ?? 0),
  }));
}