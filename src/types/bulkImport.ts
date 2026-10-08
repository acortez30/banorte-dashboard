import type {
  EmployeeImportRow,
} from "@/types/dashboard";

export type BulkImportRowStatus =
  | "valid"
  | "invalid"
  | "importing"
  | "imported";

export interface BulkImportRowErrors {
  name?: string;
  phone?: string;
  employeeNumber?: string;
  badgeNumber?: string;
}

export interface BulkImportDraftRow
  extends EmployeeImportRow {
  id: string;
  sourceRow: number;

  status: BulkImportRowStatus;

  errors: BulkImportRowErrors;
}