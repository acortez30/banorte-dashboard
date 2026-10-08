// src/services/apiClient.ts

const BASE_URL = import.meta.env.VITE_API_URL;

function getToken(): string {
  const encrypted = localStorage.getItem("data");
  if (!encrypted) throw new Error("No session found");

  const parsed = JSON.parse(atob(encrypted)); // ajusta si usas cifrado real
  return parsed.token;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      token,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API Error");
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string) =>
    request<T>(endpoint),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};