import type {
  ConvertedTemplate,
  PlacedCell,
  TemplateCell,
} from "@/types/Locker.types"

import { FIELD_LABELS, WIZARD_STEPS } from "./locker-create.config"
import type {
  LockerFormState,
  StepValidationResult,
} from "./locker-create.types"

export function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  return path.split(".").reduce((current: unknown, key) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim().length === 0
  return false
}

function isValidCoordinate(value: string, min: number, max: number): boolean {
  if (!value.trim()) return false
  const number = Number(value)
  return Number.isFinite(number) && number >= min && number <= max
}

export function validateStep(
  step: number,
  form: LockerFormState,
): StepValidationResult {
  const stepConfig = WIZARD_STEPS.find((item) => item.id === step)

  if (!stepConfig) {
    return { isValid: false, missingFields: [], invalidFields: [] }
  }

  const missingFields: string[] = []
  const invalidFields: string[] = []

  for (const field of stepConfig.requiredFields) {
    const value = getNestedValue(
      form as unknown as Record<string, unknown>,
      field,
    )

    if (isEmptyValue(value)) {
      missingFields.push(field)
    }
  }

  if (step === 3) {
    if (
      !missingFields.includes("latitud") &&
      !isValidCoordinate(form.latitud, -90, 90)
    ) {
      invalidFields.push("latitud")
    }

    if (
      !missingFields.includes("longitud") &&
      !isValidCoordinate(form.longitud, -180, 180)
    ) {
      invalidFields.push("longitud")
    }
  }

  return {
    isValid: missingFields.length === 0 && invalidFields.length === 0,
    missingFields,
    invalidFields,
  }
}

export function getValidationMessage(result: StepValidationResult): string {
  if (result.missingFields.length) {
    const fields = result.missingFields.map(
      (field) => FIELD_LABELS[field] ?? field,
    )
    return `Completa los campos requeridos: ${fields.join(", ")}`
  }

  if (result.invalidFields.length) {
    const fields = result.invalidFields.map(
      (field) => FIELD_LABELS[field] ?? field,
    )
    return `Revisa los valores de: ${fields.join(", ")}`
  }

  return "Revisa la información del paso"
}

