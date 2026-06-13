# Problem Statement Alignment

MindMirror directly addresses the Hack2skill mental wellness challenge for **Indian competitive exam aspirants** (NEET, JEE, CUET, CAT, GATE, UPSC).

| Problem requirement | Implementation | Source |
|---------------------|----------------|--------|
| Reflective open-ended journaling (not just mood 1–5) | `JournalForm`, `/journal`, encrypted `addEntry()` | `src/components/journal/`, `src/lib/storage/` |
| Mood pulse tracking (1–5 scale) | `MoodSelector`, `moodLevelSchema`, burnout weighting | `src/components/journal/MoodSelector.tsx`, `src/lib/schemas.ts` |
| GenAI pattern analysis — hidden stress triggers | Mirror Insights API + dashboard WOW moment | `src/app/api/ai/insights/`, `src/hooks/useMirrorInsight.ts`, `src/components/dashboard/Dashboard.tsx` |
| Empathetic exam-aware companion chat | Streaming chat with NEET/JEE context prompts | `src/app/api/ai/chat/`, `src/components/chat/ChatInterface.tsx` |
| Burnout radar / wellness trajectory | Recharts trend + weighted score algorithm | `src/features/burnout/`, `src/components/dashboard/BurnoutChart.tsx` |
| Micro-mindfulness (adaptive breathing) | Distress-adaptive 4-7-8 / 5-4-3-2-1 exercises | `src/components/mindfulness/MindfulnessEngine.tsx` |
| Crisis safety layer (Indian helplines) | Keyword detector + Tele-MANAS 14416, iCall, AASRA | `src/features/crisis/`, `src/components/crisis/CrisisBanner.tsx` |
| Exam onboarding + consent | Onboarding flow with exam type + GDPR-style consent | `src/app/onboarding/page.tsx` |
| Privacy-first encrypted storage | AES-GCM Web Crypto + localStorage | `src/lib/encryption.ts` |
| Optional cloud backup | Supabase sync via `/api/sync` | `src/app/api/sync/`, `supabase/schema.sql` |
| Demo mode for judges (no API key) | Fallback insights/chat when `ANTHROPIC_API_KEY` unset | `src/features/ai/parsers/insights.ts`, chat route demo branch |
| Accessibility for students | 60+ `aria-label`s, axe tests, keyboard focus rings | `src/__tests__/accessibility.test.tsx`, UI components |
| Production security | Zod validation, rate limits, CSP headers, server-side API keys | `src/lib/schemas.ts`, `src/lib/rate-limit.ts`, `next.config.mjs` |

## Target user journey

1. **Landing** → understand value prop for exam stress  
2. **Onboarding** → name + exam type + consent  
3. **Dashboard** → Burnout Radar + “Reveal hidden patterns” (GenAI insight)  
4. **Journal** → write feelings + mood; crisis banner if needed  
5. **Chat** → coping strategies personalized to exam  
6. **Mindfulness** → breathing exercise adapts to distress  
7. **Settings** → delete data, view helplines, cloud sync status  

## Architecture principles (SOLID)

- **Single Responsibility**: `CrisisDetectorService`, `BurnoutScorerService`, `StateRepository`, `CloudSyncAdapter`  
- **Open/Closed**: Scoring and crisis rules extend via new classes implementing contracts  
- **Liskov Substitution**: Services swap behind `ICrisisDetector`, `IBurnoutScorer`, `IStateRepository`  
- **Interface Segregation**: Separate contracts in `src/lib/contracts/index.ts`  
- **Dependency Inversion**: API routes and providers depend on interfaces, not concrete fetch/storage  

See `src/lib/contracts/index.ts` for the full contract definitions.
