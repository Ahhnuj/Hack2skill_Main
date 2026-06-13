import type { IStateRepository } from "@/lib/contracts";
import type { AppState, MoodLevel, UserProfile } from "@/types";
import * as storage from "@/lib/storage";

/**
 * Repository facade over encrypted storage.
 * Enables dependency injection in tests via {@link IStateRepository}.
 */
export class StateRepository implements IStateRepository {
  /** @inheritdoc */
  loadState(): Promise<AppState> {
    return storage.loadState();
  }

  /** @inheritdoc */
  saveState(state: AppState): Promise<void> {
    return storage.saveState(state);
  }

  /** @inheritdoc */
  deleteAllData(): Promise<void> {
    return storage.deleteAllData();
  }

  /** @inheritdoc */
  saveProfile(profile: UserProfile): Promise<AppState> {
    return storage.saveProfile(profile);
  }

  /** @inheritdoc */
  addEntry(content: string, mood: MoodLevel): Promise<AppState> {
    return storage.addEntry(content, mood);
  }

  /** @inheritdoc */
  replaceState(state: AppState): Promise<void> {
    return storage.replaceState(state);
  }
}

export const defaultStateRepository: IStateRepository = new StateRepository();
