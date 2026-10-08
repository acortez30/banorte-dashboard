import { LucideIcon } from "lucide-react";

/* ========================= */
/* ===== ENUM TYPES ======== */
/* ========================= */

export type ContentType =
  | "ad"
  | "news"
  | "community"
  | "event";

export type Source =
  | "internal"
  | "external";

export type ApprovalStatus =
  | "approved"
  | "pending"
  | "rejected";

/* ========================= */
/* ===== CORE MODELS ======= */
/* ========================= */

export interface AdSlot {
  id: string;
  title: string;
  type: ContentType;
  source: Source;
  duration: number; // seconds
  thumbnail: string;
  status: ApprovalStatus;
}

export interface PendingAd {
  id: string;
  title: string;
  type: ContentType;
  submitter: string;
  thumbnail: string;
  duration: number; // seconds
}

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  source: Source;
  duration: number; // seconds
  date: string; // ISO string
  active: boolean;
}

/* ========================= */
/* ===== OUTLET MODEL ====== */
/* ========================= */

export interface Outlet {
  id: string;
  nameKey: string; // i18n key
  specKey: string; // i18n key
  icon: LucideIcon;
  slots: (AdSlot | null)[];
}

/* ========================= */
/* ===== FORM STATE ======== */
/* ========================= */

export interface UploadFormState {
  title: string;
  type: ContentType;
  source: Source;
  duration: string;
}

/* ========================= */
/* ===== FILTER TYPES ====== */
/* ========================= */

export type ContentFilter = "all" | ContentType;

/* ========================= */
/* ===== HELPERS TYPES ===== */
/* ========================= */

export interface TypeLabelMap {
  [key: string]: string;
}

export type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "destructive";

export type TypeBadgeVariantMap = Record<ContentType, BadgeVariant>;