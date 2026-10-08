export async function handleResponse(response: Response) {
  const data = await response.json();

  // ❌ error HTTP real
  if (!response.ok) {
    console.error("API Error:", data);

    throw new Error(
      data?.message ||
        data?.mensaje_return?.ERROR_MENSAGGE ||
        data?.ERROR_MENSAGGE ||
        "Error en la petición"
    );
  }

  const hasLogicalError =
    data?.ERROR === true ||
    data?.mensaje_return?.ERROR === true;

  if (hasLogicalError) {
    const message =
      data?.ERROR_MENSAGGE ||
      data?.mensaje_return?.ERROR_MENSAGGE ||
      "";

    // ✅ PROTECCIÓN
    const safeMessage = message?.toUpperCase?.() || "";

    // ✅ CASO ESPECIAL
    if (safeMessage.includes("NO EXISTEN REGISTROS")) {
      return {
        ...data,
        return_result: [],
      };
    }

    console.error("API Logical Error:", data);

    throw new Error(message || "Error en la operación");
  }

  return data;
}