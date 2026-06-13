"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/AppProvider";
import { AppShell } from "@/components/layout/AppShell";
import { JournalForm } from "@/components/journal/JournalForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOOD_EMOJIS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

export default function JournalPage() {
  const router = useRouter();
  const { state, isLoading, addJournalEntry } = useApp();

  useEffect(() => {
    if (!isLoading && !state.profile) {
      router.replace("/onboarding");
    }
  }, [isLoading, state.profile, router]);

  if (isLoading || !state.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400" aria-live="polite">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <AppShell>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Reflective Journal</h1>
        <p className="text-slate-400 mt-1">
          Write freely — MindMirror reads between the lines to find patterns you can&apos;t see.
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <JournalForm
            onSubmit={async (content, mood) => {
              await addJournalEntry(content, mood);
            }}
          />
        </CardContent>
      </Card>

      {state.entries.length > 0 && (
        <section aria-labelledby="past-entries-heading">
          <h2 id="past-entries-heading" className="text-lg font-semibold text-slate-200 mb-4">
            Past Entries
          </h2>
          <ul className="space-y-4">
            {state.entries.map((entry) => (
              <li key={entry.id}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <time className="text-xs text-slate-500" dateTime={entry.createdAt}>
                        {formatDateTime(entry.createdAt)}
                      </time>
                      <span aria-label={`Mood ${entry.mood} of 5`}>{MOOD_EMOJIS[entry.mood]}</span>
                    </div>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AppShell>
  );
}
