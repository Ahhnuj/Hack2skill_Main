import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimitStore, getClientIp } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it("allows requests under the limit", () => {
    const result = checkRateLimit("test-ip");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("blocks requests over the limit", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("blocked-ip");
    }
    const result = checkRateLimit("blocked-ip");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("extracts client IP from headers", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 70.41.3.18",
    });
    expect(getClientIp(headers)).toBe("203.0.113.1");
  });
});
