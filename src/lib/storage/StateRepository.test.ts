import { describe, it, expect, vi } from "vitest";
import { StateRepository } from "@/lib/storage/StateRepository";
import type { UserProfile, ChatMessage, MirrorInsight } from "@/types";

const mockState = {
  profile: null,
  entries: [],
  chatHistory: [],
  insights: [],
  lastInsightAt: null,
};

vi.mock("@/lib/storage", () => ({
  loadState: vi.fn(async () => mockState),
  saveState: vi.fn(async () => {}),
  deleteAllData: vi.fn(async () => {}),
  saveProfile: vi.fn(async (p: UserProfile) => ({ ...mockState, profile: p })),
  addEntry: vi.fn(async () => mockState),
  appendChatMessage: vi.fn(async () => mockState),
  addInsight: vi.fn(async () => mockState),
  replaceState: vi.fn(async () => {}),
}));

import * as storage from "@/lib/storage";

describe("StateRepository", () => {
  const repo = new StateRepository();

  it("delegates loadState (IStateRepository / LSP)", async () => {
    await repo.loadState();
    expect(storage.loadState).toHaveBeenCalled();
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

  it("delegates appendChatMessage", async () => {
    const msg: ChatMessage = {
      id: "1",
      role: "user",
      content: "stressed",
      createdAt: "2026-06-13T00:00:00.000Z",
    };
    await repo.appendChatMessage(msg);
    expect(storage.appendChatMessage).toHaveBeenCalledWith(msg);
  });

  it("delegates addInsight", async () => {
    const insight: MirrorInsight = {
      id: "1",
      triggers: ["mock tests"],
      patterns: ["night before"],
      burnoutScore: 60,
      suggestedCoping: "rest",
      motivationalNote: "You got this",
      generatedAt: "2026-06-13T00:00:00.000Z",
    };
    await repo.addInsight(insight);
    expect(storage.addInsight).toHaveBeenCalledWith(insight);
  });

  it("delegates deleteAllData sensitive wipe", async () => {
    await repo.deleteAllData();
    expect(storage.deleteAllData).toHaveBeenCalled();
  });

  it("delegates replaceState for demo seeding", async () => {
    await repo.replaceState(mockState);
    expect(storage.replaceState).toHaveBeenCalledWith(mockState);
  });
});
