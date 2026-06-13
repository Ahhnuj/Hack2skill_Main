import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Supabase table name for encrypted app state blobs */
export const SUPABASE_STATE_TABLE = "mindmirror_states";

function getSupabaseUrl(): string | undefined {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
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
