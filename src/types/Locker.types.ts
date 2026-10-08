/**
 * locker.types.ts — Tipos compartidos del dominio locker
 *
 * Fuente única de verdad para todos los tipos relacionados con módulos
 * y templates. Importar desde aquí en:
 *   - ModuleRenderer
 *   - ModuleBuilderCanvas
 *   - ModuleBuilderLeftPanel
 *   - WizardModuleBuilder
 *   - LockerAdd (useLockerCatalogs)
 *
 * Esto elimina las definiciones duplicadas que causaban errores de
 * incompatibilidad de tipos entre archivos (TS2322).
 */

// ─────────────────────────────────────────────
// TEMPLATE — estructura del backend
// ─────────────────────────────────────────────

/** Clases de celda enviadas por el backend en template_module */
export type CellClass =
  | "LOCKER_CERRADO"  // puerta numerada normal
  | "LOCKER_BLOCK"    // espacio estructural — sin label
  | "SCREEN"          // pantalla del módulo CM
  | (string & {})     // extensible para futuros tipos sin perder autocomplete

/** Celda individual del template (element dentro de una columna) */
export interface TemplateCell {
  text: number | string
  cols: number
  rows: number
  class: CellClass
}

/** Columna del template: array de celdas apiladas verticalmente */
export interface TemplateColumn {
  elements: TemplateCell[]
}

/**
 * Celda ya posicionada en el grid 2D.
 * Producida por convertTemplate() — el renderer la consume directamente.
 */
export interface PlacedCell {
  cell: TemplateCell
  colStart: number  // 1-based CSS grid-column-start
  colEnd: number    // exclusive
  rowStart: number  // 1-based CSS grid-row-start
  rowEnd: number    // exclusive
}

/**
 * Formato producido por convertTemplate() en LockerAdd.
 * Es el formato que reciben ModuleRenderer, Canvas y LeftPanel.
 */
export interface ConvertedTemplate {
  /** Celdas con posicionamiento 2D pre-calculado — consumido por ModuleRenderer */
  placedCells: PlacedCell[]
  /** Columnas originales — para categorizar en LeftPanel */
  columns: TemplateColumn[]
  gridCols: number
  gridRows: number
  raw?: unknown
}

// ─────────────────────────────────────────────
// MÓDULOS
// ─────────────────────────────────────────────

/** Módulo tal como llega del backend (antes de convertir el template) */
export interface RawLockerModule {
  id_locker_module: number
  name_locker_module: string
  description: string
  door_total: number
  template_module: unknown
  door_per_size?: DoorPerSize[]
  rank_order?: number[][]
}

/** Módulo con template ya convertido — el que circula en la UI */
export interface LockerModule {
  id_locker_module: number
  name_locker_module: string
  description: string
  door_total: number
  template: ConvertedTemplate
}

/** Módulo colocado en el canvas del builder */
export interface PlacedModule {
  instanceId: string
  module: LockerModule
}

// ─────────────────────────────────────────────
// DOOR PER SIZE (del backend, informativo)
// ─────────────────────────────────────────────

export interface DoorPerSize {
  NOMBRE_ES: string
  NOMBRE_EN: string
  ID: number
  CANT: number
  PUERTAS: number[]
}

// ─────────────────────────────────────────────
// CATÁLOGOS
// ─────────────────────────────────────────────

export interface LockerType {
  id_locker_type: number
  locker_type_name: string
}

export interface LockerModel {
  id_locker_model: number
  locker_model_name: string
}

export interface LockerPrivacy {
  id_locker_privacy: number
  locker_privacy: string
}

export interface LockerEnvironment {
  id_locker_environment: number
  name_environment: string
}

export interface State {
  id_state: number
  state_name: string
}

export interface City {
  id_city: number
  city: string
}

// ─────────────────────────────────────────────
// ESTADOS DEL LOCKER (IoT)
// ─────────────────────────────────────────────

export type LockerStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "OPEN"
  | "BLOCKED"
  | "OFFLINE"

export type LockerEvent =
  | "locker_opened"
  | "locker_closed"
  | "locker_error"
  | "locker_timeout"

// ─────────────────────────────────────────────
// MODULE DATA — tipo de entrada de ModuleRenderer
// ─────────────────────────────────────────────

/** Union de todos los formatos que puede recibir ModuleRenderer */
export type ModuleData = ConvertedTemplate | unknown[] | null | undefined