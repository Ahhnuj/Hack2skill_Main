import type { ICrisisDetector } from "@/lib/contracts";
import type { CrisisDetectionResult } from "@/types";
import { detectCrisis, isAcuteCrisis, shouldShowCrisisBanner } from "@/features/crisis/detector";

/**
 * Default crisis detector implementation.
 * Wraps pure functions behind an injectable service (Dependency Inversion).
 */
export class CrisisDetectorService implements ICrisisDetector {
  /**
   * @param text - User journal or chat message
   * @returns Detection result with severity and matched keywords
   */
  detect(text: string): CrisisDetectionResult {
    return detectCrisis(text);
  }

  /** @inheritdoc */
  shouldShowBanner(result: CrisisDetectionResult): boolean {
    return shouldShowCrisisBanner(result);
  }

  /** @inheritdoc */
  isAcute(result: CrisisDetectionResult): boolean {
    return isAcuteCrisis(result);
  }
}

/** Shared singleton for app and API routes */
export const defaultCrisisDetector: ICrisisDetector = new CrisisDetectorService();
