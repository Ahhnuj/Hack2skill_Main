"use client";

import { cn } from "@/lib/utils";
import type { MoodLevel } from "@/types";

interface MoodOrbProps {
  mood: MoodLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MOOD_COLORS: Record<MoodLevel, string> = {
  1: "from-slate-600 to-slate-800",
  2: "from-indigo-700 to-slate-800",
  3: "from-violet-600 to-indigo-800",
  4: "from-emerald-600 to-violet-700",
  5: "from-amber-400 to-emerald-500",
};

const SIZES = { sm: "h-8 w-8", md: "h-16 w-16", lg: "h-24 w-24" };

/** Friendly mascot orb that reflects current mood */
export function MoodOrb({ mood, size = "md", className }: MoodOrbProps) {
  return (
    <div
      className={cn("relative", SIZES[size], className)}
      role="img"
      aria-label={`MindMirror mood orb showing mood level ${mood} of 5`}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-80 motion-safe:animate-pulse-slow",
          MOOD_COLORS[mood],
        )}
      />
      <div
        className={cn("absolute inset-1 rounded-full bg-gradient-to-br blur-sm", MOOD_COLORS[mood])}
      />
      <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-sm" />
    </div>
  );
}
