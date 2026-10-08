import SHA512 from "crypto-js/sha512";

/**
 * Genera un hash SHA-512 hexadecimal.
 *
 * CryptoJS se usa directamente porque `crypto.subtle` solo está disponible
 * en contextos seguros (HTTPS o localhost).
 */
export async function sha512(message: string): Promise<string> {
  if (typeof message !== "string") {
    throw new TypeError("sha512 esperaba recibir un string");
  }

  return SHA512(message).toString();
}