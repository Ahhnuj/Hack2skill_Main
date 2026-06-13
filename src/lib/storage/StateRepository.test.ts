import { describe, it, expect, vi } from "vitest";
import { StateRepository } from "@/lib/storage/StateRepository";
import type { UserProfile } from "@/types";

vi.mock("@/lib/storage", () => ({
  loadState: vi.fn(async () => ({
    profile: null,
    entries: [],
    chatHistory: [],
    insights: [],
    lastInsightAt: null,
  })),
  saveState: vi.fn(async () => {}),
  deleteAllData: vi.fn(async () => {}),
  saveProfile: vi.fn(async (p: UserProfile) => ({
    profile: p,
    entries: [],
    chatHistory: [],
    insights: [],
    lastInsightAt: null,
  })),
  addEntry: vi.fn(async () => ({
    profile: null,
    entries: [],
    chatHistory: [],
    insights: [],
    lastInsightAt: null,
  })),
  replaceState: vi.fn(async () => {}),
}));

describe("StateRepository", () => {
  const repo = new StateRepository();

  it("delegates loadState to storage module (IStateRepository)", async () => {
    const state = await repo.loadState();
    expect(state.entries).toEqual([]);
  });

  it("delegates saveProfile with typed profile", async () => {
    const profile: UserProfile = {
      name: "Anuj",
      examType: "NEET",
      consentGiven: true,
      consentTimestamp: "2026-06-13T00:00:00.000Z",
      onboardedAt: "2026-06-13T00:00:00.000Z",
    };
    const result = await repo.saveProfile(profile);
    expect(result.profile?.name).toBe("Anuj");
  });
});
