"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { AppState, UserProfile, JournalEntry, ChatMessage, MirrorInsight } from "@/types";
import type { IStateRepository } from "@/lib/contracts";
import { appServices } from "@/lib/di/services";
import { isCloudSyncEnabled } from "@/lib/storage/device-id";
import { createDemoState } from "@/lib/storage/seed-data";

/** React context contract for global MindMirror state */
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

interface AppProviderProps {
  children: React.ReactNode;
  /** Dependency Inversion: inject mock repository in tests */
  repository?: IStateRepository;
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * Global app state provider — local-first storage with optional cloud sync.
 * Uses {@link IStateRepository} via {@link appServices} (Dependency Inversion).
 * @requirement Encrypted local storage + optional Supabase sync
 */
export function AppProvider({ children, repository }: AppProviderProps) {
  const repo = repository ?? appServices.stateRepository;

  const [state, setState] = useState<AppState>({
    profile: null,
    entries: [],
    chatHistory: [],
    insights: [],
    lastInsightAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const loaded = await repo.loadState();
    setState(loaded);
  }, [repo]);

  useEffect(() => {
    void (async () => {
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  const setProfile = useCallback(
    async (profile: UserProfile) => {
      const updated = await repo.saveProfile(profile);
      setState(updated);
    },
    [repo],
  );

  const addJournalEntry = useCallback(
    async (content: string, mood: JournalEntry["mood"]) => {
      const updated = await repo.addEntry(content, mood);
      setState(updated);
    },
    [repo],
  );

  const addChatMessage = useCallback(
    async (message: ChatMessage) => {
      const current = await repo.loadState();
      current.chatHistory.push(message);
      await repo.saveState(current);
      setState({ ...current });
    },
    [repo],
  );

  const addInsight = useCallback(
    async (message: MirrorInsight) => {
      const current = await repo.loadState();
      current.insights.unshift(message);
      current.lastInsightAt = message.generatedAt;
      await repo.saveState(current);
      setState({ ...current });
    },
    [repo],
  );

  const seedDemoData = useCallback(
    async (name?: string, examType?: UserProfile["examType"]) => {
      const demo = createDemoState(name ?? "Demo Student", examType ?? "NEET");
      await repo.replaceState(demo);
      setState(demo);
    },
    [repo],
  );

  const clearAllData = useCallback(async () => {
    await repo.deleteAllData();
    setState({
      profile: null,
      entries: [],
      chatHistory: [],
      insights: [],
      lastInsightAt: null,
    });
  }, [repo]);

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

/**
 * Access MindMirror app state and actions.
 * @throws Error when used outside {@link AppProvider}
 */
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
