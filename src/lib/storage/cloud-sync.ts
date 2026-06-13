import type { AppState } from "@/types";
import { getOrCreateDeviceId, isCloudSyncEnabled } from "@/lib/storage/device-id";

interface SyncPullResponse {
  encryptedState: string | null;
  updatedAt: string | null;
}

/**
 * Pull encrypted state from Supabase via server API.
 */
export async function pullFromCloud(): Promise<SyncPullResponse | null> {
  if (!isCloudSyncEnabled()) return null;
  const deviceId = getOrCreateDeviceId();
  if (!deviceId) return null;

  try {
    const res = await fetch(`/api/sync?deviceId=${encodeURIComponent(deviceId)}`);
    if (!res.ok) return null;
    return (await res.json()) as SyncPullResponse;
  } catch {
    return null;
  }
}

/**
 * Push encrypted state blob to Supabase via server API.
 */
export async function pushToCloud(encryptedState: string): Promise<boolean> {
  if (!isCloudSyncEnabled()) return false;
  const deviceId = getOrCreateDeviceId();
  if (!deviceId) return false;

  try {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId, encryptedState }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Delete cloud state for this device */
export async function deleteFromCloud(): Promise<boolean> {
  if (!isCloudSyncEnabled()) return false;
  const deviceId = getOrCreateDeviceId();
  if (!deviceId) return false;

  try {
    const res = await fetch("/api/sync", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Merge local and cloud state — prefer the one with more recent activity */
export function mergeAppState(local: AppState, remote: AppState): AppState {
  const localTime = getLatestTimestamp(local);
  const remoteTime = getLatestTimestamp(remote);
  return remoteTime > localTime ? remote : local;
}

function getLatestTimestamp(state: AppState): number {
  const times = [
    state.lastInsightAt,
    state.profile?.onboardedAt,
    ...state.entries.map((e) => e.updatedAt),
    ...state.chatHistory.map((m) => m.createdAt),
  ].filter(Boolean) as string[];
  if (times.length === 0) return 0;
  return Math.max(...times.map((t) => new Date(t).getTime()));
}
