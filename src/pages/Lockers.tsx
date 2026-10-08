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

import LockersMetrics from "@/components/lockers/LockersMetrics";
import LockersTable from "@/components/lockers/LockersTable";
import LockerFormDialog from "@/components/lockers/LockerFormDialog";

import {
  useData,
} from "@/contexts/DataContext";

import {
  getLockerLoads,
} from "@/utils/lockerAssignment";

import type {
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/lockers/LockersPage.css";


export default function Lockers() {
  const {
    lockers,
    employees,
    addLocker,
    updateLocker,
  } = useData();


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
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<LockerIsland | null>(
      null,
    );


  /* =======================================================
     LOCKER LOADS
     ======================================================= */

  const loads = useMemo(
    () =>
      getLockerLoads(
        lockers,
        employees,
      ),
    [
      lockers,
      employees,
    ],
  );


  /* =======================================================
     METRICS
     ======================================================= */

  const activeLockers =
    useMemo(
      () =>
        lockers.filter(
          (locker) =>
            locker.active,
        ),
      [lockers],
    );

  const totalCompartments =
    useMemo(
      () =>
        activeLockers.reduce(
          (
            total,
            locker,
          ) =>
            total +
            locker.compartments,
          0,
        ),
      [activeLockers],
    );

  const assignedEmployees =
    useMemo(
      () => {
        const activeIds =
          new Set(
            activeLockers.map(
              (locker) =>
                locker.id,
            ),
          );

        return employees.filter(
          (employee) =>
            activeIds.has(
              employee.lockerId,
            ),
        ).length;
      },
      [
        activeLockers,
        employees,
      ],
    );

  const availableCapacity =
    Math.max(
      totalCompartments -
        assignedEmployees,
      0,
    );


  /* =======================================================
     FILTERED LOCKERS
     ======================================================= */

  const filtered = useMemo(
    () => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return loads;
      }

      return loads.filter(
        ({
          locker,
        }) => {
          const searchable = `
            ${locker.alias}
            ${locker.location}
          `.toLowerCase();

          return searchable.includes(
            query,
          );
        },
      );
    },
    [
      loads,
      search,
    ],
  );


  /* =======================================================
     HANDLERS
     ======================================================= */

  const openCreate = () => {
    setEditing(null);

    setDialogOpen(
      true,
    );
  };

  const openEdit = (
    locker: LockerIsland,
  ) => {
    setEditing(
      locker,
    );

    setDialogOpen(
      true,
    );
  };

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(
      value,
    );

    setPage(1);
  };

  const handlePageSizeChange = (
    size: number,
  ) => {
    setPageSize(
      size,
    );

    setPage(1);
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout>
      <main className="lockers-page">
        {/* =================================================
            HEADER
            ================================================= */}
        <PageHeader
          title="Lockers"
          description="Administra las islas de lockers Banorte y su capacidad."
          actions={
            <Button
              variant="primary"
              icon={Plus}
              onClick={
                openCreate
              }
            >
              Nuevo locker
            </Button>
          }
        />


        {/* =================================================
            METRICS
            ================================================= */}
        <LockersMetrics
          activeLockers={
            activeLockers.length
          }
          registeredLockers={
            lockers.length
          }
          totalCompartments={
            totalCompartments
          }
          assignedEmployees={
            assignedEmployees
          }
          availableCapacity={
            availableCapacity
          }
        />


        {/* =================================================
            TABLE
            ================================================= */}
        <LockersTable
          loads={
            filtered
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
            filtered.length
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
          onEdit={
            openEdit
          }
        />
      </main>


      {/* ===================================================
          DIALOG
          =================================================== */}
      <LockerFormDialog
        open={
          dialogOpen
        }
        onClose={() => {
          setDialogOpen(
            false,
          );
        }}
        locker={
          editing
        }
        onSubmit={(
          value,
        ) => {
          if (editing) {
            updateLocker(
              editing.id,
              value,
            );

            toast.success(
              "Locker actualizado",
            );
          } else {
            addLocker(
              value,
            );

            toast.success(
              "Locker creado",
            );
          }

          setDialogOpen(
            false,
          );
        }}
      />
    </DashboardLayout>
  );
}