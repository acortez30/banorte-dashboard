import type {
  VisionAssignmentStatus,
} from "@/types/package-validation";

const VISION_ASSIGNMENT_STATUSES =
  new Set<VisionAssignmentStatus>([
    "UNASSIGNED",
    "REVIEW",
    "ASSIGNED",
    "IMAGE_ISSUE",
  ]);

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
    VISION_ASSIGNMENT_STATUSES.has(
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