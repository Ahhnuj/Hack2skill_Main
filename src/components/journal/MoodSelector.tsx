"use client";

import { cn, ariaNumber } from "@/lib/utils";
import { MOOD_EMOJIS, MOOD_LABELS } from "@/lib/constants";
import type { MoodLevel } from "@/types";

interface MoodSelectorProps {
  value: MoodLevel;
  onChange: (mood: MoodLevel) => void;
  disabled?: boolean;
}

/**
 * Accessible mood pulse selector (1–5).
 * @requirement Mood pulse (1–5) alongside reflective journal text
 * @param value - Currently selected mood level
 * @param onChange - Callback when user selects a mood
 * @param disabled - Whether selection is disabled during submit
 * @returns Accessible fieldset with radio-style mood buttons
 */
export function MoodSelector({ value, onChange, disabled }: MoodSelectorProps) {
  const moods: MoodLevel[] = [1, 2, 3, 4, 5];

  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-sm font-medium text-slate-300">How are you feeling right now?</legend>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={`Mood level from ${ariaNumber(1, 5)} to ${ariaNumber(5, 5)}`}
      >
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            role="radio"
            aria-checked={value === mood}
            aria-label={`Mood ${ariaNumber(mood, 5)}: ${MOOD_LABELS[mood]}`}
            disabled={disabled}
            onClick={() => onChange(mood)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-4 py-3 min-w-[4.5rem] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
              value === mood
                ? "border-violet-500 bg-violet-500/20 scale-105"
                : "border-slate-700 bg-slate-800/50 hover:border-slate-600",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {MOOD_EMOJIS[mood]}
            </span>
            <span className="text-xs text-slate-400">{MOOD_LABELS[mood]}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
