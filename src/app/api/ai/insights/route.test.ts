import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as insightPost } from "@/app/api/ai/insights/route";

describe("insights API route", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
  });
  it("rejects invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/ai/insights", {
      method: "POST",
      body: "invalid",
    });
    const res = await insightPost(req);
    expect(res.status).toBe(400);
  });

  it("rejects empty entries", async () => {
    const req = new NextRequest("http://localhost/api/ai/insights", {
      method: "POST",
      body: JSON.stringify({
        entries: [],
        examType: "NEET",
        userName: "Test",
      }),
    });
    const res = await insightPost(req);
    expect(res.status).toBe(400);
  });

  it("returns demo insight without API key", async () => {
    const req = new NextRequest("http://localhost/api/ai/insights", {
      method: "POST",
      body: JSON.stringify({
        entries: [{ content: "Mock test stress", mood: 2, createdAt: "2026-06-13T10:00:00Z" }],
        examType: "NEET",
        userName: "Test",
      }),
    });
    const res = await insightPost(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.triggers).toBeDefined();
    expect(json.burnoutScore).toBeGreaterThanOrEqual(0);
  });
});
