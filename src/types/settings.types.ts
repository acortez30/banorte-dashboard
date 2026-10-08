// --- Tabs ---
export type SettingsTabId =
  | "account"
  | "password"
  | "preferences"
  | "appearance"
  | "property";

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
}

// --- Account ---
export interface AccountData {
  fullName: string;
  email: string;
  company: string;
  propertyCode: string;
  propertyName: string;
  userType: string;
}

// --- Password ---
export interface PasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordValidation {
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasMinLength: boolean;
  isValid: boolean;
}

// --- Preferences ---
export type Timezone =
  | "america_mexico"
  | "america_monterrey"
  | "america_cancun"
  | "america_tijuana";

export type DateFormat =
  | "dd_mm_yyyy"
  | "mm_dd_yyyy"
  | "yyyy_mm_dd";

export type Currency = "mxn" | "usd" | "eur";

export interface PreferencesState {
  timezone: Timezone;
  dateFormat: DateFormat;
  currency: Currency;
}

// --- Appearance ---
export type TextSize = "small" | "medium" | "large";

export interface AppearanceState {
  textSize: TextSize;
}

// --- Property / Business Logic ---
export interface CarrierCode {
  carrier: string;
  code: string;
}

export interface CarrierAccessState {
  enabled: boolean;
  selectedCarrier: string;
  customCarrierName: string;
  carrierCode: string;
  carrierList: CarrierCode[];
}

export interface LateFeesState {
  enabled: boolean;
  lateDays: number;
}

export interface RegistrationFeeState {
  enabled: boolean;
  amount: number;
}

export interface RequestPaymentState {
  enabled: boolean;
}

// --- Full Property Settings ---
export interface PropertySettings {
  carrierAccess: CarrierAccessState;
  lateFees: LateFeesState;
  registrationFee: RegistrationFeeState;
  requestPayment: RequestPaymentState;
}

// --- Global Settings State (opcional si usas store) ---
export interface SettingsState {
  account: AccountData;
  preferences: PreferencesState;
  appearance: AppearanceState;
  property: PropertySettings;
}