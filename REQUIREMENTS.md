# Hack2skill Problem Statement — Solution Traceability

This document maps the **official hackathon problem requirements** to MindMirror implementation for evaluator verification.

## Problem: Mental wellness for Indian exam aspirants

> Students preparing for NEET, JEE, CUET, CAT, GATE, and UPSC face chronic stress. Standard mood trackers (1–5 ratings) miss the nuance in open-ended journal reflections. Students need an AI companion that understands exam context, surfaces hidden stress patterns, and provides crisis-safe support.

---

## Requirement checklist

| # | Requirement | Status | Primary implementation |
|---|-------------|--------|------------------------|
| 1 | Open-ended reflective journaling | ✅ | `src/components/journal/JournalForm.tsx`, `/journal` |
| 2 | Mood pulse (1–5) alongside text | ✅ | `src/components/journal/MoodSelector.tsx`, `moodLevelSchema` |
| 3 | GenAI hidden stress trigger analysis | ✅ | `POST /api/ai/insights`, Mirror Insights dashboard |
| 4 | Empathetic exam-aware AI companion | ✅ | `POST /api/ai/chat`, `buildChatPrompt()` with exam context |
| 5 | Burnout / wellness trajectory visualization | ✅ | `src/features/burnout/score.ts`, `BurnoutChart.tsx` |
| 6 | Micro-mindfulness interventions | ✅ | `src/components/mindfulness/MindfulnessEngine.tsx` |
| 7 | Crisis detection + Indian helplines | ✅ | `src/features/crisis/detector.ts`, Tele-MANAS 14416 |
| 8 | Exam-specific onboarding (NEET/JEE/…) | ✅ | `src/app/onboarding/page.tsx`, `examTypeSchema` |
| 9 | Privacy — encrypted local storage | ✅ | `src/lib/encryption.ts` (AES-GCM Web Crypto) |
| 10 | Optional cloud backup | ✅ | `src/app/api/sync/route.ts`, Supabase schema |
| 11 | Demo mode without API keys | ✅ | Demo branches in insights/chat API routes |
| 12 | Accessible UI for all students | ✅ | ARIA labels, axe tests, skip links |
| 13 | Secure API (validation, rate limits) | ✅ | Zod schemas, rate limiter, CSP headers |
| 14 | SOLID maintainable architecture | ✅ | `src/lib/contracts/`, `src/lib/di/services.ts` |

---

## WOW moment (judges)

**Mirror Insights** analyzes 7 days of seeded journal data and reveals patterns invisible to mood-only trackers — e.g. *"Your stress spikes the night BEFORE mock tests, not during the test itself."*

- Trigger: Dashboard → **"Reveal hidden patterns →"**
- API: `src/app/api/ai/insights/route.ts`
- UI: `src/components/dashboard/Dashboard.tsx`

---

## User journey (end-to-end)

```
Landing → Onboarding (consent) → Dashboard (Burnout Radar + Insights)
    → Journal (reflect + mood) → Companion Chat → Mindfulness → Settings
```

Each route file includes `@requirement` JSDoc linking back to this document.

---

## SOLID architecture summary

| Principle | MindMirror example |
|-----------|-------------------|
| **S**ingle Responsibility | `CrisisDetectorService` — crisis keywords only |
| **O**pen/Closed | Swap `IBurnoutScorer` without changing Dashboard |
| **L**iskov Substitution | Mock `IStateRepository` in tests |
| **I**nterface Segregation | Separate `ICloudSyncAdapter` from `IStateRepository` |
| **D**ependency Inversion | `AppServices` container injects interfaces |

See also: [PROBLEM_ALIGNMENT.md](./PROBLEM_ALIGNMENT.md)
