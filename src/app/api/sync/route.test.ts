import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "@/app/api/sync/route";
import { syncPullQuerySchema } from "@/lib/supabase/schemas";

describe("sync API route", () => {
  it("GET returns empty state when Supabase not configured", async () => {
    const req = new NextRequest(
      "http://localhost/api/sync?deviceId=550e8400-e29b-41d4-a716-446655440000",
    );
    const res = await GET(req);
    const json = await res.json();
    expect(json.encryptedState).toBeNull();
  });

  it("GET rejects invalid deviceId", async () => {
    const req = new NextRequest("http://localhost/api/sync?deviceId=not-a-uuid");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("POST rejects invalid JSON body", async () => {
    const req = new NextRequest("http://localhost/api/sync", {
      method: "POST",
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("DELETE rejects invalid deviceId", async () => {
    const req = new NextRequest("http://localhost/api/sync", {
      method: "DELETE",
      body: JSON.stringify({ deviceId: "bad" }),
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });
});

describe("sync schemas", () => {
  it("validates pull query device id", () => {
    expect(
      syncPullQuerySchema.safeParse({
        deviceId: "550e8400-e29b-41d4-a716-446655440000",
      }).success,
    ).toBe(true);
  });
});
