import type {
  PackageValidation,
  PackageValidationFormData,
  ValidationUserOption,
  VisionAssignmentStatus,
  VisionPackageApiItem,
  VisionPackageCandidate,
  VisionPackageCurrentUser,
  VisionPackageDetailResponse,
  VisionPackageDetailResult,
  VisionPackageExtractedData,
  VisionPackageImageIssue,
  VisionPackagePosition,
  VisionPackageResolutionPayload,
  VisionPackagesApiResponse,
} from "@/types/package-validation";

const EMPTY_VISION_VALUES = new Set([
  "",
  "0",
  "null",
  "undefined",
  "n/a",
  "na",
  "none",
  "-",
  "--",
  "---",
]);

const VALID_ASSIGNMENT_STATUSES =
  new Set<VisionAssignmentStatus>([
    "UNASSIGNED",
    "REVIEW",
    "ASSIGNED",
    "IMAGE_ISSUE",
  ]);

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const normalized = String(value).trim();

  if (
    EMPTY_VISION_VALUES.has(
      normalized.toLowerCase()
    )
  ) {
    return "";
  }

  return normalized;
}

function normalizeNullableNumber(
  value: unknown
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function normalizeRequiredNumber(
  value: unknown
): number {
  return normalizeNullableNumber(value) ?? 0;
}

function normalizeImages(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(normalizeText)
    .filter(Boolean);
}

function normalizeColumnName(
  value: unknown
): string {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  try {
    const parsed = JSON.parse(normalized);

    if (Array.isArray(parsed)) {
      return parsed
        .map(normalizeText)
        .filter(Boolean)
        .join(", ");
    }
  } catch {
    // No era un arreglo JSON.
  }

  return normalized;
}

function normalizePosition(
  value: VisionPackagePosition | unknown
): string | null {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const position =
      value as Record<string, unknown>;

    const zone = normalizeText(position.zone);
    const direction =
      normalizeText(position.direction);

    const parts = [
      zone ? `Z${zone}` : "",
      direction,
    ].filter(Boolean);

    return parts.length
      ? parts.join(" · ")
      : null;
  }

  return normalizeText(value) || null;
}

function normalizeImageIssue(
  value: VisionPackageImageIssue | unknown
): string {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const issue =
      value as Record<string, unknown>;

    return (
      normalizeText(issue.note) ||
      normalizeText(issue.issue)
    );
  }

  return normalizeText(value);
}

function normalizeExtracted(
  value: unknown
): VisionPackageExtractedData {
  const extracted =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    carrier:
      normalizeText(extracted.carrier) || null,
    tracking:
      normalizeText(extracted.tracking) || null,
    recipient:
      normalizeText(extracted.recipient) || null,
    phone:
      normalizeText(extracted.phone) || null,
    address:
      normalizeText(extracted.address) || null,
    unit:
      normalizeText(extracted.unit) || null,
    sender:
      normalizeText(extracted.sender) || null,
  };
}

function normalizeCurrentUser(
  value: unknown
): VisionPackageCurrentUser {
  const user =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    id_user: normalizeRequiredNumber(user.id_user),
    first_name:
      normalizeText(user.first_name) || null,
    surname:
      normalizeText(user.surname) || null,
    is_default_user: Boolean(
      user.is_default_user
    ),
  };
}

function normalizeCandidates(
  value: unknown
): VisionPackageCandidate[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const candidates = value
    .map((candidate) => {
      const item =
        candidate &&
        typeof candidate === "object"
          ? (candidate as Record<string, unknown>)
          : {};

      return {
        id_user:
          normalizeRequiredNumber(item.id_user),
        score:
          normalizeNullableNumber(item.score),
      };
    })
    .filter(
      (candidate) => candidate.id_user > 0
    )
    .sort(
      (a, b) =>
        (b.score ?? -Infinity) -
        (a.score ?? -Infinity)
    );

  const unique =
    new Map<number, VisionPackageCandidate>();

  for (const candidate of candidates) {
    if (!unique.has(candidate.id_user)) {
      unique.set(
        candidate.id_user,
        candidate
      );
    }
  }

  return Array.from(unique.values());
}

function isVisionPackageApiItem(
  value: unknown
): value is VisionPackageApiItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    item.id_package !== null &&
    item.id_package !== undefined
  );
}

function normalizeComparableField(
  value: unknown
): string {
  return normalizeText(value);
}

function assignChangedExtractedField(
  target: Partial<VisionPackageExtractedData>,
  field: keyof VisionPackageExtractedData,
  currentValue: string,
  originalValue: string
) {
  const current =
    normalizeComparableField(currentValue);

  const original =
    normalizeComparableField(originalValue);

  if (current !== original) {
    /*
     * El backend documenta que una cadena vacía
     * debe persistirse como null.
     */
    target[field] = current;
  }
}

