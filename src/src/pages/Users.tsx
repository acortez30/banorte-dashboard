import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
} from "lucide-react";

import {
  toast,
} from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";

import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";

import UsersTable from "@/components/users/UsersTable";
import UserFormDialog from "@/components/users/UserFormDialog";

import {
  useAuth,
} from "@/contexts/AuthContext";

import {
  useData,
} from "@/contexts/DataContext";

import type {
  DashboardUser,
} from "@/types/dashboard";

import "@/styles/users/UsersPage.css";


export default function Users() {
  const {
    user: sessionUser,
  } = useAuth();

  const {
    users,
    addUser,
    updateUser,
    toggleUser,
  } = useData();


  /* =======================================================
     ROLE
     ======================================================= */

  const isSuper =
    sessionUser?.role ===
    "SUPER_ADMIN";


  /* =======================================================
     FILTERS
     ======================================================= */

  const [
    search,
    setSearch,
  ] = useState("");


  /* =======================================================
     PAGINATION
     ======================================================= */

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(10);


  /* =======================================================
     DIALOG
     ======================================================= */

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<DashboardUser | null>(
      null,
    );


  /* =======================================================
     VISIBLE USERS
     ======================================================= */

  const visibleUsers =
    useMemo(
      () =>
        users.filter(
          (item) => {
            /*
             * SUPER ADMIN
             * Puede ver administradores Banorte
             * y super administradores Vivipost.
             */
            if (isSuper) {
              return true;
            }

            /*
             * ADMIN BANORTE
             * Solo puede ver administradores
             * pertenecientes a Banorte.
             */
            return (
              item.role ===
                "ADMIN" &&
              item.organization ===
                "Banorte"
            );
          },
        ),
      [
        isSuper,
        users,
      ],
    );


  /* =======================================================
     FILTERED USERS
     ======================================================= */

  const filteredUsers =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return visibleUsers;
        }

        return visibleUsers.filter(
          (item) => {
            const searchable = `
              ${item.name}
              ${item.email}
              ${item.role}
              ${item.organization ?? ""}
            `.toLowerCase();

            return searchable.includes(
              query,
            );
          },
        );
      },
      [
        search,
        visibleUsers,
      ],
    );


  /* =======================================================
     PAGINATED USERS
     ======================================================= */

  const paginatedUsers =
    useMemo(
      () => {
        const start =
          (
            page - 1
          ) *
          pageSize;

        const end =
          start +
          pageSize;

        return filteredUsers.slice(
          start,
          end,
        );
      },
      [
        filteredUsers,
        page,
        pageSize,
      ],
    );


  /* =======================================================
     HANDLERS
     ======================================================= */

  const handleNewUser = () => {
    setEditing(null);

    setFormOpen(true);
  };

  const handleEditUser = (
    user: DashboardUser,
  ) => {
    setEditing(user);

    setFormOpen(true);
  };

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);

    setPage(1);
  };

  const handlePageSizeChange = (
    size: number,
  ) => {
    setPageSize(size);

    setPage(1);
  };

  const handleToggleUser = (
    user: DashboardUser,
    active: boolean,
  ) => {
    toggleUser(
      user.id,
      active,
    );

    toast.success(
      active
        ? "Acceso al dashboard activado"
        : "Acceso al dashboard desactivado",
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout>
      <main className="users-page">
        {/* =================================================
            HEADER
            ================================================= */}
        <PageHeader
          title="Usuarios"
          description={
            isSuper
              ? "Administra usuarios Banorte y super administradores Vivipost."
              : "Administra los usuarios con acceso al dashboard de Banorte."
          }
          actions={
            <Button
              variant="primary"
              icon={Plus}
              onClick={
                handleNewUser
              }
            >
              Nuevo usuario
            </Button>
          }
        />


        {/* =================================================
            USERS TABLE
            ================================================= */}
        <UsersTable
          users={
            paginatedUsers
          }
          isSuper={
            isSuper
          }

          search={
            search
          }

          page={
            page
          }
          pageSize={
            pageSize
          }
          total={
            filteredUsers.length
          }

          onSearchChange={
            handleSearchChange
          }
          onPageChange={
            setPage
          }
          onPageSizeChange={
            handlePageSizeChange
          }

          onToggleUser={
            handleToggleUser
          }
          onEditUser={
            handleEditUser
          }
        />
      </main>


      {/* ===================================================
          USER FORM
          =================================================== */}
      <UserFormDialog
        open={
          formOpen
        }
        onClose={() => {
          setFormOpen(
            false,
          );
        }}
        user={
          editing
        }
        allowRoleSelection={
          isSuper
        }
        onSubmit={(
          value,
        ) => {
          /*
           * Un administrador Banorte jamás
           * puede crear un SUPER_ADMIN.
           */
          if (
            !isSuper &&
            value.role !==
              "ADMIN"
          ) {
            return {
              ok: false,
              error:
                "Solo puedes administrar usuarios Banorte.",
            };
          }

          const result =
            editing
              ? updateUser(
                  editing.id,
                  value,
                )
              : addUser(
                  value,
                );

          if (
            result.ok
          ) {
            toast.success(
              editing
                ? "Usuario actualizado"
                : "Usuario creado",
            );
          }

          return result;
        }}
      />
    </DashboardLayout>
  );
}