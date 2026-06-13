import type { MoodLevel } from "@/types";

const VALID_MOODS: MoodLevel[] = [1, 2, 3, 4, 5];

/**
 * Parse and validate a mood value from unknown input.
 * Returns null if invalid.
 */
export function parseMood(value: unknown): MoodLevel | null {
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  if (typeof num !== "number" || isNaN(num)) return null;
  if (!VALID_MOODS.includes(num as MoodLevel)) return null;
  return num as MoodLevel;
}

/**
 * Extract mood hints from free-text journal content.
 * Looks for explicit mood mentions; returns suggested mood or null.
 */
export function inferMoodFromText(text: string): MoodLevel | null {
  if (!text.trim()) return null;
  const lower = text.toLowerCase();

  const moodPatterns: { pattern: RegExp; mood: MoodLevel }[] = [
    { pattern: /\b(terrible|awful|miserable|devastated)\b/, mood: 1 },
    { pattern: /\b(sad|down|low|upset|disappointed)\b/, mood: 2 },
    { pattern: /\b(okay|ok|fine|neutral|meh|average)\b/, mood: 3 },
    { pattern: /\b(good|better|positive|hopeful|calm)\b/, mood: 4 },
    { pattern: /\b(great|amazing|happy|excited|wonderful|grateful)\b/, mood: 5 },
  ];

  for (const { pattern, mood } of moodPatterns) {
    if (pattern.test(lower)) return mood;
  }
  return null;
}

/** Validate journal content length */
export function validateJournalContent(content: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Journal entry cannot be empty" };
  }
  if (trimmed.length > 10000) {
    return { valid: false, error: "Journal entry exceeds 10,000 characters" };
  }
  return { valid: true };
}
