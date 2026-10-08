import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";

import * as XLSX from "xlsx";

import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Upload,
  UsersRound,
} from "lucide-react";

import Dialog from "@/components/common/Dialog";
import Button from "@/components/common/Button";

import BulkImportReviewTable from "@/components/employees/BulkImportReviewTable";
import BulkImportRowDialog from "@/components/employees/BulkImportRowDialog";

import type {
  Employee,
  EmployeeImportRow,
  LockerIsland,
} from "@/types/dashboard";

import type {
  BulkImportDraftRow,
  BulkImportRowErrors,
} from "@/types/bulkImport";

import {
  requiredLockers,
} from "@/utils/lockerAssignment";

import "@/styles/employees/BulkImportDialog.css";


type ReviewFilter =
  | "all"
  | "valid"
  | "invalid"
  | "imported";

interface BulkImportDialogProps {
  open: boolean;

  onClose: () => void;

  lockers: LockerIsland[];
  employees: Employee[];

  onImport: (
    rows: EmployeeImportRow[],
  ) =>
    | {
        ok: true;
        created: number;
      }
    | {
        ok: false;
        error: string;
      };
}


/* =========================================================
   FILE HELPERS
   ========================================================= */

const normalizeValue = (
  value: unknown,
) =>
  String(
    value ?? "",
  ).trim();

const normalizeHeader = (
  value: string,
) =>
  value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[\s_-]/g,
      "",
    );

function pick(
  row: Record<string, unknown>,
  keys: string[],
) {
  const normalizedEntries =
    Object.entries(
      row,
    ).map(
      ([
        key,
        value,
      ]) =>
        [
          normalizeHeader(
            key,
          ),
          value,
        ] as const,
    );

  for (
    const key of keys
  ) {
    const normalizedKey =
      normalizeHeader(
        key,
      );

    const found =
      normalizedEntries.find(
        ([
          current,
        ]) =>
          current ===
          normalizedKey,
      );

    if (found) {
      return normalizeValue(
        found[1],
      );
    }
  }

  return "";
}


/* =========================================================
   VALIDATION
   ========================================================= */

function validateRows(
  rows: BulkImportDraftRow[],
  employees: Employee[],
): BulkImportDraftRow[] {
  const existingEmployeeNumbers =
    new Set(
      employees.map(
        (employee) =>
          employee.employeeNumber
            .trim()
            .toLowerCase(),
      ),
    );

  const existingBadges =
    new Set(
      employees.map(
        (employee) =>
          employee.badgeNumber
            .trim()
            .toLowerCase(),
      ),
    );

  const pendingRows =
    rows.filter(
      (row) =>
        row.status !==
          "imported" &&
        row.status !==
          "importing",
    );

  const employeeNumberCount =
    new Map<string, number>();

  const badgeCount =
    new Map<string, number>();

  pendingRows.forEach(
    (row) => {
      const employeeNumber =
        row.employeeNumber
          .trim()
          .toLowerCase();

      const badgeNumber =
        row.badgeNumber
          .trim()
          .toLowerCase();

      if (employeeNumber) {
        employeeNumberCount.set(
          employeeNumber,
          (
            employeeNumberCount.get(
              employeeNumber,
            ) ?? 0
          ) + 1,
        );
      }

      if (badgeNumber) {
        badgeCount.set(
          badgeNumber,
          (
            badgeCount.get(
              badgeNumber,
            ) ?? 0
          ) + 1,
        );
      }
    },
  );

  return rows.map(
    (row) => {
      if (
        row.status ===
          "imported" ||
        row.status ===
          "importing"
      ) {
        return row;
      }

      const errors:
        BulkImportRowErrors =
        {};

      const normalizedPhone =
        row.phone.replace(
          /\D/g,
          "",
        );

      const normalizedEmployeeNumber =
        row.employeeNumber
          .trim()
          .toLowerCase();

      const normalizedBadge =
        row.badgeNumber
          .trim()
          .toLowerCase();

      if (
        row.name.trim()
          .length < 3
      ) {
        errors.name =
          "Ingresa un nombre válido.";
      }

      if (
        !/^\d{10}$/.test(
          normalizedPhone,
        )
      ) {
        errors.phone =
          "Debe contener 10 dígitos.";
      }

      if (
        !row.employeeNumber.trim()
      ) {
        errors.employeeNumber =
          "El número de empleado es obligatorio.";
      } else if (
        existingEmployeeNumbers.has(
          normalizedEmployeeNumber,
        )
      ) {
        errors.employeeNumber =
          "Este número de empleado ya existe.";
      } else if (
        (
          employeeNumberCount.get(
            normalizedEmployeeNumber,
          ) ?? 0
        ) > 1
      ) {
        errors.employeeNumber =
          "Está repetido dentro del archivo.";
      }

      if (
        !row.badgeNumber.trim()
      ) {
        errors.badgeNumber =
          "El número de gafete es obligatorio.";
      } else if (
        existingBadges.has(
          normalizedBadge,
        )
      ) {
        errors.badgeNumber =
          "Este número de gafete ya existe.";
      } else if (
        (
          badgeCount.get(
            normalizedBadge,
          ) ?? 0
        ) > 1
      ) {
        errors.badgeNumber =
          "Está repetido dentro del archivo.";
      }

      return {
        ...row,

        phone:
          normalizedPhone,

        errors,

        status:
          Object.keys(
            errors,
          ).length > 0
            ? "invalid"
            : "valid",
      };
    },
  );
}


