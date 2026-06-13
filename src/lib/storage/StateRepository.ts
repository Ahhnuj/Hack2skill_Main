import type { IStateRepository } from "@/lib/contracts";
import type { AppState, ChatMessage, MirrorInsight, MoodLevel, UserProfile } from "@/types";
import * as storage from "@/lib/storage";

/**
 * Repository facade over encrypted storage (Single Responsibility + Dependency Inversion).
 * @solid S — persistence orchestration only; delegates to storage module
 */
export class StateRepository implements IStateRepository {
  /** @returns Decrypted merged local/cloud application state */
  loadState(): Promise<AppState> {
    return storage.loadState();
  }

  /** @param state - Full state to encrypt and persist @returns Promise when save completes */
  saveState(state: AppState): Promise<void> {
    return storage.saveState(state);
  }

  /** @sensitive Wipes all local and remote user data @returns Promise when deletion completes */
  deleteAllData(): Promise<void> {
    return storage.deleteAllData();
  }

  /** @param profile - Onboarded user profile @returns Updated state with profile */
  saveProfile(profile: UserProfile): Promise<AppState> {
    return storage.saveProfile(profile);
  }

  /** @param content - Journal text @param mood - Mood pulse 1–5 @returns State with new entry */
  addEntry(content: string, mood: MoodLevel): Promise<AppState> {
    return storage.addEntry(content, mood);
  }

  /** @param message - Chat message @returns State with appended chat history */
  appendChatMessage(message: ChatMessage): Promise<AppState> {
    return storage.appendChatMessage(message);
  }

  /** @param insight - Mirror Insight result @returns State with prepended insight */
  addInsight(insight: MirrorInsight): Promise<AppState> {
    return storage.addInsight(insight);
  }

  /** @param state - Complete demo or seed state @returns Promise when replaced */
  replaceState(state: AppState): Promise<void> {
    return storage.replaceState(state);
  }
}

export const defaultStateRepository: IStateRepository = new StateRepository();