export function normalizeValidationStatus(
  value: unknown,
  fallbackData?: {
    needsReview?: boolean;
    isDefaultUser?: boolean;
    imageIssue?: string | null;
  }
): VisionAssignmentStatus {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (
    VALID_ASSIGNMENT_STATUSES.has(
      normalized as VisionAssignmentStatus
    )
  ) {
    return normalized as VisionAssignmentStatus;
  }

  if (fallbackData?.imageIssue) {
    return "IMAGE_ISSUE";
  }

  if (fallbackData?.needsReview) {
    return "REVIEW";
  }

  if (fallbackData?.isDefaultUser) {
    return "UNASSIGNED";
  }

  return "ASSIGNED";
}

export function extractVisionPackageApiItems(
  response: VisionPackagesApiResponse | unknown
): VisionPackageApiItem[] {
  if (!response || typeof response !== "object") {
    return [];
  }

  const payload =
    response as VisionPackagesApiResponse;

  const raw =
    payload.return_result ??
    payload.result_return ??
    payload.result ??
    [];

  const values = Array.isArray(raw)
    ? raw
    : [raw];

  return values.filter(isVisionPackageApiItem);
}

export function extractVisionPackageDetail(
  response: VisionPackageDetailResponse | unknown
): VisionPackageDetailResult | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const payload =
    response as VisionPackageDetailResponse;

  if (
    !payload.result ||
    typeof payload.result !== "object"
  ) {
    return null;
  }

  if (
    payload.result.id_package === null ||
    payload.result.id_package === undefined
  ) {
    return null;
  }

  return payload.result;
}

export function mapVisionPackage(
  item: VisionPackageApiItem
): PackageValidation {
  const extracted =
    normalizeExtracted(item.extracted);

  const currentUser =
    normalizeCurrentUser(item.current_user);

  const imageIssue =
    normalizeImageIssue(item.image_issue);

  const status = normalizeValidationStatus(
    item.assignment_status,
    {
      needsReview: Boolean(item.needs_review),
      isDefaultUser:
        currentUser.is_default_user,
      imageIssue,
    }
  );

  return {
    id: String(
      normalizeRequiredNumber(item.id_package)
    ),

    idPackage:
      normalizeRequiredNumber(item.id_package),

    idService:
      normalizeNullableNumber(item.id_service),

    idPackageCode:
      normalizeNullableNumber(
        item.id_package_code
      ),

    idPackageDetectRecipient:
      normalizeNullableNumber(
        item.id_package_detect_recipient
      ),

    status,

    needsReview:
      Boolean(item.needs_review) ||
      status === "REVIEW" ||
      status === "IMAGE_ISSUE",

    analyzed:
      item.analyzed === true ||
      Number(item.analyzed) === 1,

    registrationDate:
      normalizeText(item.registration_date),

    systemTracking:
      normalizeText(item.tracking_number),

    carrier: extracted.carrier ?? "",
    extractedTracking:
      extracted.tracking ?? "",
    recipient: extracted.recipient ?? "",
    phone: extracted.phone ?? "",
    sender: extracted.sender ?? "",
    address: extracted.address ?? "",
    unit: extracted.unit ?? "",

    currentUser,

    idProperty:
      normalizeRequiredNumber(
        item.id_propierty
      ),

    idLocker:
      normalizeRequiredNumber(item.id_locker),

    idLockerDimension:
      normalizeNullableNumber(
        item.id_locker_dimension
      ),

    doorNumber:
      normalizeNullableNumber(
        item.door_number
      ),

    columnName:
      normalizeColumnName(item.column_name),

    compartmentName:
      normalizeText(item.compartment_name),

    compartmentSize:
      normalizeText(item.compartment_size),

    position:
      normalizePosition(item.position),

    imageIssue,
    images: normalizeImages(item.images),
    candidates:
      normalizeCandidates(item.candidates),
  };
}

export function mapVisionPackages(
  items: VisionPackageApiItem[]
): PackageValidation[] {
  return items
    .map(mapVisionPackage)
    .sort(
      (a, b) =>
        new Date(
          b.registrationDate
        ).getTime() -
        new Date(
          a.registrationDate
        ).getTime()
    );
}

