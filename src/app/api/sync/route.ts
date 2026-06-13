import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseAdmin,
  isSupabaseConfigured,
  SUPABASE_STATE_TABLE,
} from "@/lib/supabase/admin";
import {
  syncPullQuerySchema,
  syncPushBodySchema,
  syncDeleteBodySchema,
} from "@/lib/supabase/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * GET /api/sync?deviceId= — pull encrypted state from Supabase
 */
export async function GET(request: NextRequest) {
  const parsed = syncPullQuerySchema.safeParse({
    deviceId: request.nextUrl.searchParams.get("deviceId"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid deviceId" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ encryptedState: null, updatedAt: null });
  }

  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`sync-get-${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ encryptedState: null, updatedAt: null });
  }

  const { data, error } = await supabase
    .from(SUPABASE_STATE_TABLE)
    .select("encrypted_state, updated_at")
    .eq("device_id", parsed.data.deviceId)
    .maybeSingle();

  if (error) {
    console.error("Supabase pull error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }

  return NextResponse.json({
    encryptedState: data?.encrypted_state ?? null,
    updatedAt: data?.updated_at ?? null,
  });
}

/**
 * POST /api/sync — push encrypted state to Supabase
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = syncPushBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, synced: false });
  }

  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`sync-post-${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: true, synced: false });
  }

  const { error } = await supabase.from(SUPABASE_STATE_TABLE).upsert(
    {
      device_id: parsed.data.deviceId,
      encrypted_state: parsed.data.encryptedState,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "device_id" },
  );

  if (error) {
    console.error("Supabase push error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, synced: true });
}

/**
 * DELETE /api/sync — remove cloud state for device
 */
export async function DELETE(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = syncDeleteBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, deleted: false });
  }

  const ip = getClientIp(request.headers);
  const rateLimit = checkRateLimit(`sync-delete-${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: true, deleted: false });
  }

  const { error } = await supabase
    .from(SUPABASE_STATE_TABLE)
    .delete()
    .eq("device_id", parsed.data.deviceId);

  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, deleted: true });
}
