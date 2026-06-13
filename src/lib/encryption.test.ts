import { describe, it, expect, vi, beforeEach } from "vitest";
import { encrypt, decrypt } from "@/lib/encryption";

describe("encryption", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("encrypts and decrypts plaintext round-trip", async () => {
    const plaintext = "Secret journal entry about NEET stress";
    const encrypted = await encrypt(plaintext);
    expect(encrypted).not.toContain(plaintext);
    const decrypted = await decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertext for same plaintext (random IV)", async () => {
    const text = "Same content";
    const a = await encrypt(text);
    const b = await encrypt(text);
    expect(a).not.toBe(b);
  });
});

describe("device-id", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates and returns stable device id", async () => {
    const { getOrCreateDeviceId } = await import("@/lib/storage/device-id");
    const id1 = getOrCreateDeviceId();
    const id2 = getOrCreateDeviceId();
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});

describe("cloud-sync merge", () => {
  it("pullFromCloud returns null when sync disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ENABLED", "false");
    const { pullFromCloud } = await import("@/lib/storage/cloud-sync");
    const result = await pullFromCloud();
    expect(result).toBeNull();
    vi.unstubAllEnvs();
  });
});
