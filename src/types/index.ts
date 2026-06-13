/**
 * Shared domain types for MindMirror.
 * @module types
 */

/** Supported Indian competitive exam types for personalization */
export type ExamType = "NEET" | "JEE" | "CUET" | "CAT" | "GATE" | "UPSC";

/** Mood pulse scale 1 (lowest) through 5 (highest) */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

/**
 * User profile created during onboarding.
 * @property consentGiven - Must be true before any data is stored
 */
export interface UserProfile {
  name: string;
  examType: ExamType;
  consentGiven: boolean;
  consentTimestamp: string;
  onboardedAt: string;
}

/**
 * Reflective journal entry with mood pulse.
 * @property content - Open-ended journal text (encrypted at rest)
 */
export interface JournalEntry {
  id: string;
  content: string;
  mood: MoodLevel;
  createdAt: string;
  updatedAt: string;
}

/** Companion chat message (user or AI assistant) */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  crisisDetected?: boolean;
}

/** GenAI Mirror Insights analysis result */
export interface MirrorInsight {
  id: string;
  triggers: string[];
  patterns: string[];
  burnoutScore: number;
  suggestedCoping: string;
  motivationalNote: string;
  generatedAt: string;
}

/** Single data point for Burnout Radar chart */
export interface BurnoutDataPoint {
  date: string;
  score: number;
  mood: MoodLevel;
}

/** Full application state persisted locally (encrypted) */
export interface AppState {
  profile: UserProfile | null;
  entries: JournalEntry[];
  chatHistory: ChatMessage[];
  insights: MirrorInsight[];
  lastInsightAt: string | null;
}

/** Parsed AI insight before persistence */
export interface InsightAnalysisResult {
  triggers: string[];
  patterns: string[];
  burnoutScore: number;
  suggestedCoping: string;
  motivationalNote: string;
}

/**
 * Crisis keyword detection result.
 * @property severity - `acute` triggers helpline-only response (no AI)
 */
export interface CrisisDetectionResult {
  detected: boolean;
  severity: "none" | "moderate" | "acute";
  matchedKeywords: string[];
}
