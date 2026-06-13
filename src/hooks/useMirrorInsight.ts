import { useMutation } from "@tanstack/react-query";
import type { MirrorInsight, JournalEntry, ExamType } from "@/types";

interface InsightRequest {
  entries: Pick<JournalEntry, "content" | "mood" | "createdAt">[];
  examType: ExamType;
  userName: string;
}

/** React Query mutation for Mirror Insights — cached, deduped AI analysis */
export function useMirrorInsightMutation() {
  return useMutation({
    mutationKey: ["mirror-insight"],
    mutationFn: async (payload: InsightRequest): Promise<MirrorInsight> => {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Insight generation failed");
      return (await res.json()) as MirrorInsight;
    },
  });
}

/** React Query mutation for companion chat messages */
export function useChatMutation() {
  return useMutation({
    mutationKey: ["companion-chat"],
    mutationFn: async (payload: {
      message: string;
      examType: ExamType;
      userName: string;
      history: { role: "user" | "assistant"; content: string }[];
      journalContext: string[];
    }): Promise<string> => {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Chat request failed");
      return res.text();
    },
  });
}
