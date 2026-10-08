import { es } from "./es/index";
import { en } from "./en/index";

export type Language = "es" | "en";

export const translations: Record<
  Language,
  Record<string, string>
> = {
  es,
  en,
};