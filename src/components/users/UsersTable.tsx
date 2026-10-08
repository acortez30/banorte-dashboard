import {
  useMemo,
  useState,
} from "react";

import {
  Mail,
  Pencil,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import SortableTableHeader from "@/components/common/SortableTableHeader";
import TablePagination from "@/components/common/TablePagination";
import ToggleSwitch from "@/components/common/ToggleSwitch";

import type {
  DashboardUser,
} from "@/types/dashboard";
import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/users/UsersTable.css";

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

type UserSortKey =
  | "name"
  | "email"
  | "role"
  | "registeredAt"
  | "active";

interface UsersTableProps {
  users: DashboardUser[];
  isSuper: boolean;
  search: string;
  page: number;
  pageSize: number;
  total: number;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onToggleUser: (user: DashboardUser, active: boolean) => void;
  onEditUser: (user: DashboardUser) => void;
}

export default function UsersTable({
  users,
  isSuper,
  search,
  page,
  pageSize,
  total,
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  onToggleUser,
  onEditUser,
}: UsersTableProps) {
  const [sortKey, setSortKey] = useState<UserSortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedUsers = useMemo(
    () =>
      sortRows(
        users,
        sortKey,
        sortDirection,
        {
          name: (user) => user.name,
          email: (user) => user.email,
          role: (user) => user.role === "SUPER_ADMIN" ? "Super administrador" : "Administrador",
          registeredAt: (user) => new Date(user.registeredAt),
          active: (user) => user.active,
        },
      ),
    [sortDirection, sortKey, users],
  );

  const visibleUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [page, pageSize, sortedUsers]);

  const handleSort = (key: UserSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    onPageChange(1);
  };

  return (
    <section className="users-table">
      <div className="users-table__toolbar">
        <div className="users-table__search">
          <Search
            size={17}
            strokeWidth={2}
            className="users-table__search-icon"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre o correo"
            className="users-table__search-input"
            aria-label="Buscar usuarios"
          />
        </div>

        <div className="users-table__count">
          <UserRound size={14} strokeWidth={2} />
          <span>
            <strong>{total}</strong>{" "}
            {total === 1 ? "usuario" : "usuarios"}
          </span>
        </div>
      </div>

      <div className="users-table__scroll">
        <table className="users-table__content">
          <thead>
            <tr>
              <SortableTableHeader
                label="Nombre"
                active={sortKey === "name"}
                direction={sortDirection}
                onSort={() => handleSort("name")}
              />

              <SortableTableHeader
                label="Email"
                active={sortKey === "email"}
                direction={sortDirection}
                onSort={() => handleSort("email")}
              />

              {isSuper ? (
                <SortableTableHeader
                  label="Rol"
                  active={sortKey === "role"}
                  direction={sortDirection}
                  onSort={() => handleSort("role")}
                />
              ) : null}

              <SortableTableHeader
                label="Fecha de registro"
                active={sortKey === "registeredAt"}
                direction={sortDirection}
                onSort={() => handleSort("registeredAt")}
              />

              <SortableTableHeader
                label="Ingreso al dashboard"
                active={sortKey === "active"}
                direction={sortDirection}
                onSort={() => handleSort("active")}
              />

              <th className="users-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleUsers.map((user) => {
              const isSuperAdmin = user.role === "SUPER_ADMIN";

              return (
                <tr key={user.id}>
                  <td>
                    <div className="users-table__user">
                      <div
                        className={`users-table__avatar ${isSuperAdmin ? "users-table__avatar--super" : ""}`}
                      >
                        {isSuperAdmin ? (
                          <ShieldCheck size={15} strokeWidth={2} />
                        ) : (
                          <UserRound size={15} strokeWidth={2} />
                        )}
                      </div>

                      <div className="users-table__user-data">
                        <strong>{user.name}</strong>
                        {isSuper ? (
                          <span>{isSuperAdmin ? "Vivipost" : "Banorte"}</span>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="users-table__email">
                      <Mail size={14} strokeWidth={1.9} />
                      <span>{user.email}</span>
                    </div>
                  </td>

                  {isSuper ? (
                    <td>
                      <span
                        className={`users-table__role ${isSuperAdmin ? "users-table__role--super" : "users-table__role--admin"}`}
                      >
                        {isSuperAdmin ? "Super administrador" : "Administrador"}
                      </span>
                    </td>
                  ) : null}

                  <td>
                    <span className="users-table__date">
                      {dateFormatter.format(new Date(user.registeredAt))}
                    </span>
                  </td>

                  <td>
                    <div className="users-table__access">
                      <ToggleSwitch
                        checked={user.active}
                        onChange={(active) => onToggleUser(user, active)}
                        label={`Cambiar acceso de ${user.name}`}
                      />
                    </div>
                  </td>

                  <td className="users-table__action">
                    <button
                      type="button"
                      className="users-table__edit"
                      onClick={() => onEditUser(user)}
                      aria-label={`Editar ${user.name}`}
                      title="Editar usuario"
                    >
                      <Pencil size={16} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {!visibleUsers.length ? (
              <tr>
                <td
                  colSpan={isSuper ? 6 : 5}
                  className="users-table__empty"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
}
