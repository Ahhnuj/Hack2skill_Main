import { insightResponseSchema } from "@/lib/schemas";
import type { InsightAnalysisResult } from "@/types";
import { calculateBurnoutScore } from "@/features/burnout/score";
import type { JournalEntry } from "@/types";

/**
 * Parse and validate AI insight response JSON.
 * Falls back to computed burnout score if AI score is invalid.
 */
export function parseInsightResponse(raw: string, entries: JournalEntry[]): InsightAnalysisResult {
  let parsed: unknown;

  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return getFallbackInsight(entries);
  }

  const result = insightResponseSchema.safeParse(parsed);
  if (!result.success) {
    return getFallbackInsight(entries);
  }

  return result.data;
}

/** Deterministic fallback when AI response is malformed */
export function getFallbackInsight(entries: JournalEntry[]): InsightAnalysisResult {
  const burnoutScore = calculateBurnoutScore(entries);
  const avgMood = entries.reduce((s, e) => s + e.mood, 0) / entries.length;

  return {
    triggers: [
      "Pre-exam anxiety appearing before mock tests rather than during them",
      "Sleep disruption correlated with intensive study days",
    ],
    patterns: [
      `Mood averaging ${avgMood.toFixed(1)}/5 over ${entries.length} entries`,
      "Stress language increases on days before scheduled assessments",
    ],
    burnoutScore,
    suggestedCoping:
      "Try a 4-7-8 breathing exercise tonight and set a hard stop time for studying 30 minutes before sleep.",
    motivationalNote:
      "You're showing up for yourself by journaling — that awareness is a strength. Small, consistent steps beat heroic bursts.",
  };
}

/** Demo insight for offline/demo mode */
export function getDemoInsight(examType: string): InsightAnalysisResult {
  return {
    triggers: [
      `Your stress spikes the night BEFORE ${examType} mock tests, not during the test itself`,
      "Comparison with peers on social media triggers self-doubt within 2 hours of scrolling",
      "Skipping meals during long study blocks correlates with your lowest mood entries",
    ],
    patterns: [
      "Mood drops follow 3+ consecutive days of 10+ hour study sessions",
      "You recover faster when you write about small wins, not just struggles",
      "Weekend entries are consistently 1.5 points higher than weekday entries",
    ],
    burnoutScore: 62,
    suggestedCoping:
      "Before your next mock test, try a 10-minute evening walk and write down 3 things you already know well — this shifts focus from fear to competence.",
    motivationalNote:
      "The fact that you're tracking your inner world while preparing for one of India's toughest exams shows real maturity. Your pre-test anxiety isn't weakness — it's your mind caring deeply about your future.",
  };
}
