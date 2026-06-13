"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EXAM_TYPES, DISCLAIMER } from "@/lib/constants";
import { onboardingSchema } from "@/lib/schemas";
import type { ExamType } from "@/types";
import { MoodOrb } from "@/components/layout/MoodOrb";
import { cn } from "@/lib/utils";

/**
 * Onboarding — exam type selection, name, and informed consent.
 * @requirement Exam-specific onboarding with consent
 * @see REQUIREMENTS.md#requirement-checklist row 8
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, seedDemoData } = useApp();
  const [name, setName] = useState("");
  const [examType, setExamType] = useState<ExamType>("NEET");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = onboardingSchema.safeParse({
      name,
      examType,
      consentGiven: consent,
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please complete all fields");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await seedDemoData(result.data.name, result.data.examType);
      await setProfile({
        name: result.data.name,
        examType: result.data.examType,
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
        onboardedAt: new Date().toISOString(),
      });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <MoodOrb mood={4} size="md" />
          </div>
          <CardTitle className="text-2xl">Welcome to MindMirror</CardTitle>
          <CardDescription>Let&apos;s personalize your wellness companion</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-6"
            aria-label="MindMirror onboarding form"
          >
            <div className="space-y-2">
              <Label htmlFor="name">What should we call you?</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                aria-label="Enter your first name"
                maxLength={50}
                required
                aria-describedby={error ? "onboard-error" : undefined}
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-slate-300">
                Which exam are you preparing for?
              </legend>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Exam type">
                {EXAM_TYPES.map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    role="radio"
                    aria-checked={examType === exam}
                    aria-label={`Select ${exam} exam preparation`}
                    onClick={() => setExamType(exam)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                      examType === exam
                        ? "border-violet-500 bg-violet-500/20 text-violet-200"
                        : "border-slate-700 text-slate-400 hover:border-slate-600",
                    )}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-label="Consent to AI wellness analysis and local encrypted storage"
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-violet-600 focus:ring-violet-400"
                required
              />
              <Label htmlFor="consent" className="text-sm text-slate-400 leading-relaxed">
                I understand that MindMirror is an AI wellness companion, not a therapist. My
                journal data is encrypted and stored locally on this device. I consent to AI
                analysis of my entries for wellness insights.
              </Label>
            </div>

            <p className="text-xs text-slate-500">{DISCLAIMER}</p>

            {error && (
              <p id="onboard-error" role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-label="Begin MindMirror wellness journey"
            >
              {isSubmitting ? "Setting up..." : "Begin My Journey"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
