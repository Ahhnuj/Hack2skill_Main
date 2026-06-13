"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { MoodOrb } from "@/components/layout/MoodOrb";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

/**
 * Landing page — value proposition, Get Started, and Try Demo Mode.
 * @requirement Demo mode without API keys + exam aspirant onboarding entry
 * @see REQUIREMENTS.md#requirement-checklist rows 8, 11
 */
export default function HomePage() {
  const router = useRouter();
  const { state, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && state.profile) {
      router.replace("/dashboard");
    }
  }, [isLoading, state.profile, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950"
        role="status"
        aria-label="Loading MindMirror"
      >
        <p className="text-slate-400" aria-live="polite">
          Loading MindMirror...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex flex-col items-center justify-center px-4 text-center">
      <MoodOrb mood={3} size="lg" className="mb-8" />
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 mb-4">{APP_NAME}</h1>
      <p className="text-lg text-slate-400 max-w-xl mb-8">
        Reflective journaling, mood logs, hidden stress triggers, and an empathetic AI companion
        with adaptive mindfulness for NEET, JEE, CUET, CAT, GATE &amp; UPSC aspirants.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/onboarding"
          aria-label="Get started with MindMirror onboarding"
          className="inline-flex items-center justify-center h-12 px-6 text-base rounded-lg bg-violet-600 text-white hover:bg-violet-500 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          Get Started
        </Link>
        <Button
          variant="outline"
          size="lg"
          aria-label="Try MindMirror demo mode"
          onClick={() => router.push("/onboarding")}
        >
          Try Demo Mode
        </Button>
      </div>
    </div>
  );
}
