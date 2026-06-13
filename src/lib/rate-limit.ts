/**
 * Simple in-memory rate limiter for API routes.
 * Tracks requests per IP with sliding window.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment rate limit for a given identifier (typically IP).
 */
export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now >= entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Extract client IP from Next.js request headers */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headers.get("x-real-ip") ?? "unknown"
  );
}

/** Reset store — for testing only */
export function resetRateLimitStore(): void {
  store.clear();
}
