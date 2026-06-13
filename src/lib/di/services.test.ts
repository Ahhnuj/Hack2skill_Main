import { describe, it, expect, beforeEach } from "vitest";
import { AppServices, EncryptionService } from "@/lib/di/services";
import type { IStateRepository } from "@/lib/contracts";
import type { AppState } from "@/types";

describe("AppServices", () => {
  it("supports dependency inversion with mock repository", async () => {
    const mockState: AppState = {
      profile: null,
      entries: [],
      chatHistory: [],
      insights: [],
      lastInsightAt: null,
    };
    const mockRepo: IStateRepository = {
      loadState: async () => mockState,
      saveState: async () => {},
      deleteAllData: async () => {},
      saveProfile: async () => mockState,
      addEntry: async () => mockState,
      appendChatMessage: async () => mockState,
      addInsight: async () => mockState,
      replaceState: async () => {},
    };
    const services = new AppServices({ stateRepository: mockRepo });
    await expect(services.stateRepository.loadState()).resolves.toEqual(mockState);
  });

  it("wires default crisis detector", () => {
    const services = new AppServices();
    const result = services.crisisDetector.detect("I feel hopeless");
    expect(result.detected).toBe(true);
  });
});

describe("EncryptionService", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("implements IEncryptionService round-trip", async () => {
    const svc = new EncryptionService();
    const encrypted = await svc.encrypt("NEET journal entry");
    expect(await svc.decrypt(encrypted)).toBe("NEET journal entry");
  });
});
