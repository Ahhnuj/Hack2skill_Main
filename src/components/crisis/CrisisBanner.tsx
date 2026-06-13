"use client";

import { INDIAN_HELPLINES, DISCLAIMER } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, AlertTriangle } from "lucide-react";

interface CrisisBannerProps {
  severity: "moderate" | "acute";
}

/** Surfaces verified Indian helplines when distress is detected */
export function CrisisBanner({ severity }: CrisisBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-xl border-2 border-red-500/60 bg-red-950/40 p-4 space-y-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h2 className="text-lg font-semibold text-red-300">
            {severity === "acute"
              ? "You matter. Please reach out for support."
              : "We noticed you might be struggling"}
          </h2>
          <p className="text-sm text-red-200/80 mt-1">{DISCLAIMER}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {INDIAN_HELPLINES.map((helpline) => (
          <Card key={helpline.name} className="border-red-800/50 bg-red-950/30">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-400" aria-hidden="true" />
                {helpline.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <a
                href={`tel:${helpline.number.replace(/\s/g, "")}`}
                className="text-xl font-bold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                aria-label={`Call ${helpline.name} at ${helpline.number}`}
              >
                {helpline.number}
              </a>
              <p className="text-xs text-red-200/70 mt-1">{helpline.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
