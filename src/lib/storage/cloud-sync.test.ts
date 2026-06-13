import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { AppState } from "@/types";
import { mergeAppState } from "@/lib/storage/cloud-sync";

vi.mock("@/lib/storage/device-id", () => ({
  getOrCreateDeviceId: vi.fn(() => "550e8400-e29b-41d4-a716-446655440000"),
  isCloudSyncEnabled: vi.fn(() => true),
}));

import { pullFromCloud, pushToCloud, deleteFromCloud } from "@/lib/storage/cloud-sync";
import { getOrCreateDeviceId, isCloudSyncEnabled } from "@/lib/storage/device-id";

const baseState = (overrides: Partial<AppState> = {}): AppState => ({
  profile: null,
  entries: [],
  chatHistory: [],
  insights: [],
  lastInsightAt: null,
  ...overrides,
});

describe("mergeAppState", () => {
  it("prefers remote when it has a newer timestamp", () => {
    const local = baseState({ lastInsightAt: "2026-01-01T00:00:00.000Z" });
    const remote = baseState({ lastInsightAt: "2026-06-01T00:00:00.000Z" });
    expect(mergeAppState(local, remote)).toEqual(remote);
  });

  it("prefers local when it is more recent", () => {
    const local = baseState({
      entries: [
        {
          id: "1",
          content: "Recent",
          mood: 2,
          createdAt: "2026-06-10T00:00:00.000Z",
          updatedAt: "2026-06-10T00:00:00.000Z",
        },
      ],
    });
    const remote = baseState({ lastInsightAt: "2026-01-01T00:00:00.000Z" });
    expect(mergeAppState(local, remote)).toEqual(local);
  });
});

describe("cloud sync fetch operations", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(isCloudSyncEnabled).mockReturnValue(true);
    vi.mocked(getOrCreateDeviceId).mockReturnValue("550e8400-e29b-41d4-a716-446655440000");
  });

  it("pullFromCloud returns null when sync is disabled", async () => {
    vi.mocked(isCloudSyncEnabled).mockReturnValue(false);
    await expect(pullFromCloud()).resolves.toBeNull();
  });

  it("pullFromCloud returns payload on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ encryptedState: "blob", updatedAt: "2026-06-13T00:00:00.000Z" }),
    } as Response);

    await expect(pullFromCloud()).resolves.toEqual({
      encryptedState: "blob",
      updatedAt: "2026-06-13T00:00:00.000Z",
    });
  });

  it("pullFromCloud returns null on HTTP error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);
    await expect(pullFromCloud()).resolves.toBeNull();
  });

  it("pushToCloud posts encrypted blob", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
    await expect(pushToCloud("encrypted-blob")).resolves.toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/sync", expect.objectContaining({ method: "POST" }));
  });

  it("deleteFromCloud sends DELETE request", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
    await expect(deleteFromCloud()).resolves.toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/sync", expect.objectContaining({ method: "DELETE" }));
  });

  it("pushToCloud returns false when sync disabled", async () => {
    vi.mocked(isCloudSyncEnabled).mockReturnValue(false);
    await expect(pushToCloud("blob")).resolves.toBe(false);
  });
});
