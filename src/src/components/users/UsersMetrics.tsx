import { UserCheck, UserX, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { UserRow } from "@/types/users.types";

interface UsersMetricsProps {
  users: UserRow[];
}

export default function UsersMetrics({ users }: UsersMetricsProps) {
  const { t } = useLanguage();

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const inactiveUsers = users.filter((user) => user.status === "inactive").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        className="rounded-2xl border border-border bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-inter text-muted-foreground">
            {t("users.totalUsers")}
          </p>
          <Users className="h-4 w-4 text-muted-foreground" />
        </div>

        <p className="mt-3 text-2xl font-bold font-poppins text-foreground">
          {totalUsers}
        </p>
      </div>

      <div
        className="rounded-2xl border border-border bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-inter text-muted-foreground">
            {t("users.activeUsers")}
          </p>
          <UserCheck className="h-4 w-4 text-success" />
        </div>

        <p className="mt-3 text-2xl font-bold font-poppins text-success">
          {activeUsers}
        </p>
      </div>

      <div
        className="rounded-2xl border border-border bg-card p-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-inter text-muted-foreground">
            {t("users.inactiveUsers")}
          </p>
          <UserX className="h-4 w-4 text-destructive" />
        </div>

        <p className="mt-3 text-2xl font-bold font-poppins text-destructive">
          {inactiveUsers}
        </p>
      </div>
    </div>
  );
}