export function normalizeLockerForm(form: LockerFormState): LockerFormState {
  return {
    ...form,
    locker_name: form.locker_name.trim(),
    serial_locker: form.serial_locker.trim(),
    locker_address: form.locker_address.trim(),
    latitud: form.latitud.trim(),
    longitud: form.longitud.trim(),
    description: form.description.trim(),
    installation_version: form.installation_version.trim(),
    lsa_version: form.lsa_version.trim(),
    pc_locker: {
      ...form.pc_locker,
      name_pc_locker: form.pc_locker.name_pc_locker.trim(),
      ip_pc_locker: form.pc_locker.ip_pc_locker.trim(),
      description_pc_locker: form.pc_locker.description_pc_locker.trim(),
    },
    ap_locker: {
      ...form.ap_locker,
      ap_name_locker: form.ap_locker.ap_name_locker.trim(),
      ip_ap_locker: form.ap_locker.ip_ap_locker.trim(),
      serial_ap_locker: form.ap_locker.serial_ap_locker.trim(),
      description: form.ap_locker.description.trim(),
    },
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Error al guardar el locker",
): string {
  if (!error || typeof error !== "object") return fallback

  const record = error as Record<string, any>

  return (
    record?.response?.data?.mensaje_return?.ERROR_MENSAGGE ||
    record?.response?.data?.message ||
    record?.data?.mensaje_return?.ERROR_MENSAGGE ||
    record?.data?.message ||
    record?.message ||
    fallback
  )
}

function toTemplateCell(raw: unknown): TemplateCell | null {
  if (!raw || typeof raw !== "object") return null

  const source = raw as Record<string, unknown>
  const cols = Number(source.cols)
  const rows = Number(source.rows)

  if (
    source.text === undefined ||
    !Number.isFinite(cols) ||
    !Number.isFinite(rows) ||
    cols <= 0 ||
    rows <= 0
  ) {
    return null
  }

  return {
    text: source.text as TemplateCell["text"],
    cols,
    rows,
    class: (source.class as string) ?? "LOCKER_CERRADO",
  }
}

export function normalizeTemplate(template: unknown): TemplateCell[][] {
  // Algunos endpoints históricos regresan template_module serializado como JSON.
  // Aceptamos ambos formatos para que el builder no dependa de que el service
  // haga el parse previamente.
  let normalizedInput = template

  if (typeof normalizedInput === "string") {
    const value = normalizedInput.trim()
    if (!value) return []

    try {
      normalizedInput = JSON.parse(value)
    } catch {
      return []
    }
  }

  if (!Array.isArray(normalizedInput) || normalizedInput.length === 0) return []

  if (Array.isArray(normalizedInput[0])) {
    return (normalizedInput as unknown[][])
      .map((column) =>
        column
          .map(toTemplateCell)
          .filter((cell): cell is TemplateCell => cell !== null),
      )
      .filter((column) => column.length > 0)
  }

  const cells = (normalizedInput as unknown[])
    .map(toTemplateCell)
    .filter((cell): cell is TemplateCell => cell !== null)

  return cells.length ? [cells] : []
}

/**
 * Convierte template_module del catálogo a coordenadas de CSS Grid.
 * Conserva el formato por columnas y soporta templates planos.
 */
export function convertTemplate(templateModule: unknown): ConvertedTemplate {
  const normalized = normalizeTemplate(templateModule)

  if (!normalized.length) {
    return {
      placedCells: [],
      columns: [],
      gridCols: 0,
      gridRows: 0,
      raw: templateModule,
    }
  }

  const placedCells: PlacedCell[] = []
  let gridCols = 0
  let gridRows = 0

  if (normalized.length > 1) {
    let colOffset = 0

    for (const cells of normalized) {
      const columnWidth = cells.reduce(
        (max, cell) => Math.max(max, cell.cols),
        1,
      )
      let rowOffset = 0

      for (const cell of cells) {
        placedCells.push({
          cell,
          colStart: colOffset + 1,
          colEnd: colOffset + cell.cols + 1,
          rowStart: rowOffset + 1,
          rowEnd: rowOffset + cell.rows + 1,
        })
        rowOffset += cell.rows
      }

      gridRows = Math.max(gridRows, rowOffset)
      colOffset += columnWidth
    }

    gridCols = colOffset
  } else {
    const elements = normalized[0]
    const maxSingleWidth = elements.reduce(
      (max, cell) => Math.max(max, cell.cols),
      1,
    )
    const totalWidth = elements.reduce((sum, cell) => sum + cell.cols, 0)

    let rowWidth = maxSingleWidth

    for (let width = maxSingleWidth; width <= totalWidth; width += 1) {
      let used = 0
      let fits = true

      for (const cell of elements) {
        if (cell.cols > width) {
          fits = false
          break
        }

        if (used + cell.cols > width) used = 0
        used += cell.cols
      }

      if (fits) {
        rowWidth = width
        break
      }
    }

    let colCursor = 0
    let rowCursor = 0
    let rowHeight = 0

    for (const cell of elements) {
      if (colCursor + cell.cols > rowWidth) {
        rowCursor += rowHeight
        rowHeight = 0
        colCursor = 0
      }

      placedCells.push({
        cell,
        colStart: colCursor + 1,
        colEnd: colCursor + cell.cols + 1,
        rowStart: rowCursor + 1,
        rowEnd: rowCursor + cell.rows + 1,
      })

      rowHeight = Math.max(rowHeight, cell.rows)
      colCursor += cell.cols
    }

    gridRows = rowCursor + rowHeight
    gridCols = rowWidth
  }

  return {
    placedCells,
    columns: normalized.map((elements) => ({ elements })),
    gridCols,
    gridRows,
    raw: templateModule,
  }
}
