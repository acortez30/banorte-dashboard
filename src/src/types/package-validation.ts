export type VisionAssignmentStatus =
  | "UNASSIGNED"
  | "REVIEW"
  | "ASSIGNED"
  | "IMAGE_ISSUE";

export interface VisionPackagePositionObject {
  zone?: string | number | null;
  direction?: string | null;
}

export type VisionPackagePosition =
  | string
  | VisionPackagePositionObject
  | null;

export interface VisionPackageImageIssueObject {
  usable?: boolean | null;
  issue?: string | null;
  note?: string | null;
}

export type VisionPackageImageIssue =
  | string
  | VisionPackageImageIssueObject
  | null;

/* =====================================================
 * GET /server/package/unassigned
 * ===================================================== */

export interface VisionPackageCurrentUser {
  id_user: number;
  first_name: string | null;
  surname: string | null;
  is_default_user: boolean;
}

export interface VisionPackageExtractedData {
  carrier: string | null;
  tracking: string | null;
  recipient: string | null;
  phone: string | null;
  address: string | null;
  unit: string | null;
  sender: string | null;
}

export interface VisionPackageCandidate {
  id_user: number;

  /**
   * El backend lo usa internamente para ordenar candidatos.
   * No se muestra en la interfaz.
   */
  score: number | null;
}

export interface VisionPackageApiItem {
  id_package: number;
  id_service: number | null;
  id_package_code: number | null;

  tracking_number: string | null;
  registration_date: string | null;

  id_locker: number;
  id_propierty: number;
  id_locker_dimension: number | null;

  door_number: number | null;
  column_name: string | null;
  compartment_name: string | null;
  compartment_size: string | null;

  /**
   * En producción se observó como "C-4".
   * La colección también documenta { zone, direction }.
   */
  position: VisionPackagePosition;

  current_user: VisionPackageCurrentUser | null;

  id_package_detect_recipient: number | null;
  analyzed: number | boolean | null;

  assignment_status: VisionAssignmentStatus | null;
  needs_review: boolean | null;

  /**
   * Se conserva en el contrato, pero no se muestra.
   */
  score: number | null;

  image_issue: VisionPackageImageIssue;
  extracted: VisionPackageExtractedData | null;
  candidates: VisionPackageCandidate[] | null;
  images: string[] | null;
}

export interface VisionMessageReturn {
  ERROR?: boolean;
  ERROR_MENSAGGE?: string;
  ERROR_MESSAGE?: string;
  CODE?: number;
}

export interface VisionPackagesApiResponse {
  mensaje_return?: string | VisionMessageReturn;
  return_result?: VisionPackageApiItem[] | VisionPackageApiItem | null;
  result_return?: VisionPackageApiItem[] | VisionPackageApiItem | null;
  result?: VisionPackageApiItem[] | VisionPackageApiItem | null;
}

/* =====================================================
 * GET /server/package/asignation/:id_package
 * ===================================================== */

export interface VisionPackageImageQuality {
  usable?: boolean | null;
  issue?: string | null;
  note?: string | null;
}

export interface VisionPackageAssignmentThresholds {
  assign_auto_min?: number | null;
  review_min?: number | null;
}

export interface VisionPackageAssignment {
  status?: VisionAssignmentStatus | null;
  score?: number | null;
  needs_review?: boolean | null;

  id_user_assigned?: number | null;
  id_user_previous?: number | null;

  assigned_at?: string | null;
  assigned_by?: string | null;
  assign_error?: string | null;

  confirmed_by?: number | null;
  confirmed_at?: string | null;

  thresholds_used?: VisionPackageAssignmentThresholds | null;
  by_field?: Record<string, number | null> | null;
  coverage?: Record<string, number | null> | null;
  rules_applied?: string[] | null;
  candidates?: VisionPackageCandidate[] | null;
}

/**
 * Compatibilidad con una respuesta anterior observada en desarrollo.
 */
