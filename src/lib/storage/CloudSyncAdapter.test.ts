import { describe, it, expect, vi, beforeEach } from "vitest";
import { CloudSyncAdapter } from "@/lib/storage/CloudSyncAdapter";
import type { AppState } from "@/types";

vi.mock("@/lib/storage/cloud-sync", () => ({
  pullFromCloud: vi.fn(),
  pushToCloud: vi.fn(),
  deleteFromCloud: vi.fn(),
  mergeAppState: vi.fn(),
}));

import {
  pullFromCloud,
  pushToCloud,
  deleteFromCloud,
  mergeAppState,
} from "@/lib/storage/cloud-sync";

describe("CloudSyncAdapter", () => {
  const adapter = new CloudSyncAdapter();

  beforeEach(() => {
    vi.mocked(pullFromCloud).mockResolvedValue({ encryptedState: "blob", updatedAt: null });
    vi.mocked(pushToCloud).mockResolvedValue(true);
    vi.mocked(deleteFromCloud).mockResolvedValue(true);
  });

  it("delegates pull to cloud-sync module", async () => {
    await expect(adapter.pull()).resolves.toEqual({ encryptedState: "blob", updatedAt: null });
    expect(pullFromCloud).toHaveBeenCalled();
  });

  it("delegates push with encrypted blob", async () => {
    await expect(adapter.push("encrypted")).resolves.toBe(true);
    expect(pushToCloud).toHaveBeenCalledWith("encrypted");
  });

  it("delegates delete for sensitive wipe", async () => {
    await expect(adapter.delete()).resolves.toBe(true);
    expect(deleteFromCloud).toHaveBeenCalled();
  });

  it("delegates merge via ICloudSyncAdapter", () => {
    const local: AppState = {
      profile: null,
      entries: [],
      chatHistory: [],
      insights: [],
      lastInsightAt: "2026-01-01T00:00:00.000Z",
    };
    const remote = { ...local, lastInsightAt: "2026-06-01T00:00:00.000Z" };
    vi.mocked(mergeAppState).mockReturnValue(remote);
    expect(adapter.merge(local, remote)).toEqual(remote);
  });
});
