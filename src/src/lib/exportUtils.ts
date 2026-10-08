import * as XLSX from "xlsx";

/**
 * Export an array of objects as a CSV/Excel file download.
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  headers: { key: string; label: string }[],
  filename: string
) {
  const rows = data.map((row) =>
    headers.reduce((acc, h) => {
      acc[h.label] = row[h.key] ?? "";
      return acc;
    }, {} as Record<string, unknown>)
  );

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Parse an uploaded Excel/CSV file and return rows as objects.
 * Returns the first sheet's data.
 */
export function parseExcelFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Download a ready-to-fill template for the units bulk import.
 * The first sheet is intentionally empty (except for the required header) so
 * example values are never imported by accident.
 */
export function downloadUnitsImportTemplate(language: "es" | "en" = "es") {
  const isEnglish = language === "en";

  const unitsSheet = XLSX.utils.aoa_to_sheet([[isEnglish ? "Unit" : "Unidad"]]);
  unitsSheet["!cols"] = [{ wch: 28 }];

  const instructions = isEnglish
    ? [
        ["UNITS IMPORT TEMPLATE"],
        [""],
        ["Required column", "Unit"],
        ["How to use", "Enter one unit per row in the Units sheet."],
        ["Accepted examples", "AIM101, 1000, TH 7, A-101"],
        ["Rules", "Letters, numbers, spaces and hyphens are allowed."],
        ["Important", "Do not rename the Unit column."],
      ]
    : [
        ["PLANTILLA DE IMPORTACIÓN DE UNIDADES"],
        [""],
        ["Columna obligatoria", "Unidad"],
        ["Cómo usarla", "Captura una unidad por fila en la hoja Unidades."],
        ["Ejemplos permitidos", "AIM101, 1000, TH 7, A-101"],
        ["Reglas", "Se permiten letras, números, espacios y guiones."],
        ["Importante", "No cambies el nombre de la columna Unidad."],
      ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
  instructionsSheet["!cols"] = [{ wch: 24 }, { wch: 62 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, unitsSheet, isEnglish ? "Units" : "Unidades");
  XLSX.utils.book_append_sheet(
    workbook,
    instructionsSheet,
    isEnglish ? "Instructions" : "Instrucciones",
  );

  XLSX.writeFile(
    workbook,
    isEnglish ? "units-import-template.xlsx" : "plantilla-importacion-unidades.xlsx",
  );
}

