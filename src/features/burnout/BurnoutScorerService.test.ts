import { describe, it, expect } from "vitest";
import { BurnoutScorerService } from "@/features/burnout/BurnoutScorerService";
import type { JournalEntry } from "@/types";

describe("BurnoutScorerService", () => {
  const scorer = new BurnoutScorerService();

  const entry = (mood: JournalEntry["mood"], content: string): JournalEntry => ({
    id: "1",
    content,
    mood,
    createdAt: "2026-06-13T10:00:00.000Z",
    updatedAt: "2026-06-13T10:00:00.000Z",
  });

  it("implements IBurnoutScorer with score and trend", () => {
    const entries = [entry(2, "Very stressed about NEET mock tomorrow")];
    expect(scorer.calculateScore(entries)).toBeGreaterThan(0);
    expect(scorer.buildTrend(entries)).toHaveLength(1);
    expect(scorer.getRiskLabel(80).label).toBe("High Risk");
  });
});
