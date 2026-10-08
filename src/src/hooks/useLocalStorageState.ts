import { useState, useEffect, useRef } from "react";

const ISO_DATE_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/;

const reviver = (_key: string, value: any) => {
  if (typeof value === "string" && ISO_DATE_REGEX.test(value)) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return value;
};

const readFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    return JSON.parse(stored, reviver) as T;
  } catch {
    return defaultValue;
  }
};

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => readFromStorage(key, defaultValue));

  // Si la key cambia (ej: locker_filters_undefined → locker_filters_5),
  // releemos desde localStorage para esa nueva key
  const prevKeyRef = useRef(key);
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      setState(readFromStorage(key, defaultValue));
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persiste cambios — saltamos el primer render para no escribir el default
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}