import { generateId } from "@/lib/utils";

const DEVICE_ID_KEY = "mindmirror_device_id";

/**
 * Stable anonymous device ID for optional Supabase sync.
 * Stored locally — no PII.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;
  const id = generateId();
  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

/** Remove device ID (e.g. on delete-all-data) */
export function clearDeviceId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEVICE_ID_KEY);
}

/** Whether Supabase cloud sync is enabled for this deployment */
export function isCloudSyncEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SUPABASE_ENABLED === "true";
}
