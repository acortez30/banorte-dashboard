import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, UserX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Column } from "../ui/types";
import { GenericTable } from "../ui/GenericTable";
import type { UserRow } from "@/types/users.types";

interface Props {
  users: UserRow[];
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onToggleStatus: (user: UserRow) => void;
  loading?: boolean;
}

export default function UsersTableSection({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
  loading,
}: Props) {
  const { t } = useLanguage();

  const columns: Column<UserRow>[] = [
    {
      key: "firstName",
      header: t("users.name"),
      sortable: true,
    },
    {
      key: "lastName",
      header: t("users.lastName"),
      sortable: true,
    },
    {
      key: "userType",
      header: t("users.userType"),
      sortable: true,
    },
    {
      key: "email",
      header: t("users.email"),
      sortable: true,
    },
    {
      key: "status",
      header: t("users.status"),
      sortable: true,
      render: (user: UserRow) => {
        const isActive = user.status === "active";

        return (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                isActive ? "bg-green-500" : "bg-gray-400"
              )}
            />
            {isActive ? t("users.active") : t("users.inactive")}
          </div>
        );
      },
    },
    {
      key: "daysActive",
      header: t("users.daysActive"),
      sortable: true,
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (user: UserRow) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onEdit(user);
              }}
            >
              <Pencil className="h-3.5 w-3.5 mr-2" />
              {t("common.edit")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onToggleStatus(user);
              }}
            >
              <UserX className="h-3.5 w-3.5 mr-2" />
              {user.status === "active"
                ? t("users.deactivate")
                : t("users.activate")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                onDelete(user);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <GenericTable
      data={users}
      columns={columns}
      enableSearch
      enableDateRange={false}
      searchFields={["firstName", "lastName", "email", "userType"]}
      loading={loading}
      defaultSort={{ key: "daysActive", direction: "desc" }}
    />
  );
}