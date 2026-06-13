import { describe, it, expect, vi } from "vitest";
import {
  isSupabaseConnectivityError,
  isSupabaseConfigured,
  normalizeSupabaseUrl,
} from "@/lib/supabase/admin";

describe("normalizeSupabaseUrl", () => {
  it("accepts valid supabase.co URLs", () => {
    expect(normalizeSupabaseUrl("https://rfmpxoyauzwueoxleukf.supabase.co")).toBe(
      "https://rfmpxoyauzwueoxleukf.supabase.co",
    );
  });

  it("auto-corrects common .supabase.com typo", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeSupabaseUrl("https://rfmpxoyauzwueoxleukf.supabase.com")).toBe(
      "https://rfmpxoyauzwueoxleukf.supabase.co",
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("rejects invalid URLs", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(normalizeSupabaseUrl("https://example.com")).toBeUndefined();
    error.mockRestore();
  });
});

describe("isSupabaseConnectivityError", () => {
  it("detects DNS and fetch failures", () => {
    expect(
      isSupabaseConnectivityError({
        message: "TypeError: fetch failed",
        details: "getaddrinfo ENOTFOUND rfmpxoyauzwueoxleukf.supabase.com",
      }),
    ).toBe(true);
  });

  it("returns false for auth errors", () => {
    expect(isSupabaseConnectivityError({ message: "Invalid API key", code: "401" })).toBe(false);
  });
});

describe("isSupabaseConfigured", () => {
  it("returns false when env vars are missing", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_ANON_KEY", "");
    expect(isSupabaseConfigured()).toBe(false);
    vi.unstubAllEnvs();
  });

  it("returns true when URL and key are set", () => {
    vi.stubEnv("SUPABASE_URL", "https://rfmpxoyauzwueoxleukf.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "test-key");
    expect(isSupabaseConfigured()).toBe(true);
    vi.unstubAllEnvs();
  });
});

describe("isSupabaseConnectivityError edge cases", () => {
  it("detects econnrefused and etimedout", () => {
    expect(isSupabaseConnectivityError({ message: "econnrefused" })).toBe(true);
    expect(isSupabaseConnectivityError({ message: "etimedout" })).toBe(true);
  });
});
