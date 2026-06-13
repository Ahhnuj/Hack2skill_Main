"use client";

import { memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  calculateBurnoutScore,
  getBurnoutRiskLabel,
  buildBurnoutTrend,
} from "@/features/burnout/score";
import { MOOD_EMOJIS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { JournalEntry, MirrorInsight } from "@/types";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";

const BurnoutChart = dynamic(
  () => import("@/components/dashboard/BurnoutChart").then((m) => m.BurnoutChart),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-64 flex items-center justify-center text-slate-500"
        aria-busy="true"
        aria-label="Loading burnout chart"
      >
        Loading chart...
      </div>
    ),
  },
);

interface DashboardProps {
  entries: JournalEntry[];
  latestInsight: MirrorInsight | null;
  onGenerateInsight: () => void;
  isGenerating: boolean;
}

/** Burnout Radar dashboard with Mirror Insights */
export const Dashboard = memo(function Dashboard({
  entries,
  latestInsight,
  onGenerateInsight,
  isGenerating,
}: DashboardProps) {
  const burnoutScore = useMemo(() => calculateBurnoutScore(entries), [entries]);
  const risk = useMemo(() => getBurnoutRiskLabel(burnoutScore), [burnoutScore]);
  const trendData = useMemo(() => buildBurnoutTrend(entries), [entries]);
  const recentMood = entries[0]?.mood ?? 3;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card role="region" aria-label="Burnout radar score">
          <CardHeader className="pb-2">
            <CardDescription>Burnout Radar</CardDescription>
            <CardTitle
              className={`text-3xl ${risk.color}`}
              aria-label={`Burnout score ${burnoutScore} out of 100`}
            >
              {burnoutScore}
              <span className="text-base font-normal text-slate-400">/100</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-sm font-medium ${risk.color}`}>{risk.label}</p>
          </CardContent>
        </Card>

        <Card role="region" aria-label="Latest mood summary">
          <CardHeader className="pb-2">
            <CardDescription>Latest Mood</CardDescription>
            <CardTitle className="text-3xl" aria-label={`Latest mood level ${recentMood} of 5`}>
              <span aria-hidden="true">{MOOD_EMOJIS[recentMood]}</span>
              <span className="sr-only">Mood level {recentMood} of 5</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400">{entries.length} journal entries</p>
          </CardContent>
        </Card>

        <Card role="region" aria-label="Mirror insights pattern engine">
          <CardHeader className="pb-2">
            <CardDescription>Pattern Engine</CardDescription>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-400" aria-hidden="true" />
              Mirror Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <button
              type="button"
              onClick={onGenerateInsight}
              disabled={isGenerating || entries.length === 0}
              className="text-sm text-violet-400 hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded disabled:opacity-50"
              aria-label="Reveal hidden stress patterns using Mirror Insights AI analysis"
              aria-busy={isGenerating}
            >
              {isGenerating ? "Analyzing..." : "Reveal hidden patterns →"}
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-400" aria-hidden="true" />
            Burnout Trend
          </CardTitle>
          <CardDescription>Your wellness trajectory over time</CardDescription>
        </CardHeader>
        <CardContent>
          {trendData.length > 0 ? (
            <BurnoutChart data={trendData} />
          ) : (
            <p className="text-slate-500 text-sm py-8 text-center">
              Write journal entries to see your burnout trend
            </p>
          )}
        </CardContent>
      </Card>

      {latestInsight && (
        <Card className="border-violet-500/30 bg-violet-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-200">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Mirror Insight — What standard trackers miss
            </CardTitle>
            <CardDescription>Generated {formatDate(latestInsight.generatedAt)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <section aria-labelledby="triggers-heading">
              <h3
                id="triggers-heading"
                className="text-sm font-semibold text-amber-300 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                Hidden Stress Triggers
              </h3>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-slate-300">
                {latestInsight.triggers.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="patterns-heading">
              <h3 id="patterns-heading" className="text-sm font-semibold text-violet-300">
                Emotional Patterns
              </h3>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-slate-300">
                {latestInsight.patterns.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="coping-heading">
              <h3 id="coping-heading" className="text-sm font-semibold text-emerald-300">
                Suggested Coping Action
              </h3>
              <p className="mt-1 text-sm text-slate-300">{latestInsight.suggestedCoping}</p>
            </section>

            <blockquote className="border-l-4 border-violet-500 pl-4 italic text-slate-300 text-sm">
              {latestInsight.motivationalNote}
            </blockquote>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
