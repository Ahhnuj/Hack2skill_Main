import type { IBurnoutScorer } from "@/lib/contracts";
import type { BurnoutDataPoint, JournalEntry } from "@/types";
import {
  buildBurnoutTrend,
  calculateBurnoutScore,
  getBurnoutRiskLabel,
} from "@/features/burnout/score";

/**
 * Default burnout scoring service implementing {@link IBurnoutScorer}.
 * Separates analytics logic from UI (Single Responsibility).
 */
export class BurnoutScorerService implements IBurnoutScorer {
  /**
   * @param entries - Journal history sorted by recency in caller
   * @returns Burnout risk score 0–100
   */
  calculateScore(entries: JournalEntry[]): number {
    return calculateBurnoutScore(entries);
  }

  /** @inheritdoc */
  buildTrend(entries: JournalEntry[]): BurnoutDataPoint[] {
    return buildBurnoutTrend(entries);
  }

  /** @inheritdoc */
  getRiskLabel(score: number): { label: string; color: string } {
    return getBurnoutRiskLabel(score);
  }
}

export const defaultBurnoutScorer: IBurnoutScorer = new BurnoutScorerService();
