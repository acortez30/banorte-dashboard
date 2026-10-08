export interface PermissionUser {
  id_user_type?: number | string;
  idUserType?: number | string;
  user_type?: string;
  userType?: string;
  type_user?: string;
  name_user_type?: string;
  data_company?: {
    id_user_type?: number | string;
    idUserType?: number | string;
    user_type?: string;
    userType?: string;
    type_user?: string;
    name_user_type?: string;
  };
}

export function isSuperUser(user: PermissionUser | null | undefined): boolean {
  if (!user) return false;

  const idUserType = Number(
    user.id_user_type ??
      user.idUserType ??
      user.data_company?.id_user_type ??
      user.data_company?.idUserType ??
      0
  );

  const userTypeName = String(
    user.user_type ??
      user.userType ??
      user.type_user ??
      user.name_user_type ??
      user.data_company?.user_type ??
      user.data_company?.userType ??
      user.data_company?.type_user ??
      user.data_company?.name_user_type ??
      ""
  )
    .trim()
    .toUpperCase();

  return (
    idUserType === 1 ||
    userTypeName === "SUPER" ||
    userTypeName.includes("SUPER USER") ||
    userTypeName.includes("SUPER USUARIO") ||
    userTypeName.includes("SUPER ADMIN")
  );
}

export function getStoredUser(): PermissionUser | null {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;
    return JSON.parse(rawUser) as PermissionUser;
  } catch {
    return null;
  }
}
