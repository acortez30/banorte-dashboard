import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { translations, type Language } from "@/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (
    key: string,
    params?: Record<string, string | number>
  ) => string;
}

const LanguageContext = createContext<
  LanguageContextType | undefined
>(undefined);

// 🔹 Detecta idioma inicial
const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem("app_language");

  if (stored === "es" || stored === "en") {
    return stored;
  }

  const browserLang = navigator.language.startsWith("en")
    ? "en"
    : "es";

  return browserLang;
};

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>(getInitialLanguage);

  // 🔹 Persistencia
  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // 🔹 Traducción con interpolaciones
const t = (
  key: string,
  params?: Record<string, string | number>
): string => {
  let value = translations[language]?.[key];

  // ❌ QUITAMOS fallback automático a "es"
  if (!value) {
    return key;
  }

  // Interpolaciones
  if (params) {
    Object.keys(params).forEach((param) => {
      value = value.replace(`{${param}}`, String(params[param]));
    });
  }

  return value;
};

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }

  return context;
}