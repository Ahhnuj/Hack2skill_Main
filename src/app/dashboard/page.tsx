"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useMirrorInsightMutation } from "@/hooks/useMirrorInsight";

/**
 * Dashboard — Burnout Radar + Mirror Insights (GenAI pattern analysis).
 * @requirement Burnout visualization + hidden stress trigger discovery
 * @see REQUIREMENTS.md#requirement-checklist rows 3, 5
 */
export default function DashboardPage() {
  const router = useRouter();
  const { state, isLoading, addInsight } = useApp();
  const insightMutation = useMirrorInsightMutation();

  useEffect(() => {
    if (!isLoading && !state.profile) {
      router.replace("/onboarding");
    }
  }, [isLoading, state.profile, router]);

  if (isLoading || !state.profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Loading dashboard"
      >
        <p className="text-slate-400" aria-live="polite">
          Loading...
        </p>
      </div>
    );
  }

  const handleGenerateInsight = () => {
    insightMutation.mutate(
      {
        entries: state.entries.map((e) => ({
          content: e.content,
          mood: e.mood,
          createdAt: e.createdAt,
        })),
        examType: state.profile!.examType,
        userName: state.profile!.name,
      },
      { onSuccess: (data) => void addInsight(data) },
    );
  };

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Burnout Radar</h1>
        <p className="text-slate-400 mt-1">
          Hi {state.profile.name} — hidden stress triggers and emotional patterns for{" "}
          {state.profile.examType} prep that standard mood trackers miss.
        </p>
      </header>
      <Dashboard
        entries={state.entries}
        latestInsight={state.insights[0] ?? null}
        onGenerateInsight={handleGenerateInsight}
        isGenerating={insightMutation.isPending}
      />
    </AppShell>
  );
}
