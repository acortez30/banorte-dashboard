import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // 🔥 inicializar desde localStorage (CLAVE)
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  });

  // 🔥 aplicar cambios SOLO cuando cambia el theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");

    localStorage.setItem("theme", theme);

    // 🔥 evento global
    window.dispatchEvent(new Event("theme-change"));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme, setTheme };
}