export interface VisionPackageDetailMetadataSuccess {
  rate?: number | null;
  by_field?: Record<string, number | null>;
  evidence?: {
    n_images?: number | null;
    coverage?: Record<string, number | null>;
    agreement?: Record<string, number | null>;
  } | null;
}

export interface VisionPackageDetailMetadata {
  carrier: string | null;
  tracking: string | null;
  recipient: string | null;
  phone: string | null;
  address: string | null;
  unit?: string | null;
  sender: string | null;

  image_quality?: VisionPackageImageQuality | null;
  id_consumer_image?: number | null;
  attempts?: number | null;
  assignment?: VisionPackageAssignment | null;

  /**
   * Compatible con respuestas anteriores del endpoint.
   */
  success?: VisionPackageDetailMetadataSuccess | null;
}

export interface VisionPackageDetailImage {
  image_name: string | null;
  best_image: number | null;
  ranking_image: number | null;
}

export interface VisionPackageDetailUser {
  id_user: number;
  first_name: string | null;
  surname: string | null;
  email: string | null;
  main_tlf: string | null;
  unit: string | null;
  number_floor: number | null;
  score: number | null;
}

export interface VisionPackageDetailCurrentUser {
  id_user: number;
  id_consumer: number | null;
}

export interface VisionPackageDetailResult {
  id_package_detect_recipient: number | null;
  id_package: number;
  analyzed: number | boolean | null;

  id_locker: number;
  id_propierty: number;

  current_user: VisionPackageDetailCurrentUser | null;
  package_metadata: VisionPackageDetailMetadata | null;

  images: VisionPackageDetailImage[] | null;
  available_users: VisionPackageDetailUser[] | null;
}

export interface VisionPackageDetailResponse {
  mensaje_return?: string | VisionMessageReturn;
  result?: VisionPackageDetailResult | null;
}

/* =====================================================
 * Modelo normalizado para la interfaz
 * ===================================================== */

export interface PackageValidation {
  id: string;

  idPackage: number;
  idService: number | null;
  idPackageCode: number | null;
  idPackageDetectRecipient: number | null;

  status: VisionAssignmentStatus;
  needsReview: boolean;
  analyzed: boolean;
  registrationDate: string;

  systemTracking: string;
  carrier: string;
  extractedTracking: string;
  recipient: string;
  phone: string;
  sender: string;
  address: string;
  unit: string;

  currentUser: VisionPackageCurrentUser;

  idProperty: number;
  idLocker: number;
  idLockerDimension: number | null;

  doorNumber: number | null;
  columnName: string;
  compartmentName: string;
  compartmentSize: string;
  position: string | null;

  imageIssue: string;
  images: string[];

  /**
   * Se conserva para sugerir usuarios. El score nunca se muestra.
   */
  candidates: VisionPackageCandidate[];
}

export interface PackageValidationFormData {
  carrier: string;
  tracking: string;
  recipient: string;
  phone: string;
  sender: string;
  address: string;
  unit: string;
}

export interface ValidationUserOption {
  idUser: number;
  name: string;
  unit: string;
  email: string;
  phone: string;
}

/**
 * Contrato exacto de PUT /server/package/asignation/:id_package.
 *
 * - Confirmar propuesta: { data: {} }
 * - Corregir campos:     { data: { extracted: { ... } } }
 * - Cambiar usuario:     { data: { new_user: 123, extracted?: { ... } } }
 *
 * El backend obtiene last_user y el id_package desde el paquete/ruta.
 */
export interface VisionPackageResolutionPayload {
  data: {
    new_user?: number;
    extracted?: Partial<VisionPackageExtractedData>;
  };
}

/**
 * Contrato clásico de /update-addressee.
 * No debe usarse para resolver paquetes del flujo de Vision.
 */
export interface UpdateVisionAddresseePayload {
  data: {
    last_user: number;
    id_package: number;
    new_user: number;
  };
}