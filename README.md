# MindMirror

**AI-powered mental wellness companion for Indian students preparing for NEET, JEE, CUET, CAT, GATE, and UPSC.**

MindMirror goes beyond "rate your mood 1–5." It ingests open-ended journaling, runs GenAI pattern analysis to surface hidden stress triggers, and acts as an empathetic, always-available companion with crisis safety built in.

---

## Quick Start

```bash
cd mindmirror
npm install
cp .env.example .env.local   # Add ANTHROPIC_API_KEY (optional — demo mode works without it)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Try Demo Mode** or **Get Started**.

---

## 90-Second Demo Script (for judges)

1. **Landing** — "MindMirror sees what standard mood trackers miss."
2. Click **Try Demo Mode** → complete onboarding (name + NEET + consent).
3. **Dashboard** — show Burnout Radar (pre-seeded 7 days of journal data).
4. Click **"Reveal hidden patterns →"** — **WOW MOMENT**:  
   *"Your stress spikes the night BEFORE mock tests, not during the test itself."*
5. **Journal** — write a quick entry + mood pulse; show crisis banner if distress words used.
6. **Companion Chat** — ask "I'm stressed about tomorrow's mock" → exam-aware coping advice.
7. **Mindfulness** — start adaptive 4-7-8 breathing (distress-adaptive).
8. **Settings** — show privacy/encryption + Tele-MANAS 14416 helplines.

---

## Architecture

```mermaid
flowchart TB
    subgraph Client["Browser (Next.js 14 App Router)"]
        UI[React UI + shadcn/ui]
        Local[(Encrypted localStorage)]
        UI --> Local
    end

    subgraph Cloud["Optional Supabase"]
        DB[(mindmirror_states)]
    end

    subgraph Server["Next.js API Routes"]
        Sync[/api/sync]
        Insights[/api/ai/insights]
        Chat[/api/ai/chat]
        Sync --> DB
    end

    Local <-->|encrypted blob| Sync

    subgraph AI["Anthropic Claude (server-side only)"]
        Claude[claude-sonnet-4-6]
    end

    UI -->|POST validated JSON| Insights
    UI -->|POST + stream| Chat
    Insights --> Claude
    Chat --> Claude
```

### Feature-Folder Structure

```
src/
├── app/              # Pages + API routes
├── components/       # Dumb UI components
├── features/         # Domain logic (crisis, burnout, ai prompts/parsers)
├── lib/              # Storage, encryption, schemas, utils
├── providers/        # React Query + App state
└── types/            # Shared TypeScript types
```

---

## Key AI Prompts

### (a) Mirror Insights / Pattern Engine

Located at `src/features/ai/prompts/insights.ts`. Returns structured JSON:

- `triggers` — hidden stress triggers
- `patterns` — emotional patterns over time
- `burnoutScore` — 0–100
- `suggestedCoping` — actionable strategy
- `motivationalNote` — exam-aware encouragement

Journal text is wrapped in `<journal_data>` tags with explicit prompt-injection guardrails.

### (b) Empathetic Companion Chat

Located at `src/features/ai/prompts/chat.ts`. Warm, non-clinical, exam-personalized responses with crisis detection rules baked into the system prompt. Streams via `/api/ai/chat`.

---

## Security & Privacy

| Measure | Implementation |
|---------|----------------|
| API key protection | `ANTHROPIC_API_KEY` server-side only; never in client bundle |
| Input validation | Zod on every API boundary |
| Rate limiting | 10 req/min per IP on AI endpoints |
| Output sanitization | DOMPurify strips HTML from AI/user text before render |
| Security headers | CSP, X-Frame-Options, nosniff via `next.config.mjs` |
| Encryption at rest | AES-GCM (Web Crypto API) for localStorage journal data |
| Cloud backup | Optional Supabase sync — encrypted blobs via `/api/sync` (service role, server-only) |
| Consent | Explicit opt-in during onboarding |
| Data deletion | "Delete All My Data" in Settings |
| Crisis safety | Client + server crisis detection; verified Indian helplines |
| Prompt injection | User journal treated as `<journal_data>`, not instructions |

**Disclaimer:** MindMirror is an AI wellness companion, not a therapist. Crisis helplines: Tele-MANAS **14416**, iCall **9152987821**, AASRA **9820466726**.

---

## Rubric Alignment

| Metric | How We Hit 100% |
|--------|-----------------|
| **Code Quality** | Strict TS, feature folders, pure prompt/parsers, ESLint + Prettier + Husky |
| **Security** | Server-side AI, Zod, rate limits, CSP, encryption, consent, delete-all |
| **Efficiency** | Streaming chat, debounced journal, lazy-loaded charts, React Query cache |
| **Testing** | Vitest unit tests + RTL component tests + Playwright E2E; `npm run test:coverage` |
| **Accessibility** | Semantic HTML, ARIA, keyboard nav, focus rings, reduced-motion, live regions |
| **Problem Alignment** | Journaling, mood logs, hidden triggers, patterns, chat, mindfulness, burnout radar, crisis layer, exam onboarding |

---

## Scripts

```bash
npm run dev            # Development server
npm run build          # Production build
npm run lint           # ESLint
npm run test           # Vitest unit + component tests
npm run test:coverage  # Coverage report (target ≥80%)
npm run test:e2e       # Playwright E2E
npm run format         # Prettier
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No* | Claude API key for live AI. Without it, demo/fallback responses are used. |
| `SUPABASE_URL` | No | Supabase project URL — enables cloud backup when deploying |
| `SUPABASE_ANON_KEY` | No* | Publishable/anon key (Settings → API) — works with RLS policy in `supabase/schema.sql` |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | Alternative to anon key — server-only, bypasses RLS (preferred for production) |
| `NEXT_PUBLIC_SUPABASE_ENABLED` | No | Set to `true` when Supabase is configured |

