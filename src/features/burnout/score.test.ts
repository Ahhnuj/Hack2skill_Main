import { describe, it, expect } from "vitest";
import {
  calculateBurnoutScore,
  buildBurnoutTrend,
  getBurnoutRiskLabel,
} from "@/features/burnout/score";
import type { JournalEntry } from "@/types";

function makeEntry(mood: JournalEntry["mood"], content: string, daysAgo: number): JournalEntry {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: String(daysAgo),
    mood,
    content,
    createdAt: d.toISOString(),
    updatedAt: d.toISOString(),
  };
}

describe("calculateBurnoutScore", () => {
  it("returns 0 for empty entries", () => {
    expect(calculateBurnoutScore([])).toBe(0);
  });

  it("returns higher score for low mood entries", () => {
    const low = [
      makeEntry(1, "stressed anxious overwhelmed", 0),
      makeEntry(2, "tired and exhausted", 1),
    ];
    const high = [
      makeEntry(5, "great day feeling happy", 0),
      makeEntry(4, "good productive calm", 1),
    ];
    expect(calculateBurnoutScore(low)).toBeGreaterThan(calculateBurnoutScore(high));
  });

  it("caps score at 100", () => {
    const entries = Array.from({ length: 14 }, (_, i) =>
      makeEntry(1, "stress anxiety panic burnout exhausted hopeless", i),
    );
    expect(calculateBurnoutScore(entries)).toBeLessThanOrEqual(100);
  });
});

describe("buildBurnoutTrend", () => {
  it("returns data points for each entry", () => {
    const entries = [makeEntry(3, "ok", 2), makeEntry(2, "stress", 1), makeEntry(4, "better", 0)];
    const trend = buildBurnoutTrend(entries);
    expect(trend).toHaveLength(3);
    expect(trend[0]).toHaveProperty("score");
    expect(trend[0]).toHaveProperty("mood");
  });
});

describe("getBurnoutRiskLabel", () => {
  it("returns correct labels for score ranges", () => {
    expect(getBurnoutRiskLabel(10).label).toBe("Low");
    expect(getBurnoutRiskLabel(40).label).toBe("Watch");
    expect(getBurnoutRiskLabel(60).label).toBe("Moderate");
    expect(getBurnoutRiskLabel(80).label).toBe("High Risk");
  });
});