export function mapDetailAvailableUsers(
  availableUsers:
    | VisionPackageDetailResult["available_users"]
    | undefined
): ValidationUserOption[] {
  const users = new Map<
    number,
    {
      idUser: number;
      name: string;
      email: string;
      phone: string;
      units: Set<string>;
      score: number | null;
    }
  >();

  for (const item of availableUsers ?? []) {
    const idUser =
      normalizeRequiredNumber(item.id_user);

    if (idUser <= 0) {
      continue;
    }

    const name =
      [
        normalizeText(item.first_name),
        normalizeText(item.surname),
      ]
        .filter(Boolean)
        .join(" ") || `Usuario #${idUser}`;

    const unit = normalizeText(item.unit);
    const score =
      normalizeNullableNumber(item.score);

    const existing = users.get(idUser);

    if (existing) {
      if (unit) {
        existing.units.add(unit);
      }

      if (!existing.email) {
        existing.email =
          normalizeText(item.email);
      }

      if (!existing.phone) {
        existing.phone =
          normalizeText(item.main_tlf);
      }

      if (
        score !== null &&
        (
          existing.score === null ||
          score > existing.score
        )
      ) {
        existing.score = score;
      }

      continue;
    }

    users.set(idUser, {
      idUser,
      name,
      email: normalizeText(item.email),
      phone: normalizeText(item.main_tlf),
      units: new Set(
        unit ? [unit] : []
      ),
      score,
    });
  }

  return Array.from(users.values())
    .sort(
      (a, b) =>
        (b.score ?? -Infinity) -
        (a.score ?? -Infinity)
    )
    .map(({ units, score: _score, ...user }) => ({
      ...user,
      unit: Array.from(units).join(", "),
    }));
}

export function mapVisionPackageDetail(
  detail: VisionPackageDetailResult,
  baseValidation: PackageValidation | null
): PackageValidation {
  const metadata =
    detail.package_metadata ?? null;

  const assignment =
    metadata?.assignment ?? null;

  const detailUsers =
    detail.available_users ?? [];

  const currentUserId =
    normalizeRequiredNumber(
      detail.current_user?.id_user
    );

  const availableCurrentUser =
    detailUsers.find(
      (user) =>
        normalizeRequiredNumber(user.id_user) ===
        currentUserId
    );

  const sameBaseUser =
    baseValidation?.currentUser.id_user ===
    currentUserId
      ? baseValidation.currentUser
      : null;

  const metadataStatus =
    assignment?.status ?? null;

  const status =
    normalizeValidationStatus(
      metadataStatus ??
        baseValidation?.status,
      {
        needsReview:
          Boolean(
            assignment?.needs_review ??
            baseValidation?.needsReview
          ),
        isDefaultUser:
          sameBaseUser?.is_default_user ??
          (
            metadataStatus === "UNASSIGNED" ||
            metadataStatus === "IMAGE_ISSUE"
          ),
        imageIssue:
          normalizeText(
            metadata?.image_quality?.note
          ) ||
          normalizeText(
            metadata?.image_quality?.issue
          ) ||
          baseValidation?.imageIssue ||
          "",
      }
    );

  const currentUserIsDefault =
    sameBaseUser?.is_default_user ??
    (
      status === "UNASSIGNED" ||
      status === "IMAGE_ISSUE"
    );

  const imageIssue =
    normalizeText(
      metadata?.image_quality?.note
    ) ||
    normalizeText(
      metadata?.image_quality?.issue
    ) ||
    baseValidation?.imageIssue ||
    "";

  const detailImages = [
    ...(detail.images ?? []),
  ]
    .filter((image) =>
      Boolean(normalizeText(image.image_name))
    )
    .sort((a, b) => {
      const bestDifference =
        Number(b.best_image ?? 0) -
        Number(a.best_image ?? 0);

      if (bestDifference !== 0) {
        return bestDifference;
      }

      return (
        Number(a.ranking_image ?? 999) -
        Number(b.ranking_image ?? 999)
      );
    })
    .map((image) =>
      normalizeText(image.image_name)
    )
    .filter(Boolean);

  const assignmentCandidates =
    normalizeCandidates(
      assignment?.candidates
    );

  const availableUserCandidates =
    normalizeCandidates(
      detailUsers
        .filter(
          (user) =>
            normalizeNullableNumber(
              user.score
            ) !== null
        )
        .map((user) => ({
          id_user: user.id_user,
          score: user.score,
        }))
    );

  const candidates =
    assignmentCandidates.length > 0
      ? assignmentCandidates
      : availableUserCandidates.length > 0
        ? availableUserCandidates
        : baseValidation?.candidates ?? [];

  return {
    id: String(
      normalizeRequiredNumber(detail.id_package)
    ),

    idPackage:
      normalizeRequiredNumber(detail.id_package),

    idService:
      baseValidation?.idService ?? null,

    idPackageCode:
      baseValidation?.idPackageCode ?? null,

    idPackageDetectRecipient:
      normalizeNullableNumber(
        detail.id_package_detect_recipient
      ),

    status,

    needsReview:
      Boolean(
        assignment?.needs_review ??
        baseValidation?.needsReview ??
        (
          status === "REVIEW" ||
          status === "IMAGE_ISSUE"
        )
      ),

    analyzed:
      detail.analyzed === true ||
      Number(detail.analyzed) === 1,

    registrationDate:
      baseValidation?.registrationDate ?? "",

    systemTracking:
      baseValidation?.systemTracking ?? "",

    carrier:
      normalizeText(metadata?.carrier) ||
      baseValidation?.carrier ||
      "",

    extractedTracking:
      normalizeText(metadata?.tracking) ||
      baseValidation?.extractedTracking ||
      "",

    recipient:
      normalizeText(metadata?.recipient) ||
      baseValidation?.recipient ||
      "",

    phone:
      normalizeText(metadata?.phone) ||
      baseValidation?.phone ||
      "",

    sender:
      normalizeText(metadata?.sender) ||
      baseValidation?.sender ||
      "",

    address:
      normalizeText(metadata?.address) ||
      baseValidation?.address ||
      "",

    unit:
      normalizeText(metadata?.unit) ||
      baseValidation?.unit ||
      "",

    currentUser: {
      id_user: currentUserId,

      first_name:
        normalizeText(
          availableCurrentUser?.first_name
        ) ||
        sameBaseUser?.first_name ||
        null,

      surname:
        normalizeText(
          availableCurrentUser?.surname
        ) ||
        sameBaseUser?.surname ||
        null,

      is_default_user:
        currentUserIsDefault,
    },

    idProperty:
      normalizeRequiredNumber(
        detail.id_propierty
      ),

    idLocker:
      normalizeRequiredNumber(
        detail.id_locker
      ),

    idLockerDimension:
      baseValidation?.idLockerDimension ??
      null,

    doorNumber:
      baseValidation?.doorNumber ?? null,

    columnName:
      baseValidation?.columnName ?? "",

    compartmentName:
      baseValidation?.compartmentName ?? "",

    compartmentSize:
      baseValidation?.compartmentSize ?? "",

    position:
      baseValidation?.position ?? null,

    imageIssue,

    images:
      detailImages.length > 0
        ? detailImages
        : baseValidation?.images ?? [],

    candidates,
  };
}

