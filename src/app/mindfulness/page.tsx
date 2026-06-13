"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { calculateBurnoutScore } from "@/features/burnout/score";

const MindfulnessEngine = dynamic(
  () => import("@/components/mindfulness/MindfulnessEngine").then((m) => m.MindfulnessEngine),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-48 flex items-center justify-center text-slate-500"
        role="status"
        aria-label="Loading mindfulness exercises"
      >
        Loading mindfulness...
      </div>
    ),
  },
);

/**
 * Micro-Mindfulness — adaptive breathing exercises based on distress level.
 * @requirement Micro-mindfulness interventions
 * @see REQUIREMENTS.md#requirement-checklist row 6
 */
export default function MindfulnessPage() {
  const router = useRouter();
  const { state, isLoading } = useApp();

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
        aria-label="Loading mindfulness page"
      >
        <p className="text-slate-400" aria-live="polite">
          Loading...
        </p>
      </div>
    );
  }

  const burnoutScore = calculateBurnoutScore(state.entries);
  const distressLevel = burnoutScore >= 75 ? "high" : burnoutScore >= 50 ? "moderate" : "low";

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Micro-Mindfulness Engine</h1>
        <p className="text-slate-400 mt-1">
          Adaptive breathing and grounding exercises triggered by your detected distress level —
          real-time tailored coping for {state.profile.examType} prep.
        </p>
      </header>

      <MindfulnessEngine distressLevel={distressLevel} />
    </AppShell>
  );
}
