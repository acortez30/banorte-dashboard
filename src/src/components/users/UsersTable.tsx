import {
  Mail,
  Pencil,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import ToggleSwitch from "@/components/common/ToggleSwitch";
import TablePagination from "@/components/common/TablePagination";

import type {
  DashboardUser,
} from "@/types/dashboard";

import "@/styles/users/UsersTable.css";


/* =========================================================
   DATE
   ========================================================= */

const dateFormatter =
  new Intl.DateTimeFormat(
    "es-MX",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );


/* =========================================================
   PROPS
   ========================================================= */

interface UsersTableProps {
  users: DashboardUser[];

  isSuper: boolean;

  search: string;

  page: number;
  pageSize: number;
  total: number;

  onSearchChange: (
    value: string,
  ) => void;

  onPageChange: (
    page: number,
  ) => void;

  onPageSizeChange: (
    size: number,
  ) => void;

  onToggleUser: (
    user: DashboardUser,
    active: boolean,
  ) => void;

  onEditUser: (
    user: DashboardUser,
  ) => void;
}


/* =========================================================
   COMPONENT
   ========================================================= */

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
  return (
    <section className="users-table">
      {/* ===================================================
          TOOLBAR
          =================================================== */}
      <div className="users-table__toolbar">
        <div className="users-table__search">
          <Search
            size={17}
            strokeWidth={2}
            className="users-table__search-icon"
          />

          <input
            type="search"
            value={
              search
            }
            onChange={(
              event,
            ) => {
              onSearchChange(
                event.target.value,
              );
            }}
            placeholder="Buscar por nombre o correo"
            className="users-table__search-input"
            aria-label="Buscar usuarios"
          />
        </div>

        <div className="users-table__count">
          <UserRound
            size={14}
            strokeWidth={2}
          />

          <span>
            <strong>
              {total}
            </strong>

            {" "}
            {total === 1
              ? "usuario"
              : "usuarios"}
          </span>
        </div>
      </div>


      {/* ===================================================
          TABLE
          =================================================== */}
      <div className="users-table__scroll">
        <table className="users-table__content">
          <thead>
            <tr>
              <th>
                Nombre
              </th>

              <th>
                Email
              </th>

              {isSuper ? (
                <th>
                  Rol
                </th>
              ) : null}

              <th>
                Fecha de registro
              </th>

              <th>
                Ingreso al dashboard
              </th>

              <th className="users-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map(
              (user) => {
                const isSuperAdmin =
                  user.role ===
                  "SUPER_ADMIN";

                return (
                  <tr
                    key={
                      user.id
                    }
                  >
                    {/* NAME */}
                    <td>
                      <div className="users-table__user">
                        <div
                          className={`
                            users-table__avatar

                            ${
                              isSuperAdmin
                                ? "users-table__avatar--super"
                                : ""
                            }
                          `}
                        >
                          {isSuperAdmin ? (
                            <ShieldCheck
                              size={15}
                              strokeWidth={2}
                            />
                          ) : (
                            <UserRound
                              size={15}
                              strokeWidth={2}
                            />
                          )}
                        </div>

                        <div className="users-table__user-data">
                          <strong>
                            {
                              user.name
                            }
                          </strong>

                          {isSuper ? (
                            <span>
                              {isSuperAdmin
                                ? "Vivipost"
                                : "Banorte"}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </td>


                    {/* EMAIL */}
                    <td>
                      <div className="users-table__email">
                        <Mail
                          size={14}
                          strokeWidth={1.9}
                        />

                        <span>
                          {
                            user.email
                          }
                        </span>
                      </div>
                    </td>


                    {/* ROLE */}
                    {isSuper ? (
                      <td>
                        <span
                          className={`
                            users-table__role

                            ${
                              isSuperAdmin
                                ? "users-table__role--super"
                                : "users-table__role--admin"
                            }
                          `}
                        >
                          {isSuperAdmin
                            ? "Super administrador"
                            : "Administrador"}
                        </span>
                      </td>
                    ) : null}


                    {/* DATE */}
                    <td>
                      <span className="users-table__date">
                        {dateFormatter.format(
                          new Date(
                            user.registeredAt,
                          ),
                        )}
                      </span>
                    </td>


                    {/* ACCESS */}
                    <td>
                      <div className="users-table__access">
                        <ToggleSwitch
                          checked={
                            user.active
                          }
                          onChange={(
                            active,
                          ) => {
                            onToggleUser(
                              user,
                              active,
                            );
                          }}
                          label={`Cambiar acceso de ${user.name}`}
                        />
                      </div>
                    </td>


                    {/* ACTION */}
                    <td className="users-table__action">
                      <button
                        type="button"
                        className="users-table__edit"
                        onClick={() => {
                          onEditUser(
                            user,
                          );
                        }}
                        aria-label={`Editar ${user.name}`}
                        title="Editar usuario"
                      >
                        <Pencil
                          size={16}
                          strokeWidth={2}
                        />
                      </button>
                    </td>
                  </tr>
                );
              },
            )}


            {/* =================================================
                EMPTY
                ================================================= */}
            {!users.length ? (
              <tr>
                <td
                  colSpan={
                    isSuper
                      ? 6
                      : 5
                  }
                  className="users-table__empty"
                >
                  <div className="users-table__empty-content">
                    <Search
                      size={22}
                      strokeWidth={1.8}
                    />

                    <div>
                      <strong>
                        No se encontraron usuarios
                      </strong>

                      <p>
                        Intenta cambiar el término de búsqueda.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>


      {/* ===================================================
          PAGINATION
          =================================================== */}
      <TablePagination
        page={
          page
        }
        pageSize={
          pageSize
        }
        total={
          total
        }
        onPageChange={
          onPageChange
        }
        onPageSizeChange={
          onPageSizeChange
        }
      />
    </section>
  );
}