export function createPackageValidationFormData(
  validation: PackageValidation
): PackageValidationFormData {
  return {
    carrier: validation.carrier,
    tracking:
      validation.extractedTracking ||
      validation.systemTracking,
    recipient: validation.recipient,
    phone: validation.phone,
    sender: validation.sender,
    address: validation.address,
    unit: validation.unit,
  };
}

export function buildVisionPackageResolutionPayload(
  validation: PackageValidation,
  form: PackageValidationFormData,
  selectedUserId: number
): VisionPackageResolutionPayload {
  const data:
    VisionPackageResolutionPayload["data"] = {};

  if (
    selectedUserId > 0 &&
    selectedUserId !==
      validation.currentUser.id_user
  ) {
    data.new_user = selectedUserId;
  }

  const original =
    createPackageValidationFormData(
      validation
    );

  const extracted:
    Partial<VisionPackageExtractedData> = {};

  assignChangedExtractedField(
    extracted,
    "carrier",
    form.carrier,
    original.carrier
  );

  assignChangedExtractedField(
    extracted,
    "tracking",
    form.tracking,
    original.tracking
  );

  assignChangedExtractedField(
    extracted,
    "recipient",
    form.recipient,
    original.recipient
  );

  assignChangedExtractedField(
    extracted,
    "phone",
    form.phone,
    original.phone
  );

  assignChangedExtractedField(
    extracted,
    "sender",
    form.sender,
    original.sender
  );

  assignChangedExtractedField(
    extracted,
    "address",
    form.address,
    original.address
  );

  assignChangedExtractedField(
    extracted,
    "unit",
    form.unit,
    original.unit
  );

  if (Object.keys(extracted).length > 0) {
    data.extracted = extracted;
  }

  return { data };
}

export function getPackageDisplayTracking(
  validation: PackageValidation
): string {
  return (
    validation.extractedTracking ||
    validation.systemTracking ||
    ""
  );
}

export function getCurrentUserDisplayName(
  user: VisionPackageCurrentUser
): string {
  return [
    normalizeText(user.first_name),
    normalizeText(user.surname),
  ]
    .filter(Boolean)
    .join(" ");
}

export function getPackageDoorLabel(
  validation: PackageValidation
): string {
  const door =
    validation.doorNumber !== null
      ? String(validation.doorNumber)
      : "";

  const compartment =
    validation.compartmentSize ||
    validation.compartmentName;

  return [door, compartment]
    .filter(Boolean)
    .join(" · ");
}