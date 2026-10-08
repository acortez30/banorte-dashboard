import {
  useMemo,
  useState,
} from "react";

import {
  FileUp,
  Plus,
} from "lucide-react";

import {
  toast,
} from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";

import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";

import EmployeesMetrics from "@/components/employees/EmployeesMetrics";
import EmployeesDistribution from "@/components/employees/EmployeesDistribution";
import EmployeesTable from "@/components/employees/EmployeesTable";

import EmployeeFormDialog from "@/components/employees/EmployeeFormDialog";
import BulkImportDialog from "@/components/employees/BulkImportDialog";
import EmployeeDetailDialog from "@/components/employees/EmployeeDetailDialog";

import {
  useData,
} from "@/contexts/DataContext";

import {
  capacitySummary,
  getLockerLoads,
} from "@/utils/lockerAssignment";

import type {
  Employee,
} from "@/types/dashboard";

import "@/styles/employees/EmployeesPage.css";

export default function Employees() {
  const {
    lockers,
    employees,

    addEmployee,
    updateEmployee,

    toggleEmployee,
    importEmployees,
  } = useData();


  /* =======================================================
     FILTERS
     ======================================================= */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    lockerFilter,
    setLockerFilter,
  ] = useState("ALL");


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
  ] = useState(20);


  /* =======================================================
     DIALOGS
     ======================================================= */

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    bulkOpen,
    setBulkOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] = useState<Employee | null>(
    null,
  );

  const [
    detailEmployee,
    setDetailEmployee,
  ] = useState<Employee | null>(null);


  /* =======================================================
     CAPACITY
     ======================================================= */

  const summary = useMemo(
    () =>
      capacitySummary(
        lockers,
        employees,
      ),
    [
      lockers,
      employees,
    ],
  );

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
     ACTIVE EMPLOYEES
     ======================================================= */

  const activeEmployees =
    useMemo(
      () =>
        employees.filter(
          (employee) =>
            employee.active,
        ).length,
      [employees],
    );


  /* =======================================================
     FILTERED EMPLOYEES
     ======================================================= */

  const filtered = useMemo(
    () => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return employees.filter(
        (employee) => {
          const employeeSearchValue = `
            ${employee.name}
            ${employee.phone}
            ${employee.employeeNumber}
            ${employee.badgeNumber}
          `.toLowerCase();

          const matchesSearch =
            !normalizedSearch ||
            employeeSearchValue.includes(
              normalizedSearch,
            );

          const matchesLocker =
            lockerFilter === "ALL" ||
            employee.lockerId ===
              lockerFilter;

          return (
            matchesSearch &&
            matchesLocker
          );
        },
      );
    },
    [
      employees,
      lockerFilter,
      search,
    ],
  );


  /* =======================================================
     PAGINATED EMPLOYEES
     ======================================================= */

  const paginated = useMemo(
    () => {
      const start =
        (page - 1) *
        pageSize;

      const end =
        page *
        pageSize;

      return filtered.slice(
        start,
        end,
      );
    },
    [
      filtered,
      page,
      pageSize,
    ],
  );


  /* =======================================================
     BALANCE
     ======================================================= */

  const loadValues = useMemo(
    () =>
      loads.map(
        (load) =>
          load.assigned,
      ),
    [loads],
  );

  const maxLoad =
    loadValues.length > 0
      ? Math.max(
          ...loadValues,
        )
      : 0;

  const minLoad =
    loadValues.length > 0
      ? Math.min(
          ...loadValues,
        )
      : 0;

  const balanced =
    maxLoad -
      minLoad <=
    1;


  /* =======================================================
     HANDLERS
     ======================================================= */

  const handleNewEmployee =
    () => {
      setEditing(null);
      setFormOpen(true);
    };

  const handleEditEmployee = (
    employee: Employee,
  ) => {
    setEditing(employee);
    setFormOpen(true);
  };

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleLockerFilterChange =
    (
      value: string,
    ) => {
      setLockerFilter(value);
      setPage(1);
    };

  const handlePageSizeChange = (
    size: number,
  ) => {
    setPageSize(size);
    setPage(1);
  };

  const handleToggleEmployee = (
    employee: Employee,
    active: boolean,
  ) => {
    toggleEmployee(
      employee.id,
      active,
    );

    toast.success(
      active
        ? "Empleado activado"
        : "Empleado desactivado",
    );
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <DashboardLayout>
      <main className="employees-page">
        {/* =================================================
            HEADER
            ================================================= */}
        <PageHeader
          title="Empleados"
          description="Administra empleados Banorte y su asignación a islas de lockers."
          actions={
            <div className="employees-page__actions">
              <Button
                variant="secondary"
                icon={FileUp}
                onClick={() => {
                  setBulkOpen(
                    true,
                  );
                }}
              >
                Alta masiva
              </Button>

              <Button
                variant="primary"
                icon={Plus}
                onClick={
                  handleNewEmployee
                }
              >
                Nuevo empleado
              </Button>
            </div>
          }
        />


        {/* =================================================
            METRICS
            ================================================= */}
        <EmployeesMetrics
          totalEmployees={
            employees.length
          }
          activeEmployees={
            activeEmployees
          }
          activeLockerCount={
            summary.activeLockerCount
          }
          totalCapacity={
            summary.totalCapacity
          }
          availableCapacity={
            summary.available
          }
          assignedEmployees={
            summary.assigned
          }
          balanced={
            balanced
          }
          minLoad={
            minLoad
          }
          maxLoad={
            maxLoad
          }
          hasCapacity={
            summary.hasCapacity
          }
        />


        {/* =================================================
            DISTRIBUTION
            ================================================= */}
        <EmployeesDistribution
          loads={
            loads
          }
          additionalRequired={
            summary.additionalRequired
          }
        />


        {/* =================================================
            TABLE
            ================================================= */}
        <EmployeesTable
          employees={
            paginated
          }
          lockers={
            lockers
          }

          search={
            search
          }
          lockerFilter={
            lockerFilter
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
          onLockerFilterChange={
            handleLockerFilterChange
          }

          onPageChange={
            setPage
          }
          onPageSizeChange={
            handlePageSizeChange
          }

          onToggleEmployee={
            handleToggleEmployee
          }
          onEditEmployee={
            handleEditEmployee
          }
          onViewEmployee={
            setDetailEmployee
          }
        />
      </main>



      {/* ===================================================
          EMPLOYEE DETAIL
          =================================================== */}
      <EmployeeDetailDialog
        open={Boolean(detailEmployee)}
        onClose={() => {
          setDetailEmployee(null);
        }}
        employee={detailEmployee}
        employees={employees}
        lockers={lockers}
      />

      {/* ===================================================
          EMPLOYEE FORM
          =================================================== */}
      <EmployeeFormDialog
        open={
          formOpen
        }
        onClose={() => {
          setFormOpen(
            false,
          );
        }}
        employee={
          editing
        }
        lockers={
          lockers
        }
        employees={
          employees
        }
        onSubmit={(
          value,
        ) => {
          const result =
            editing
              ? updateEmployee(
                  editing.id,
                  value,
                )
              : addEmployee(
                  value,
                );

          if (result.ok) {
            toast.success(
              editing
                ? "Empleado actualizado"
                : "Empleado creado y asignado automáticamente",
            );
          }

          return result;
        }}
      />


      {/* ===================================================
          BULK IMPORT
          =================================================== */}
      <BulkImportDialog
        open={
          bulkOpen
        }
        onClose={() => {
          setBulkOpen(
            false,
          );
        }}
        lockers={
          lockers
        }
        employees={
          employees
        }
        onImport={(
          rows,
        ) => {
          const result =
            importEmployees(
              rows,
            );

          if (result.ok) {
            toast.success(
              `${result.created} empleados importados y balanceados`,
            );
          }

          return result;
        }}
      />
    </DashboardLayout>
  );
}