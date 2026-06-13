"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wind, Pause, Play } from "lucide-react";

type ExercisePhase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingExercise {
  name: string;
  description: string;
  phases: { phase: ExercisePhase; duration: number; label: string }[];
}

const EXERCISES: Record<string, BreathingExercise> = {
  calm: {
    name: "4-7-8 Calming Breath",
    description: "Reduces anxiety before study sessions or mock tests",
    phases: [
      { phase: "inhale", duration: 4, label: "Breathe in" },
      { phase: "hold", duration: 7, label: "Hold" },
      { phase: "exhale", duration: 8, label: "Breathe out" },
      { phase: "rest", duration: 2, label: "Rest" },
    ],
  },
  grounding: {
    name: "5-4-3-2-1 Grounding",
    description: "Anchor yourself when overwhelmed — notice your senses",
    phases: [
      { phase: "inhale", duration: 5, label: "5 things you see" },
      { phase: "hold", duration: 4, label: "4 things you touch" },
      { phase: "exhale", duration: 3, label: "3 things you hear" },
      { phase: "rest", duration: 2, label: "2 smells, 1 taste" },
    ],
  },
};

interface MindfulnessEngineProps {
  distressLevel?: "low" | "moderate" | "high";
}

/** Adaptive micro-mindfulness exercises triggered by distress level */
export function MindfulnessEngine({ distressLevel = "moderate" }: MindfulnessEngineProps) {
  const exerciseKey = distressLevel === "high" ? "grounding" : "calm";
  const exercise = EXERCISES[exerciseKey];

  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(exercise.phases[0].duration);

  const currentPhase = exercise.phases[phaseIndex];

  const advancePhase = useCallback(() => {
    setPhaseIndex((prev) => (prev + 1) % exercise.phases.length);
  }, [exercise.phases.length]);

  useEffect(() => {
    if (!isActive) return;
    setCountdown(currentPhase.duration);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          advancePhase();
          return exercise.phases[(phaseIndex + 1) % exercise.phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, phaseIndex, currentPhase.duration, advancePhase, exercise.phases]);

  const orbScale =
    currentPhase.phase === "inhale" ? 1.2 : currentPhase.phase === "exhale" ? 0.8 : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          {exercise.name}
        </CardTitle>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <div
          className="relative flex items-center justify-center h-48 w-48 motion-safe:transition-transform motion-safe:duration-1000"
          style={{ transform: isActive ? `scale(${orbScale})` : "scale(1)" }}
          role="img"
          aria-label={`Breathing guide: ${currentPhase.label}, ${countdown} seconds remaining`}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/30 to-violet-500/30 motion-safe:animate-pulse-slow" />
          <div className="text-center z-10">
            <p className="text-lg font-medium text-slate-200" aria-live="polite">
              {isActive ? currentPhase.label : "Ready?"}
            </p>
            {isActive && (
              <p className="text-4xl font-bold text-white mt-2" aria-hidden="true">
                {countdown}
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={() => {
            setIsActive(!isActive);
            if (!isActive) {
              setPhaseIndex(0);
              setCountdown(exercise.phases[0].duration);
            }
          }}
          variant={isActive ? "secondary" : "default"}
          aria-label={isActive ? "Pause breathing exercise" : "Start breathing exercise"}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" /> Begin
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
