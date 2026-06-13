import type { AppState, JournalEntry, UserProfile } from "@/types";
import { encrypt, decrypt } from "@/lib/encryption";
import { generateId } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";
import {
  pullFromCloud,
  pushToCloud,
  deleteFromCloud,
  mergeAppState,
} from "@/lib/storage/cloud-sync";
import { clearDeviceId } from "@/lib/storage/device-id";

const EMPTY_STATE: AppState = {
  profile: null,
  entries: [],
  chatHistory: [],
  insights: [],
  lastInsightAt: null,
};

async function loadLocalState(): Promise<AppState> {
  if (typeof window === "undefined") return EMPTY_STATE;

  try {
    const encrypted = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_STATE);
    if (!encrypted) return EMPTY_STATE;
    const json = await decrypt(encrypted);
    return JSON.parse(json) as AppState;
  } catch {
    return EMPTY_STATE;
  }
}

async function loadRemoteState(): Promise<AppState | null> {
  const remote = await pullFromCloud();
  if (!remote?.encryptedState) return null;
  try {
    const json = await decrypt(remote.encryptedState);
    return JSON.parse(json) as AppState;
  } catch {
    return null;
  }
}

/**
 * Load app state — local-first, optionally merged with Supabase cloud copy.
 * @returns Decrypted application state or empty defaults
 */
export async function loadState(): Promise<AppState> {
  if (typeof window === "undefined") return EMPTY_STATE;

  const local = await loadLocalState();
  const remote = await loadRemoteState();

  if (!remote) return local;

  if (!local.profile && local.entries.length === 0 && local.chatHistory.length === 0) {
    await saveState(remote);
    return remote;
  }

  const merged = mergeAppState(local, remote);
  await saveState(merged);
  return merged;
}

/** Write encrypted state to localStorage only */
async function saveStateLocalOnly(state: AppState): Promise<string> {
  const json = JSON.stringify(state);
  const encrypted = await encrypt(json);
  localStorage.setItem(STORAGE_KEYS.ENCRYPTED_STATE, encrypted);
  return encrypted;
}

/**
 * Persist app state locally and optionally sync encrypted blob to Supabase.
 * @param state - Full application state to encrypt and store
 */
export async function saveState(state: AppState): Promise<void> {
  if (typeof window === "undefined") return;
  const encrypted = await saveStateLocalOnly(state);
  void pushToCloud(encrypted);
}

/** Delete all user data locally and in Supabase (irreversible) */
export async function deleteAllData(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_STATE);
  localStorage.removeItem(STORAGE_KEYS.ENCRYPTION_SALT);
  await deleteFromCloud();
  clearDeviceId();
}

/**
 * Save user profile after onboarding.
 * @param profile - Validated user profile with consent timestamp
 */
export async function saveProfile(profile: UserProfile): Promise<AppState> {
  const state = await loadLocalState();
  state.profile = profile;
  await saveState(state);
  return state;
}

/**
 * Add a reflective journal entry with mood pulse.
 * @param content - Journal text (1–10,000 chars)
 * @param mood - Mood level 1–5
 */
export async function addEntry(content: string, mood: JournalEntry["mood"]): Promise<AppState> {
  const state = await loadLocalState();
  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: generateId(),
    content,
    mood,
    createdAt: now,
    updatedAt: now,
  };
  state.entries.unshift(entry);
  await saveState(state);
  return state;
}

/** Replace entire state (for seeding) */
export async function replaceState(state: AppState): Promise<void> {
  await saveState(state);
}
