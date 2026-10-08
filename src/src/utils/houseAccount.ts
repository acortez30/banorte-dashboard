export function isHouseAccountUser(user: any): boolean {
  const userType = String(user?.user_type ?? "")
    .trim()
    .toUpperCase();

  return userType === "HOUSE ACCOUNT" || user?.is_house_account === true;
}

export function getStoredUser(): any {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}
