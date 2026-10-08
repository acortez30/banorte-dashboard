import { useMemo } from "react";
import type { UserRow } from "@/types/users.types";

type RoleFilterUser = Pick<UserRow, "idUserType" | "userType">;

interface RoleData {
  id: number;
  label: string;
  count: number;
}

interface UsersRoleFilterProps {
  users: RoleFilterUser[];
  selectedRole: number | null;
  onChange: (role: number | null) => void;
}

export default function UsersRoleFilter({
  users,
  selectedRole,
  onChange,
}: UsersRoleFilterProps) {
  const roles: RoleData[] = useMemo(() => {
    const map = new Map<number, RoleData>();

    users.forEach((user) => {
      const existingRole = map.get(user.idUserType);

      if (!existingRole) {
        map.set(user.idUserType, {
          id: user.idUserType,
          label: user.userType || "—",
          count: 1,
        });

        return;
      }

      existingRole.count += 1;
    });

    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [users]);

  return (
    <div className="flex gap-2 flex-wrap animate-fade-in">
      {roles.map((role) => {
        const isActive = selectedRole === role.id;

        return (
          <button
            key={role.id}
            onClick={() => onChange(isActive ? null : role.id)}
            className={`
              inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              text-sm font-medium transition-all duration-150 border border-border
              ${
                isActive
                  ? "bg-muted text-foreground"
                  : "bg-muted/60 text-foreground hover:bg-muted"
              }
            `}
          >
            {role.label}
            <span
              className="
                text-xs font-semibold px-1.5 py-0.5 rounded-full
                bg-background text-muted-foreground min-w-[20px] text-center
              "
            >
              {role.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}