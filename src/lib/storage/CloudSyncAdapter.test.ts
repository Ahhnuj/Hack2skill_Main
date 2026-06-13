import { describe, it, expect } from "vitest";
import { CloudSyncAdapter } from "@/lib/storage/CloudSyncAdapter";
import type { AppState } from "@/types";

describe("CloudSyncAdapter", () => {
  it("exposes merge via ICloudSyncAdapter contract", () => {
    const adapter = new CloudSyncAdapter();
    const local: AppState = {
      profile: null,
      entries: [],
      chatHistory: [],
      insights: [],
      lastInsightAt: "2026-01-01T00:00:00.000Z",
    };
    const remote: AppState = {
      ...local,
      lastInsightAt: "2026-06-01T00:00:00.000Z",
    };
    expect(adapter.merge(local, remote)).toEqual(remote);
  });
});
