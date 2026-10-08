import {
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  Pencil,
} from "lucide-react";

import SortableTableHeader from "@/components/common/SortableTableHeader";

import type {
  BulkImportDraftRow,
} from "@/types/bulkImport";
import {
  sortRows,
  type SortDirection,
} from "@/utils/tableSort";

import "@/styles/employees/BulkImportReviewTable.css";

type BulkSortKey =
  | "sourceRow"
  | "name"
  | "phone"
  | "employeeNumber"
  | "badgeNumber"
  | "status";

interface BulkImportReviewTableProps {
  rows: BulkImportDraftRow[];
  onEdit: (row: BulkImportDraftRow) => void;
}

const statusLabels = {
  valid: "Listo",
  invalid: "Requiere corrección",
  importing: "Importando",
  imported: "Importado",
} as const;

export default function BulkImportReviewTable({
  rows,
  onEdit,
}: BulkImportReviewTableProps) {
  const [sortKey, setSortKey] = useState<BulkSortKey>("sourceRow");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedRows = useMemo(
    () =>
      sortRows(
        rows,
        sortKey,
        sortDirection,
        {
          sourceRow: (row) => row.sourceRow,
          name: (row) => row.name,
          phone: (row) => row.phone,
          employeeNumber: (row) => row.employeeNumber,
          badgeNumber: (row) => row.badgeNumber,
          status: (row) => statusLabels[row.status],
        },
      ),
    [rows, sortDirection, sortKey],
  );

  const handleSort = (key: BulkSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  return (
    <section className="bulk-review-table">
      <div className="bulk-review-table__scroll">
        <table>
          <thead>
            <tr>
              <SortableTableHeader
                label="Fila"
                active={sortKey === "sourceRow"}
                direction={sortDirection}
                onSort={() => handleSort("sourceRow")}
              />
              <SortableTableHeader
                label="Nombre"
                active={sortKey === "name"}
                direction={sortDirection}
                onSort={() => handleSort("name")}
              />
              <SortableTableHeader
                label="Teléfono"
                active={sortKey === "phone"}
                direction={sortDirection}
                onSort={() => handleSort("phone")}
              />
              <SortableTableHeader
                label="No. empleado"
                active={sortKey === "employeeNumber"}
                direction={sortDirection}
                onSort={() => handleSort("employeeNumber")}
              />
              <SortableTableHeader
                label="No. gafete"
                active={sortKey === "badgeNumber"}
                direction={sortDirection}
                onSort={() => handleSort("badgeNumber")}
              />
              <SortableTableHeader
                label="Estado"
                active={sortKey === "status"}
                direction={sortDirection}
                onSort={() => handleSort("status")}
              />
              <th className="bulk-review-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row) => (
              <tr
                key={row.id}
                className={`
                  ${row.status === "invalid" ? "bulk-review-table__row--invalid" : ""}
                  ${row.status === "imported" ? "bulk-review-table__row--imported" : ""}
                `}
              >
                <td>
                  <span className="bulk-review-table__row-number">
                    {row.sourceRow}
                  </span>
                </td>

                <td>
                  <div className="bulk-review-table__value">
                    {row.name || "—"}
                    {row.errors.name ? <small>{row.errors.name}</small> : null}
                  </div>
                </td>

                <td>
                  <div className="bulk-review-table__value">
                    {row.phone || "—"}
                    {row.errors.phone ? <small>{row.errors.phone}</small> : null}
                  </div>
                </td>

                <td>
                  <div className="bulk-review-table__value">
                    {row.employeeNumber || "—"}
                    {row.errors.employeeNumber ? <small>{row.errors.employeeNumber}</small> : null}
                  </div>
                </td>

                <td>
                  <div className="bulk-review-table__value">
                    {row.badgeNumber || "—"}
                    {row.errors.badgeNumber ? <small>{row.errors.badgeNumber}</small> : null}
                  </div>
                </td>

                <td>
                  {row.status === "valid" ? (
                    <span className="bulk-review-table__status bulk-review-table__status--valid">
                      <CheckCircle2 size={13} /> Listo
                    </span>
                  ) : null}

                  {row.status === "invalid" ? (
                    <span className="bulk-review-table__status bulk-review-table__status--invalid">
                      <AlertTriangle size={13} /> Requiere corrección
                    </span>
                  ) : null}

                  {row.status === "importing" ? (
                    <span className="bulk-review-table__status bulk-review-table__status--loading">
                      <LoaderCircle size={13} className="bulk-review-table__spinner" /> Importando
                    </span>
                  ) : null}

                  {row.status === "imported" ? (
                    <span className="bulk-review-table__status bulk-review-table__status--imported">
                      <CheckCircle2 size={13} /> Importado
                    </span>
                  ) : null}
                </td>

                <td className="bulk-review-table__action">
                  {row.status === "valid" || row.status === "invalid" ? (
                    <button
                      type="button"
                      className="bulk-review-table__edit"
                      onClick={() => onEdit(row)}
                      aria-label={`Editar fila ${row.sourceRow}`}
                      title="Editar registro"
                    >
                      <Pencil size={15} />
                    </button>
                  ) : (
                    <span className="bulk-review-table__no-action">—</span>
                  )}
                </td>
              </tr>
            ))}

            {!sortedRows.length ? (
              <tr>
                <td colSpan={7} className="bulk-review-table__empty">
                  No hay registros en este filtro.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
