import type { AppState, JournalEntry, UserProfile } from "@/types";
import { generateId } from "@/lib/utils";

function daysAgo(days: number, hour = 20): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

/** Pre-seeded journal entries for demo wow-moment */
export function createDemoEntries(examType: string): JournalEntry[] {
  return [
    {
      id: generateId(),
      content: `Long study day for ${examType}. Finished two chapters but feel empty, not accomplished. Saw classmates posting mock scores on Instagram — everyone seems ahead of me. Skipped dinner again. Can't shake this feeling that I'm running out of time.`,
      mood: 2,
      createdAt: daysAgo(6, 22),
      updatedAt: daysAgo(6, 22),
    },
    {
      id: generateId(),
      content: `Mock test tomorrow and I can't sleep. Heart racing even though I've revised. The anxiety is worse tonight than it was during last week's mock. Why does the night before feel harder than the actual test?`,
      mood: 2,
      createdAt: daysAgo(5, 23),
      updatedAt: daysAgo(5, 23),
    },
    {
      id: generateId(),
      content: `Mock test done. Went okay — 70%ile. Not terrible but not great. Relieved it's over. Mood lifted once I started the test; the waiting was the worst part. Note to self: the dread before is worse than the event.`,
      mood: 4,
      createdAt: daysAgo(4, 14),
      updatedAt: daysAgo(4, 14),
    },
    {
      id: generateId(),
      content: `Tried to rest today but guilt about not studying won. Lying in bed thinking about organic chemistry. Parents mean well but asking "how was the mock?" makes me want to hide. Feeling burned out but too scared to take a real break.`,
      mood: 2,
      createdAt: daysAgo(3, 21),
      updatedAt: daysAgo(3, 21),
    },
    {
      id: generateId(),
      content: `12-hour study marathon. Ate only one meal. Headache by evening. Productivity felt high but I know this isn't sustainable. Comparison spiral again after checking a Telegram group.`,
      mood: 2,
      createdAt: daysAgo(2, 22),
      updatedAt: daysAgo(2, 22),
    },
    {
      id: generateId(),
      content: `Another mock tomorrow. Already feel the dread setting in at 8pm. Did breathing exercise — helped a little. Wrote down 3 topics I know well. Small win.`,
      mood: 3,
      createdAt: daysAgo(1, 20),
      updatedAt: daysAgo(1, 20),
    },
    {
      id: generateId(),
      content: `Weekend! Went for a walk with a friend who isn't in the ${examType} race. Felt human again. Mood so much better. Maybe I need this more often. Still anxious about Monday but lighter tonight.`,
      mood: 4,
      createdAt: daysAgo(0, 18),
      updatedAt: daysAgo(0, 18),
    },
  ];
}

/** Create full demo app state */
export function createDemoState(
  name = "Demo Student",
  examType: UserProfile["examType"] = "NEET",
): AppState {
  return {
    profile: {
      name,
      examType,
      consentGiven: true,
      consentTimestamp: daysAgo(7),
      onboardedAt: daysAgo(7),
    },
    entries: createDemoEntries(examType),
    chatHistory: [],
    insights: [],
    lastInsightAt: null,
  };
}
