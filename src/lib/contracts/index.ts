import type {
  AppState,
  BurnoutDataPoint,
  CrisisDetectionResult,
  JournalEntry,
  MoodLevel,
  UserProfile,
} from "@/types";

/**
 * Domain contracts for MindMirror services.
 * Follows SOLID: each interface has a single responsibility and enables dependency inversion in tests.
 * @module contracts
 */

/** Encrypted local-first persistence (Single Responsibility) */
export interface IStateRepository {
  /** Load merged local/cloud app state */
  loadState(): Promise<AppState>;
  /** Persist encrypted state locally and optionally sync to cloud */
  saveState(state: AppState): Promise<void>;
  /** Wipe all local and remote user data */
  deleteAllData(): Promise<void>;
  /** Save onboarding profile */
  saveProfile(profile: UserProfile): Promise<AppState>;
  /** Append a reflective journal entry with mood pulse */
  addEntry(content: string, mood: MoodLevel): Promise<AppState>;
  /** Replace entire state (demo seeding) */
  replaceState(state: AppState): Promise<void>;
}

/** Crisis language detection (Interface Segregation) */
export interface ICrisisDetector {
  /** Scan user text for moderate or acute distress signals */
  detect(text: string): CrisisDetectionResult;
  /** Whether to surface the helpline banner */
  shouldShowBanner(result: CrisisDetectionResult): boolean;
  /** Whether to block AI and show crisis response only */
  isAcute(result: CrisisDetectionResult): boolean;
}

/** Optional Supabase encrypted blob sync (Dependency Inversion) */
export interface ICloudSyncAdapter {
  pull(): Promise<{ encryptedState: string | null; updatedAt: string | null } | null>;
  push(encryptedState: string): Promise<boolean>;
  delete(): Promise<boolean>;
  merge(local: AppState, remote: AppState): AppState;
}

/** Burnout analytics from journal history (Open/Closed — swappable scoring) */
export interface IBurnoutScorer {
  calculateScore(entries: JournalEntry[]): number;
  buildTrend(entries: JournalEntry[]): BurnoutDataPoint[];
  getRiskLabel(score: number): { label: string; color: string };
}

/** AES-GCM encryption for localStorage blobs */
export interface IEncryptionService {
  encrypt(plaintext: string): Promise<string>;
  decrypt(encrypted: string): Promise<string>;
}

/** Rate limiting for sensitive AI/sync API routes */
export interface IRateLimiter {
  check(identifier: string): { allowed: boolean; remaining: number; resetAt: number };
  getClientIp(headers: Headers): string;
}
