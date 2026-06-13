import type { CrisisDetectionResult } from "@/types";

/** Keywords indicating moderate distress */
const MODERATE_KEYWORDS = [
  "hopeless",
  "worthless",
  "can't go on",
  "cant go on",
  "give up",
  "no point",
  "exhausted",
  "burned out",
  "burnt out",
  "overwhelmed",
  "breaking down",
  "can't cope",
  "cant cope",
  "hate myself",
  "failure",
  "failed everything",
];

/** Keywords indicating acute crisis — immediate helpline surfacing */
const ACUTE_KEYWORDS = [
  "suicide",
  "suicidal",
  "kill myself",
  "end my life",
  "want to die",
  "don't want to live",
  "dont want to live",
  "self harm",
  "self-harm",
  "hurt myself",
  "cut myself",
  "no reason to live",
  "better off dead",
  "ending it all",
];

/**
 * Detect crisis language in user text.
 * Pure function — no side effects.
 */
export function detectCrisis(text: string): CrisisDetectionResult {
  if (!text || text.trim().length === 0) {
    return { detected: false, severity: "none", matchedKeywords: [] };
  }

  const normalized = text.toLowerCase().trim();
  const acuteMatches = ACUTE_KEYWORDS.filter((kw) => normalized.includes(kw));
  if (acuteMatches.length > 0) {
    return {
      detected: true,
      severity: "acute",
      matchedKeywords: acuteMatches,
    };
  }

  const moderateMatches = MODERATE_KEYWORDS.filter((kw) => normalized.includes(kw));
  if (moderateMatches.length > 0) {
    return {
      detected: true,
      severity: "moderate",
      matchedKeywords: moderateMatches,
    };
  }

  return { detected: false, severity: "none", matchedKeywords: [] };
}

/** Whether crisis UI should be shown prominently */
export function shouldShowCrisisBanner(result: CrisisDetectionResult): boolean {
  return result.detected && result.severity !== "none";
}

/** Whether to block AI and show helplines only */
export function isAcuteCrisis(result: CrisisDetectionResult): boolean {
  return result.severity === "acute";
}
