/** Supported Indian competitive exam types for personalization */
export type ExamType = "NEET" | "JEE" | "CUET" | "CAT" | "GATE" | "UPSC";

/** Mood pulse scale 1–5 */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface UserProfile {
  name: string;
  examType: ExamType;
  consentGiven: boolean;
  consentTimestamp: string;
  onboardedAt: string;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: MoodLevel;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  crisisDetected?: boolean;
}

export interface MirrorInsight {
  id: string;
  triggers: string[];
  patterns: string[];
  burnoutScore: number;
  suggestedCoping: string;
  motivationalNote: string;
  generatedAt: string;
}

export interface BurnoutDataPoint {
  date: string;
  score: number;
  mood: MoodLevel;
}

export interface AppState {
  profile: UserProfile | null;
  entries: JournalEntry[];
  chatHistory: ChatMessage[];
  insights: MirrorInsight[];
  lastInsightAt: string | null;
}

export interface InsightAnalysisResult {
  triggers: string[];
  patterns: string[];
  burnoutScore: number;
  suggestedCoping: string;
  motivationalNote: string;
}

export interface CrisisDetectionResult {
  detected: boolean;
  severity: "none" | "moderate" | "acute";
  matchedKeywords: string[];
}
