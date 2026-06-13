"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { AppState, UserProfile, JournalEntry, ChatMessage, MirrorInsight } from "@/types";
import {
  loadState,
  saveState,
  deleteAllData,
  addEntry as storageAddEntry,
  saveProfile as storageSaveProfile,
  replaceState,
} from "@/lib/storage";
import { isCloudSyncEnabled } from "@/lib/storage/device-id";
import { createDemoState } from "@/lib/storage/seed-data";

interface AppContextValue {
  state: AppState;
  isLoading: boolean;
  cloudSyncEnabled: boolean;
  setProfile: (profile: UserProfile) => Promise<void>;
  addJournalEntry: (content: string, mood: JournalEntry["mood"]) => Promise<void>;
  addChatMessage: (message: ChatMessage) => Promise<void>;
  addInsight: (insight: MirrorInsight) => Promise<void>;
  seedDemoData: (name?: string, examType?: UserProfile["examType"]) => Promise<void>;
  clearAllData: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Global app state provider — local-first storage with optional cloud sync */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: null,
    entries: [],
    chatHistory: [],
    insights: [],
    lastInsightAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const loaded = await loadState();
    setState(loaded);
  }, []);

  useEffect(() => {
    void (async () => {
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  const setProfile = useCallback(async (profile: UserProfile) => {
    const updated = await storageSaveProfile(profile);
    setState(updated);
  }, []);

  const addJournalEntry = useCallback(async (content: string, mood: JournalEntry["mood"]) => {
    const updated = await storageAddEntry(content, mood);
    setState(updated);
  }, []);

  const addChatMessage = useCallback(async (message: ChatMessage) => {
    const current = await loadState();
    current.chatHistory.push(message);
    await saveState(current);
    setState({ ...current });
  }, []);

  const addInsight = useCallback(async (insight: MirrorInsight) => {
    const current = await loadState();
    current.insights.unshift(insight);
    current.lastInsightAt = insight.generatedAt;
    await saveState(current);
    setState({ ...current });
  }, []);

  const seedDemoData = useCallback(async (name?: string, examType?: UserProfile["examType"]) => {
    const demo = createDemoState(name ?? "Demo Student", examType ?? "NEET");
    await replaceState(demo);
    setState(demo);
  }, []);

  const clearAllData = useCallback(async () => {
    await deleteAllData();
    setState({
      profile: null,
      entries: [],
      chatHistory: [],
      insights: [],
      lastInsightAt: null,
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      isLoading,
      cloudSyncEnabled: isCloudSyncEnabled(),
      setProfile,
      addJournalEntry,
      addChatMessage,
      addInsight,
      seedDemoData,
      clearAllData,
      refresh,
    }),
    [
      state,
      isLoading,
      setProfile,
      addJournalEntry,
      addChatMessage,
      addInsight,
      seedDemoData,
      clearAllData,
      refresh,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Access MindMirror app state and actions */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
