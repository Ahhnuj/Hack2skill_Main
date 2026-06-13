import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST as chatPost } from "@/app/api/ai/chat/route";

describe("chat API route", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
  });
  it("rejects invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/ai/chat", {
      method: "POST",
      body: "bad",
    });
    const res = await chatPost(req);
    expect(res.status).toBe(400);
  });

  it("returns crisis response for acute distress", async () => {
    const req = new NextRequest("http://localhost/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message: "I want to end my life",
        examType: "NEET",
        userName: "Test",
      }),
    });
    const res = await chatPost(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Tele-MANAS");
  });

  it("returns demo response for normal message without API key", async () => {
    const req = new NextRequest("http://localhost/api/ai/chat", {
      method: "POST",
      body: JSON.stringify({
        message: "I am stressed about my mock test",
        examType: "JEE",
        userName: "Rahul",
      }),
    });
    const res = await chatPost(req);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text.length).toBeGreaterThan(10);
  });
});
