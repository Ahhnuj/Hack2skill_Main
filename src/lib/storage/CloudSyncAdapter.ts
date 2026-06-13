import type { ICloudSyncAdapter } from "@/lib/contracts";
import type { AppState } from "@/types";
import {
  deleteFromCloud,
  mergeAppState,
  pullFromCloud,
  pushToCloud,
} from "@/lib/storage/cloud-sync";

/**
 * Supabase sync adapter implementing {@link ICloudSyncAdapter}.
 * Isolates fetch/network concerns from storage orchestration.
 */
export class CloudSyncAdapter implements ICloudSyncAdapter {
  /** @inheritdoc */
  async pull() {
    return pullFromCloud();
  }

  /** @inheritdoc */
  async push(encryptedState: string) {
    return pushToCloud(encryptedState);
  }

  /** @inheritdoc */
  async delete() {
    return deleteFromCloud();
  }

  /** @inheritdoc */
  merge(local: AppState, remote: AppState) {
    return mergeAppState(local, remote);
  }
}

export const defaultCloudSyncAdapter: ICloudSyncAdapter = new CloudSyncAdapter();
