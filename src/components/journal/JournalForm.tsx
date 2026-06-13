"use client";

import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "@/components/journal/MoodSelector";
import { CrisisBanner } from "@/components/crisis/CrisisBanner";
import { detectCrisis, shouldShowCrisisBanner } from "@/features/crisis/detector";
import { validateJournalContent } from "@/features/journal/mood-parser";
import { debounce } from "@/lib/utils";
import type { MoodLevel } from "@/types";
import { Save, Loader2 } from "lucide-react";

interface JournalFormProps {
  onSubmit: (content: string, mood: MoodLevel) => Promise<void>;
  initialContent?: string;
  initialMood?: MoodLevel;
}

/** Reflective journaling form with mood pulse and crisis detection */
export function JournalForm({ onSubmit, initialContent = "", initialMood = 3 }: JournalFormProps) {
  const [content, setContent] = useState(initialContent);
  const [mood, setMood] = useState<MoodLevel>(initialMood);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [crisis, setCrisis] = useState(detectCrisis(initialContent));

  const debouncedCrisisCheck = useMemo(
    () =>
      debounce((text: string) => {
        setCrisis(detectCrisis(text));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }, 500),
    [],
  );

  useEffect(() => {
    if (content) debouncedCrisisCheck(content);
  }, [content, debouncedCrisisCheck]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateJournalContent(content);
    if (!validation.valid) {
      setError(validation.error ?? "Invalid entry");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim(), mood);
      setContent("");
      setMood(3);
    } catch {
      setError("Failed to save entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Journal entry form">
      {shouldShowCrisisBanner(crisis) && (
        <CrisisBanner severity={crisis.severity === "acute" ? "acute" : "moderate"} />
      )}

      <div className="space-y-2">
        <label htmlFor="journal-content" className="text-sm font-medium text-slate-300">
          What&apos;s on your mind today?
        </label>
        <Textarea
          id="journal-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely — your thoughts, feelings, what happened today. No judgment here."
          aria-label="Reflective journal entry text"
          aria-describedby="journal-hint journal-error"
          aria-invalid={!!error}
          maxLength={10000}
          rows={6}
        />
        <p id="journal-hint" className="text-xs text-slate-500">
          {content.length}/10,000 characters
          {draftSaved && (
            <span className="ml-2 text-emerald-400" aria-live="polite">
              Draft noted
            </span>
          )}
        </p>
      </div>

      <MoodSelector value={mood} onChange={setMood} disabled={isSubmitting} />

      {error && (
        <p id="journal-error" role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full sm:w-auto"
        aria-label="Save journal entry"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Entry
          </>
        )}
      </Button>
    </form>
  );
}
