/**
 * Client-side encryption for journal data at rest using Web Crypto API (AES-GCM).
 * Key is derived from a device-local salt — data stays on-device.
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function base64ToUint8(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function getOrCreateSalt(): Uint8Array {
  const stored = localStorage.getItem("mindmirror_encryption_salt");
  if (stored) {
    return base64ToUint8(stored);
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem("mindmirror_encryption_salt", uint8ToBase64(salt));
  return salt;
}

async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const saltBuffer = new Uint8Array(salt);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("mindmirror-local-key-v1"),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"],
  );
}

/**
 * Encrypt plaintext string; returns base64(iv + ciphertext).
 */
export async function encrypt(plaintext: string): Promise<string> {
  const salt = getOrCreateSalt();
  const key = await deriveKey(salt);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: new Uint8Array(iv) },
    key,
    encoded,
  );
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return uint8ToBase64(combined);
}

/**
 * Decrypt base64(iv + ciphertext) back to plaintext.
 */
export async function decrypt(encrypted: string): Promise<string> {
  const salt = getOrCreateSalt();
  const key = await deriveKey(salt);
  const combined = base64ToUint8(encrypted);
  const iv = new Uint8Array(combined.slice(0, IV_LENGTH));
  const ciphertext = new Uint8Array(combined.slice(IV_LENGTH));
  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}
