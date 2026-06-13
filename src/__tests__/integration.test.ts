import { describe, it, expect } from "vitest";
import { mergeAppState } from "@/lib/storage/cloud-sync";
import { deviceIdSchema } from "@/lib/supabase/schemas";
import type { AppState } from "@/types";

describe("MindMirror integration suite", () => {
  it("validates device UUID format", () => {
    const result = deviceIdSchema.safeParse("550e8400-e29b-41d4-a716-446655440000");
    expect(result.success).toBe(true);
  });

  it("merges local and remote state preferring newer data", () => {
    const local: AppState = {
      profile: null,
      entries: [],
      chatHistory: [],
      insights: [],
      lastInsightAt: null,
    };
    const remote: AppState = {
      profile: {
        name: "Ananya",
        examType: "NEET",
        consentGiven: true,
        consentTimestamp: "2026-06-01T00:00:00Z",
        onboardedAt: "2026-06-13T00:00:00Z",
      },
      entries: [
        {
          id: "1",
          content: "Mock test tomorrow",
          mood: 2,
          createdAt: "2026-06-13T20:00:00Z",
          updatedAt: "2026-06-13T20:00:00Z",
        },
      ],
      chatHistory: [],
      insights: [],
      lastInsightAt: null,
    };
    const merged = mergeAppState(local, remote);
    expect(merged.profile?.name).toBe("Ananya");
    expect(merged.entries).toHaveLength(1);
  });
});
