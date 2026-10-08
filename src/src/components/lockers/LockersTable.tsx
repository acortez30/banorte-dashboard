import {
  Pencil,
  Search,
} from "lucide-react";

import StatusBadge from "@/components/common/StatusBadge";
import TablePagination from "@/components/common/TablePagination";

import type {
  LockerIsland,
} from "@/types/dashboard";

import "@/styles/lockers/LockersTable.css";


interface LockerLoad {
  locker: LockerIsland;

  assigned: number;
  available: number;
  percent: number;
}

interface LockersTableProps {
  loads: LockerLoad[];

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

  onEdit: (
    locker: LockerIsland,
  ) => void;
}


export default function LockersTable({
  loads,

  search,

  page,
  pageSize,
  total,

  onSearchChange,

  onPageChange,
  onPageSizeChange,

  onEdit,
}: LockersTableProps) {
  return (
    <section className="lockers-table">
      {/* ===================================================
          TOOLBAR
          =================================================== */}
      <div className="lockers-table__toolbar">
        <div className="lockers-table__search">
          <Search
            size={17}
            strokeWidth={2}
            className="lockers-table__search-icon"
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
            className="lockers-table__search-input"
            placeholder="Buscar locker o ubicación"
            aria-label="Buscar lockers"
          />
        </div>

        <div className="lockers-table__count">
          <strong>
            {total}
          </strong>

          <span>
            {total === 1
              ? "isla"
              : "islas"}
          </span>
        </div>
      </div>


      {/* ===================================================
          TABLE
          =================================================== */}
      <div className="lockers-table__scroll">
        <table className="lockers-table__content">
          <thead>
            <tr>
              <th>
                Locker / Isla
              </th>

              <th>
                Ubicación
              </th>

              <th>
                Compartimentos
              </th>

              <th>
                Empleados asignados
              </th>

              <th>
                Disponibles
              </th>

              <th>
                Estado
              </th>

              <th className="lockers-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {loads.map(
              ({
                locker,
                assigned,
                available,
                percent,
              }) => (
                <tr
                  key={
                    locker.id
                  }
                >
                  {/* LOCKER */}
                  <td>
                    <div className="lockers-table__locker">
                      <strong>
                        {
                          locker.alias
                        }
                      </strong>

                      <div className="lockers-table__occupancy">
                        <div className="lockers-table__occupancy-track">
                          <div
                            className="lockers-table__occupancy-value"
                            style={{
                              width: `${Math.min(
                                percent,
                                100,
                              )}%`,
                            }}
                          />
                        </div>

                        <span>
                          {
                            percent
                          }
                          %
                        </span>
                      </div>
                    </div>
                  </td>


                  {/* LOCATION */}
                  <td>
                    <span className="lockers-table__location">
                      {
                        locker.location
                      }
                    </span>
                  </td>


                  {/* CAPACITY */}
                  <td>
                    <span className="lockers-table__number">
                      {
                        locker.compartments
                      }
                    </span>
                  </td>


                  {/* ASSIGNED */}
                  <td>
                    <span className="lockers-table__number">
                      {
                        assigned
                      }
                    </span>
                  </td>


                  {/* AVAILABLE */}
                  <td>
                    <span
                      className={`
                        lockers-table__available

                        ${
                          available <=
                          15
                            ? "lockers-table__available--low"
                            : ""
                        }
                      `}
                    >
                      {
                        available
                      }
                    </span>
                  </td>


                  {/* STATUS */}
                  <td>
                    <StatusBadge
                      active={
                        locker.active
                      }
                    />
                  </td>


                  {/* ACTION */}
                  <td className="lockers-table__action">
                    <button
                      type="button"
                      className="lockers-table__edit"
                      onClick={() => {
                        onEdit(
                          locker,
                        );
                      }}
                      aria-label={`Editar ${locker.alias}`}
                      title="Editar locker"
                    >
                      <Pencil
                        size={16}
                        strokeWidth={2}
                      />
                    </button>
                  </td>
                </tr>
              ),
            )}


            {!loads.length ? (
              <tr>
                <td
                  colSpan={
                    7
                  }
                  className="lockers-table__empty"
                >
                  <div>
                    <strong>
                      No se encontraron lockers
                    </strong>

                    <p>
                      Intenta cambiar el término de búsqueda.
                    </p>
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