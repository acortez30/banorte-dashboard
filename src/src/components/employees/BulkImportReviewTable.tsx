import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  Pencil,
} from "lucide-react";

import type {
  BulkImportDraftRow,
} from "@/types/bulkImport";

import "@/styles/employees/BulkImportReviewTable.css";

interface BulkImportReviewTableProps {
  rows: BulkImportDraftRow[];

  onEdit: (
    row: BulkImportDraftRow,
  ) => void;
}

export default function BulkImportReviewTable({
  rows,
  onEdit,
}: BulkImportReviewTableProps) {
  return (
    <section className="bulk-review-table">
      <div className="bulk-review-table__scroll">
        <table>
          <thead>
            <tr>
              <th>
                Fila
              </th>

              <th>
                Nombre
              </th>

              <th>
                Teléfono
              </th>

              <th>
                No. empleado
              </th>

              <th>
                No. gafete
              </th>

              <th>
                Estado
              </th>

              <th className="bulk-review-table__action-heading">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map(
              (row) => (
                <tr
                  key={
                    row.id
                  }
                  className={`
                    ${
                      row.status ===
                      "invalid"
                        ? "bulk-review-table__row--invalid"
                        : ""
                    }

                    ${
                      row.status ===
                      "imported"
                        ? "bulk-review-table__row--imported"
                        : ""
                    }
                  `}
                >
                  <td>
                    <span className="bulk-review-table__row-number">
                      {
                        row.sourceRow
                      }
                    </span>
                  </td>

                  <td>
                    <div className="bulk-review-table__value">
                      {
                        row.name ||
                        "—"
                      }

                      {row.errors.name ? (
                        <small>
                          {
                            row.errors.name
                          }
                        </small>
                      ) : null}
                    </div>
                  </td>

                  <td>
                    <div className="bulk-review-table__value">
                      {
                        row.phone ||
                        "—"
                      }

                      {row.errors.phone ? (
                        <small>
                          {
                            row.errors.phone
                          }
                        </small>
                      ) : null}
                    </div>
                  </td>

                  <td>
                    <div className="bulk-review-table__value">
                      {
                        row.employeeNumber ||
                        "—"
                      }

                      {row.errors
                        .employeeNumber ? (
                        <small>
                          {
                            row
                              .errors
                              .employeeNumber
                          }
                        </small>
                      ) : null}
                    </div>
                  </td>

                  <td>
                    <div className="bulk-review-table__value">
                      {
                        row.badgeNumber ||
                        "—"
                      }

                      {row.errors
                        .badgeNumber ? (
                        <small>
                          {
                            row
                              .errors
                              .badgeNumber
                          }
                        </small>
                      ) : null}
                    </div>
                  </td>

                  <td>
                    {row.status ===
                    "valid" ? (
                      <span className="bulk-review-table__status bulk-review-table__status--valid">
                        <CheckCircle2
                          size={13}
                        />

                        Listo
                      </span>
                    ) : null}

                    {row.status ===
                    "invalid" ? (
                      <span className="bulk-review-table__status bulk-review-table__status--invalid">
                        <AlertTriangle
                          size={13}
                        />

                        Requiere corrección
                      </span>
                    ) : null}

                    {row.status ===
                    "importing" ? (
                      <span className="bulk-review-table__status bulk-review-table__status--loading">
                        <LoaderCircle
                          size={13}
                          className="bulk-review-table__spinner"
                        />

                        Importando
                      </span>
                    ) : null}

                    {row.status ===
                    "imported" ? (
                      <span className="bulk-review-table__status bulk-review-table__status--imported">
                        <CheckCircle2
                          size={13}
                        />

                        Importado
                      </span>
                    ) : null}
                  </td>

                  <td className="bulk-review-table__action">
                    {row.status ===
                      "valid" ||
                    row.status ===
                      "invalid" ? (
                      <button
                        type="button"
                        className="bulk-review-table__edit"
                        onClick={() =>
                          onEdit(
                            row,
                          )
                        }
                        aria-label={`Editar fila ${row.sourceRow}`}
                        title="Editar registro"
                      >
                        <Pencil
                          size={15}
                        />
                      </button>
                    ) : (
                      <span className="bulk-review-table__no-action">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ),
            )}

            {!rows.length ? (
              <tr>
                <td
                  colSpan={
                    7
                  }
                  className="bulk-review-table__empty"
                >
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