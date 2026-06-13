import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Supabase table name for encrypted app state blobs */
export const SUPABASE_STATE_TABLE = "mindmirror_states";

/** Valid Supabase project URL: https://<project-ref>.supabase.co */
export function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  if (!raw?.trim()) return undefined;

  let url = raw.trim().replace(/\/$/, "");

  // Common Render misconfiguration — Supabase uses .co not .com
  if (url.includes(".supabase.com")) {
    url = url.replace(".supabase.com", ".supabase.co");
    console.warn(
      "[MindMirror] SUPABASE_URL had .supabase.com — auto-corrected to .supabase.co. Update your Render env var.",
    );
  }

  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
    console.error("[MindMirror] Invalid SUPABASE_URL. Expected https://<project-ref>.supabase.co");
    return undefined;
  }

  return url;
}

function getSupabaseUrl(): string | undefined {
  const raw = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  return normalizeSupabaseUrl(raw);
}

/** True when Supabase errors are DNS/network failures (misconfigured URL or outage) */
export function isSupabaseConnectivityError(error: {
  message?: string;
  details?: string;
  code?: string;
}): boolean {
  const text = `${error.message ?? ""} ${error.details ?? ""} ${error.code ?? ""}`.toLowerCase();
  return (
    text.includes("fetch failed") ||
    text.includes("enotfound") ||
    text.includes("econnrefused") ||
    text.includes("etimedout") ||
    text.includes("network")
  );
}

/** Prefer service role; fall back to publishable/anon key for server API routes */
function getSupabaseKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Returns true when Supabase cloud sync is configured (server-side).
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

/**
 * Server-side Supabase client. Never import in client components.
 * Uses service role when available; otherwise publishable/anon key (requires RLS policies).
 */
export function createSupabaseAdmin(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
