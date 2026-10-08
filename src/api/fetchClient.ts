const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchClient = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = new Headers(options.headers || {});

  // JSON por defecto. Para FormData el navegador debe generar el boundary.
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("token", token);
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Detectar token inválido
    if (response.status === 401 || response.status === 403) {
      console.warn("Sesión expirada o token inválido");

      localStorage.removeItem("token");

      // Evita redirecciones infinitas
      if (!window.location.pathname.includes("login")) {
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    console.error("Error de red:", error);
    throw error;
  }
};
