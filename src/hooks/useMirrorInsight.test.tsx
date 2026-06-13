import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMirrorInsightMutation, useChatMutation } from "@/hooks/useMirrorInsight";
import type { ReactNode } from "react";

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useMirrorInsightMutation", () => {
  it("fetches insight from API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "1",
          triggers: ["Pre-test anxiety"],
          patterns: ["Night stress"],
          burnoutScore: 55,
          suggestedCoping: "Breathe",
          motivationalNote: "You got this",
          generatedAt: new Date().toISOString(),
        }),
      }),
    );

    const { result } = renderHook(() => useMirrorInsightMutation(), { wrapper });
    result.current.mutate({
      entries: [{ content: "test", mood: 2, createdAt: "2026-06-13" }],
      examType: "NEET",
      userName: "Test",
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.triggers).toContain("Pre-test anxiety");
    vi.unstubAllGlobals();
  });
});

describe("useChatMutation", () => {
  it("sends chat message to API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => "Here is some supportive advice.",
      }),
    );

    const { result } = renderHook(() => useChatMutation(), { wrapper });
    result.current.mutate({
      message: "I am stressed",
      examType: "JEE",
      userName: "Rahul",
      history: [],
      journalContext: [],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toContain("supportive");
    vi.unstubAllGlobals();
  });
});
