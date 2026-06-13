import type { JournalEntry, MoodLevel } from "@/types";

/**
 * Calculate burnout risk score (0–100) from journal entries.
 * Weights recent entries more heavily; low moods and distress keywords increase score.
 */
export function calculateBurnoutScore(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const recent = sorted.slice(0, 14);
  let weightedSum = 0;
  let weightTotal = 0;

  recent.forEach((entry, index) => {
    const recencyWeight = 1 - index * 0.05;
    const moodStress = (6 - entry.mood) / 5;
    const textStress = estimateTextStress(entry.content);
    const entryScore = (moodStress * 0.6 + textStress * 0.4) * 100;
    weightedSum += entryScore * recencyWeight;
    weightTotal += recencyWeight;
  });

  const baseScore = weightTotal > 0 ? weightedSum / weightTotal : 0;

  const moodTrend = calculateMoodTrend(recent);
  const trendPenalty = moodTrend < 0 ? Math.abs(moodTrend) * 10 : 0;

  return Math.min(100, Math.round(Math.max(0, baseScore + trendPenalty)));
}

/** Estimate stress from journal text (0–1) */
function estimateTextStress(content: string): number {
  if (!content.trim()) return 0.3;

  const stressWords = [
    "stress",
    "anxious",
    "anxiety",
    "panic",
    "tired",
    "sleep",
    "insomnia",
    "pressure",
    "fail",
    "worried",
    "scared",
    "overwhelmed",
    "burnout",
    "exhausted",
    "hopeless",
  ];

  const lower = content.toLowerCase();
  const matches = stressWords.filter((w) => lower.includes(w)).length;
  const lengthFactor = Math.min(1, content.length / 500);
  return Math.min(1, matches * 0.15 * lengthFactor + (matches > 0 ? 0.2 : 0));
}

/** Negative trend = declining mood over time */
function calculateMoodTrend(entries: JournalEntry[]): number {
  if (entries.length < 2) return 0;
  const chronological = [...entries].reverse();
  const firstHalf = chronological.slice(0, Math.ceil(chronological.length / 2));
  const secondHalf = chronological.slice(Math.ceil(chronological.length / 2));
  const avgFirst = firstHalf.reduce((s, e) => s + e.mood, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((s, e) => s + e.mood, 0) / secondHalf.length;
  return avgSecond - avgFirst;
}

/** Map entries to burnout chart data points */
export function buildBurnoutTrend(
  entries: JournalEntry[],
): { date: string; score: number; mood: MoodLevel }[] {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return sorted.map((_, index) => {
    const slice = sorted.slice(0, index + 1);
    const date = sorted[index].createdAt.split("T")[0];
    return {
      date,
      score: calculateBurnoutScore(slice),
      mood: sorted[index].mood,
    };
  });
}

/** Human-readable burnout risk label */
export function getBurnoutRiskLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 75) return { label: "High Risk", color: "text-red-400" };
  if (score >= 50) return { label: "Moderate", color: "text-amber-400" };
  if (score >= 25) return { label: "Watch", color: "text-yellow-400" };
  return { label: "Low", color: "text-emerald-400" };
}
