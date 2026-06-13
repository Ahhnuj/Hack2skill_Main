import { describe, it, expect } from "vitest";
import {
  parseInsightResponse,
  getFallbackInsight,
  getDemoInsight,
} from "@/features/ai/parsers/insights";
import type { JournalEntry } from "@/types";

const sampleEntries: JournalEntry[] = [
  {
    id: "1",
    content: "Mock test tomorrow, can't sleep",
    mood: 2,
    createdAt: "2026-06-10T20:00:00Z",
    updatedAt: "2026-06-10T20:00:00Z",
  },
];

describe("parseInsightResponse", () => {
  it("parses valid JSON response", () => {
    const raw = JSON.stringify({
      triggers: ["Pre-test anxiety"],
      patterns: ["Night-before stress"],
      burnoutScore: 55,
      suggestedCoping: "Try breathing exercises",
      motivationalNote: "You are doing great",
    });
    const result = parseInsightResponse(raw, sampleEntries);
    expect(result.triggers).toContain("Pre-test anxiety");
    expect(result.burnoutScore).toBe(55);
  });

  it("strips markdown fences from response", () => {
    const raw =
      '```json\n{"triggers":["t"],"patterns":["p"],"burnoutScore":30,"suggestedCoping":"c","motivationalNote":"m"}\n```';
    const result = parseInsightResponse(raw, sampleEntries);
    expect(result.triggers).toContain("t");
  });

  it("falls back on invalid JSON", () => {
    const result = parseInsightResponse("not json at all", sampleEntries);
    expect(result.triggers.length).toBeGreaterThan(0);
    expect(result.burnoutScore).toBeGreaterThanOrEqual(0);
  });

  it("falls back on schema validation failure", () => {
    const raw = JSON.stringify({ triggers: [], patterns: [] });
    const result = parseInsightResponse(raw, sampleEntries);
    expect(result.suggestedCoping).toBeTruthy();
  });
});

describe("getFallbackInsight", () => {
  it("returns valid structure with empty entries", () => {
    const result = getFallbackInsight([]);
    expect(result.burnoutScore).toBe(0);
    expect(result.patterns.length).toBeGreaterThan(0);
  });
});

describe("getDemoInsight", () => {
  it("includes exam type in triggers", () => {
    const result = getDemoInsight("NEET");
    expect(result.triggers.some((t) => t.includes("NEET"))).toBe(true);
  });
});