/* =========================================================
   COMPONENT
   ========================================================= */

export default function BulkImportDialog({
  open,
  onClose,

  lockers,
  employees,

  onImport,
}: BulkImportDialogProps) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const cleanupTimerRef =
    useRef<number | null>(
      null,
    );

  const [
    rows,
    setRows,
  ] =
    useState<
      BulkImportDraftRow[]
    >([]);

  const [
    filter,
    setFilter,
  ] =
    useState<ReviewFilter>(
      "all",
    );

  const [
    fileName,
    setFileName,
  ] = useState("");

  const [
    fileSize,
    setFileSize,
  ] = useState(0);

  const [
    fileError,
    setFileError,
  ] = useState("");

  const [
    serverError,
    setServerError,
  ] = useState("");

  const [
    dragging,
    setDragging,
  ] = useState(false);

  const [
    editingRow,
    setEditingRow,
  ] =
    useState<
      BulkImportDraftRow | null
    >(null);

  const [
    successCount,
    setSuccessCount,
  ] = useState(0);


  /* =======================================================
     CLEANUP TIMER
     ======================================================= */

  useEffect(() => {
    return () => {
      if (
        cleanupTimerRef.current
      ) {
        window.clearTimeout(
          cleanupTimerRef.current,
        );
      }
    };
  }, []);


  /* =======================================================
     DERIVED DATA
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

  const activeCapacity =
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

  const validRows =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            row.status ===
            "valid",
        ),
      [rows],
    );

  const invalidRows =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            row.status ===
            "invalid",
        ),
      [rows],
    );

  const importedRows =
    useMemo(
      () =>
        rows.filter(
          (row) =>
            row.status ===
              "imported" ||
            row.status ===
              "importing",
        ),
      [rows],
    );

  const pendingRows =
    rows.filter(
      (row) =>
        row.status !==
        "imported",
    );

  const projectedAll =
    employees.length +
    pendingRows.length;

  const projectedImport =
    employees.length +
    validRows.length;

  const capacityForImport =
    projectedImport <=
    activeCapacity;

  const required =
    requiredLockers(
      projectedAll,
    );

  const additionalRequired =
    Math.max(
      required -
        activeLockers.length,
      0,
    );

  const projectedOccupancy =
    activeCapacity > 0
      ? Math.min(
          100,
          Math.round(
            (
              projectedAll /
              activeCapacity
            ) *
              100,
          ),
        )
      : 0;

  const filteredRows =
    useMemo(
      () => {
        switch (filter) {
          case "valid":
            return rows.filter(
              (row) =>
                row.status ===
                "valid",
            );

          case "invalid":
            return rows.filter(
              (row) =>
                row.status ===
                "invalid",
            );

          case "imported":
            return rows.filter(
              (row) =>
                row.status ===
                  "imported" ||
                row.status ===
                  "importing",
            );

          default:
            return rows;
        }
      },
      [
        filter,
        rows,
      ],
    );


  /* =======================================================
     RESET
     ======================================================= */

  const reset = () => {
    if (
      cleanupTimerRef.current
    ) {
      window.clearTimeout(
        cleanupTimerRef.current,
      );

      cleanupTimerRef.current =
        null;
    }

    setRows([]);

    setFilter(
      "all",
    );

    setFileName("");

    setFileSize(0);

    setFileError("");

    setServerError("");

    setDragging(false);

    setEditingRow(null);

    setSuccessCount(0);

    if (
      inputRef.current
    ) {
      inputRef.current.value =
        "";
    }
  };

  const close = () => {
    reset();

    onClose();
  };


  /* =======================================================
     FILE
     ======================================================= */

  const handleFile =
    async (
      file?: File,
    ) => {
      if (!file) {
        return;
      }

      reset();

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase();

      if (
        !extension ||
        ![
          "xlsx",
          "xls",
          "csv",
        ].includes(
          extension,
        )
      ) {
        setFileError(
          "Selecciona un archivo XLSX, XLS o CSV.",
        );

        return;
      }

      setFileName(
        file.name,
      );

      setFileSize(
        file.size,
      );

      try {
        const buffer =
          await file.arrayBuffer();

        const workbook =
          XLSX.read(
            buffer,
            {
              type: "array",
            },
          );

        const sheetName =
          workbook
            .SheetNames[0];

        if (!sheetName) {
          setFileError(
            "El archivo no contiene hojas para importar.",
          );

          return;
        }

        const sheet =
          workbook.Sheets[
            sheetName
          ];

        const rawRows =
          XLSX.utils.sheet_to_json<
            Record<
              string,
              unknown
            >
          >(
            sheet,
            {
              defval: "",
            },
          );

        if (
          rawRows.length ===
          0
        ) {
          setFileError(
            "El archivo no contiene registros.",
          );

          return;
        }

        const drafts:
          BulkImportDraftRow[] =
          rawRows.map(
            (
              row,
              index,
            ) => ({
              id:
                `import-row-${
                  index + 2
                }`,

              sourceRow:
                index + 2,

              name:
                pick(
                  row,
                  [
                    "nombre",
                    "name",
                    "nombre completo",
                  ],
                ),

              phone:
                pick(
                  row,
                  [
                    "telefono",
                    "teléfono",
                    "phone",
                    "celular",
                  ],
                ).replace(
                  /\D/g,
                  "",
                ),

              employeeNumber:
                pick(
                  row,
                  [
                    "numero de empleado",
                    "número de empleado",
                    "numeroempleado",
                    "empleado",
                    "employeenumber",
                  ],
                ),

              badgeNumber:
                pick(
                  row,
                  [
                    "numero de gafete",
                    "número de gafete",
                    "numerogafete",
                    "gafete",
                    "badgenumber",
                  ],
                ),

              status:
                "valid",

              errors: {},
            }),
          );

        setRows(
          validateRows(
            drafts,
            employees,
          ),
        );
      } catch {
        setFileError(
          "No fue posible leer el archivo. Verifica que el archivo no esté dañado.",
        );
      }
    };


  /* =======================================================
     DRAG
     ======================================================= */

  const handleDragOver = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setDragging(
      true,
    );
  };

  const handleDragLeave = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setDragging(
      false,
    );
  };

  const handleDrop = (
    event:
      DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    setDragging(
      false,
    );

    void handleFile(
      event.dataTransfer
        .files?.[0],
    );
  };


  /* =======================================================
     TEMPLATE
     ======================================================= */

  const downloadTemplate =
    () => {
      const worksheet =
        XLSX.utils.json_to_sheet(
          [
            {
              Nombre:
                "Empleado Ejemplo",

              Telefono:
                "5512345678",

              Numero_de_empleado:
                "BN20001",

              Numero_de_gafete:
                "GF80001",
            },
          ],
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Empleados",
      );

      XLSX.writeFile(
        workbook,
        "plantilla_empleados_banorte.xlsx",
      );
    };


  /* =======================================================
     EDIT ROW
     ======================================================= */

  const handleSaveRow = (
    id: string,
    value: EmployeeImportRow,
  ) => {
    setRows(
      (current) =>
        validateRows(
          current.map(
            (row) =>
              row.id === id
                ? {
                    ...row,

                    name:
                      value.name.trim(),

                    phone:
                      value.phone.replace(
                        /\D/g,
                        "",
                      ),

                    employeeNumber:
                      value.employeeNumber.trim(),

                    badgeNumber:
                      value.badgeNumber.trim(),

                    status:
                      "valid",

                    errors: {},
                  }
                : row,
          ),
          employees,
        ),
    );

    setEditingRow(
      null,
    );

    setServerError("");
  };


  /* =======================================================
     IMPORT
     ======================================================= */

  const submit = () => {
    if (
      validRows.length ===
        0 ||
      !capacityForImport
    ) {
      return;
    }

    setServerError("");

    const ids =
      new Set(
        validRows.map(
          (row) =>
            row.id,
        ),
      );

    setRows(
      (current) =>
        current.map(
          (row) =>
            ids.has(
              row.id,
            )
              ? {
                  ...row,
                  status:
                    "importing",
                }
              : row,
        ),
    );

    const result =
      onImport(
        validRows.map(
          (row) => ({
            name:
              row.name,

            phone:
              row.phone,

            employeeNumber:
              row.employeeNumber,

            badgeNumber:
              row.badgeNumber,
          }),
        ),
      );

    if (result.ok === false) {
      setRows(
        (current) =>
          current.map(
            (row) =>
              ids.has(
                row.id,
              )
                ? {
                    ...row,
                    status:
                      "valid",
                  }
                : row,
          ),
      );

      setServerError(
        result.error,
      );

      return;
    }

    setSuccessCount(
      result.created,
    );

    setRows(
      (current) =>
        current.map(
          (row) =>
            ids.has(
              row.id,
            )
              ? {
                  ...row,
                  status:
                    "imported",
                  errors: {},
                }
              : row,
        ),
    );

    setFilter(
      "all",
    );

    if (
      cleanupTimerRef.current
    ) {
      window.clearTimeout(
        cleanupTimerRef.current,
      );
    }

    cleanupTimerRef.current =
      window.setTimeout(
        () => {
          setRows(
            (current) =>
              current.filter(
                (row) =>
                  row.status !==
                  "imported",
              ),
          );

          cleanupTimerRef.current =
            null;
        },
        4000,
      );
  };


  /* =======================================================
     FILE SIZE
     ======================================================= */

  const formattedFileSize =
    fileSize > 0
      ? fileSize >=
        1024 * 1024
        ? `${(
            fileSize /
            1024 /
            1024
          ).toFixed(
            1,
          )} MB`
        : `${Math.max(
            1,
            Math.round(
              fileSize /
                1024,
            ),
          )} KB`
      : "";


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      <Dialog
        open={
          open
        }
        onClose={
          close
        }
        title="Alta masiva de empleados"
        description="Carga, valida y corrige los empleados antes de incorporarlos al sistema."
        width="max-w-5xl"
        panelClassName="bulk-import-dialog"
        footer={
          <div className="bulk-import__footer">
            <Button
              variant="secondary"
              onClick={
                close
              }
            >
              Cerrar
            </Button>

            <Button
              variant="primary"
              icon={
                Upload
              }
              disabled={
                validRows.length ===
                  0 ||
                !capacityForImport
              }
              onClick={
                submit
              }
            >
              {validRows.length
                ? `Importar ${validRows.length} empleados`
                : "Importar empleados"}
            </Button>
          </div>
        }
      >
        <div className="bulk-import">
          {/* ===============================================
              FILE
              =============================================== */}
          <section className="bulk-import__file-section">
            <input
              ref={
                inputRef
              }
              type="file"
              accept=".xlsx,.xls,.csv"
              className="bulk-import__hidden-input"
              onChange={(
                event,
              ) => {
                void handleFile(
                  event
                    .target
                    .files?.[0],
                );
              }}
            />

            <div
              className={`
                bulk-import__file-card

                ${
                  dragging
                    ? "bulk-import__file-card--dragging"
                    : ""
                }
              `}
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={
                handleDrop
              }
            >
              <div className="bulk-import__file-icon">
                <FileSpreadsheet
                  size={21}
                  strokeWidth={2}
                />
              </div>

              <div className="bulk-import__file-content">
                <strong>
                  {fileName ||
                    "Selecciona el archivo de empleados"}
                </strong>

                <p>
                  {fileName
                    ? `${formattedFileSize} · ${rows.length} filas detectadas`
                    : "XLSX, XLS o CSV · También puedes arrastrar el archivo aquí"}
                </p>
              </div>

              <Button
                variant={
                  fileName
                    ? "secondary"
                    : "primary"
                }
                icon={
                  Upload
                }
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                {fileName
                  ? "Cambiar archivo"
                  : "Seleccionar archivo"}
              </Button>

              <Button
                variant="secondary"
                icon={
                  Download
                }
                onClick={
                  downloadTemplate
                }
              >
                Plantilla
              </Button>
            </div>

            {fileError ? (
              <div className="bulk-import__message bulk-import__message--error">
                <AlertTriangle
                  size={16}
                />

                <span>
                  {fileError}
                </span>
              </div>
            ) : null}
          </section>


          {/* ===============================================
              SUMMARY
              =============================================== */}
          {fileName &&
          rows.length >
            0 ? (
            <>
              <section className="bulk-import__summary">
                <article className="bulk-import__summary-card bulk-import__summary-card--success">
                  <span>
                    Listos para importar
                  </span>

                  <strong>
                    {
                      validRows.length
                    }
                  </strong>
                </article>

                <article className="bulk-import__summary-card bulk-import__summary-card--warning">
                  <span>
                    Requieren atención
                  </span>

                  <strong>
                    {
                      invalidRows.length
                    }
                  </strong>
                </article>

                <article className="bulk-import__summary-card">
                  <span>
                    Islas activas
                  </span>

                  <strong>
                    {
                      activeLockers.length
                    }
                  </strong>
                </article>

                <article className="bulk-import__summary-card">
                  <span>
                    Capacidad proyectada
                  </span>

                  <strong>
                    {
                      projectedOccupancy
                    }
                    %
                  </strong>
                </article>
              </section>

              <section className="bulk-import__capacity">
                <div className="bulk-import__capacity-heading">
                  <div>
                    <Boxes
                      size={15}
                    />

                    <span>
                      Capacidad después de corregir e importar toda la cola
                    </span>
                  </div>

                  <strong>
                    {
                      projectedAll
                    }{" "}
                    /{" "}
                    {
                      activeCapacity
                    }
                  </strong>
                </div>

                <div className="bulk-import__capacity-track">
                  <div
                    className={`
                      bulk-import__capacity-value

                      ${
                        projectedAll >
                        activeCapacity
                          ? "bulk-import__capacity-value--danger"
                          : ""
                      }
                    `}
                    style={{
                      width: `${projectedOccupancy}%`,
                    }}
                  />
                </div>
              </section>


              {/* =============================================
                  SUCCESS
                  ============================================= */}
              {successCount >
              0 ? (
                <div className="bulk-import__message bulk-import__message--success">
                  <CheckCircle2
                    size={17}
                  />

                  <div>
                    <strong>
                      {
                        successCount
                      }{" "}
                      empleados importados
                    </strong>

                    <p>
                      Los registros completados se ocultarán automáticamente en unos segundos.
                    </p>
                  </div>
                </div>
              ) : null}


              {/* =============================================
                  CAPACITY WARNING
                  ============================================= */}
              {additionalRequired >
              0 ? (
                <div className="bulk-import__message bulk-import__message--warning">
                  <AlertTriangle
                    size={17}
                  />

                  <div>
                    <strong>
                      Capacidad futura insuficiente
                    </strong>

                    <p>
                      Si se corrigen e importan todos los registros,
                      se requerirán{" "}
                      {
                        additionalRequired
                      }{" "}
                      isla
                      {additionalRequired ===
                      1
                        ? ""
                        : "s"}{" "}
                      adicional
                      {additionalRequired ===
                      1
                        ? ""
                        : "es"}
                      .
                    </p>
                  </div>
                </div>
              ) : null}


              {/* =============================================
                  TABS
                  ============================================= */}
              <nav className="bulk-import__tabs">
                <button
                  type="button"
                  className={
                    filter ===
                    "all"
                      ? "bulk-import__tab bulk-import__tab--active"
                      : "bulk-import__tab"
                  }
                  onClick={() =>
                    setFilter(
                      "all",
                    )
                  }
                >
                  Todos
                  <span>
                    {
                      rows.length
                    }
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    filter ===
                    "valid"
                      ? "bulk-import__tab bulk-import__tab--active"
                      : "bulk-import__tab"
                  }
                  onClick={() =>
                    setFilter(
                      "valid",
                    )
                  }
                >
                  Listos
                  <span>
                    {
                      validRows.length
                    }
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    filter ===
                    "invalid"
                      ? "bulk-import__tab bulk-import__tab--active"
                      : "bulk-import__tab"
                  }
                  onClick={() =>
                    setFilter(
                      "invalid",
                    )
                  }
                >
                  Requieren atención
                  <span>
                    {
                      invalidRows.length
                    }
                  </span>
                </button>

                {importedRows.length >
                0 ? (
                  <button
                    type="button"
                    className={
                      filter ===
                      "imported"
                        ? "bulk-import__tab bulk-import__tab--active"
                        : "bulk-import__tab"
                    }
                    onClick={() =>
                      setFilter(
                        "imported",
                      )
                    }
                  >
                    Importados
                    <span>
                      {
                        importedRows.length
                      }
                    </span>
                  </button>
                ) : null}
              </nav>


              {/* =============================================
                  TABLE
                  ============================================= */}
              <BulkImportReviewTable
                rows={
                  filteredRows
                }
                onEdit={
                  setEditingRow
                }
              />
            </>
          ) : null}


          {/* ===============================================
              COMPLETE STATE
              =============================================== */}
          {fileName &&
          rows.length ===
            0 &&
          successCount >
            0 ? (
            <div className="bulk-import__complete">
              <div className="bulk-import__complete-icon">
                <CheckCircle2
                  size={26}
                />
              </div>

              <strong>
                Importación completada
              </strong>

              <p>
                Los empleados válidos fueron incorporados correctamente.
              </p>
            </div>
          ) : null}


          {/* ===============================================
              SERVER ERROR
              =============================================== */}
          {serverError ? (
            <div className="bulk-import__message bulk-import__message--error">
              <AlertTriangle
                size={17}
              />

              <span>
                {
                  serverError
                }
              </span>
            </div>
          ) : null}


          {/* ===============================================
              BALANCE NOTE
              =============================================== */}
          {validRows.length >
          0 ? (
            <div className="bulk-import__balance-note">
              <UsersRound
                size={15}
              />

              <span>
                La asignación comenzará por las islas con menor número de empleados.
              </span>
            </div>
          ) : null}
        </div>
      </Dialog>


      {/* ===================================================
          ROW EDITOR
          =================================================== */}
      <BulkImportRowDialog
        open={
          Boolean(
            editingRow,
          )
        }
        row={
          editingRow
        }
        onClose={() =>
          setEditingRow(
            null,
          )
        }
        onSave={
          handleSaveRow
        }
      />
    </>
  );
}