\* Provide **either** `SUPABASE_ANON_KEY` (publishable) **or** `SUPABASE_SERVICE_ROLE_KEY`.

\* Demo mode works fully without an API key for hackathon judging.

### Supabase Setup (for deployment)

1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor (**required once**)
3. Copy **Project URL** → `SUPABASE_URL`
4. Copy **publishable/anon key** → `SUPABASE_ANON_KEY`  
   *(or **service_role** → `SUPABASE_SERVICE_ROLE_KEY` for production)*
5. Set `NEXT_PUBLIC_SUPABASE_ENABLED=true`

**Without Supabase:** the app runs in local-only mode — fine for demos. **With Supabase:** encrypted journal blobs sync across browser sessions on the same device ID.

---

## Deploy on Render

### Option A — Blueprint (recommended)

1. Push this repo to GitHub
2. In [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect the repo — Render reads `render.yaml` automatically
4. Set secret env vars when prompted:
   - `SUPABASE_URL` = `https://rfmpxoyauzwueoxleukf.supabase.co`
   - `SUPABASE_ANON_KEY` = your publishable key
   - `ANTHROPIC_API_KEY` = optional, for live AI
5. Deploy

### Option B — Manual Web Service

1. **New** → **Web Service** → connect your GitHub repo
2. Configure:

| Setting | Value |
|---------|--------|
| **Root Directory** | `mindmirror` *(if repo root is parent folder)* or `.` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

3. **Environment** → add:

```env
NODE_VERSION=22.13.0
NEXT_PUBLIC_SUPABASE_ENABLED=true
SUPABASE_URL=https://rfmpxoyauzwueoxleukf.supabase.co
SUPABASE_ANON_KEY=your_publishable_key
ANTHROPIC_API_KEY=your_key_optional
```

4. **Create Web Service** → wait for build (~2–3 min)

### After deploy

- Open your Render URL (e.g. `https://mindmirror.onrender.com`)
- Complete onboarding — journal data syncs to Supabase via `/api/sync`
- **Settings** page should show **Cloud backup enabled**
- Free tier may spin down after inactivity; first load can take ~30s

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui-style components
- **AI:** Anthropic Claude (`claude-sonnet-4-20250514`) via secure API routes
- **Charts:** Recharts (Burnout Radar)
- **State:** React Query + encrypted local-first storage with optional Supabase cloud sync
- **Testing:** Vitest, React Testing Library, Playwright
- **Tooling:** ESLint, Prettier, Husky pre-commit

---

Built with care for Indian students carrying the weight of competitive exams. 💜
