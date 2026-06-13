/**
 * Application service registry — Dependency Inversion composition root.
 * Consumers depend on {@link IStateRepository}, {@link ICrisisDetector}, etc., not concrete modules.
 * @module di/services
 */
import type {
  IBurnoutScorer,
  ICloudSyncAdapter,
  ICrisisDetector,
  IEncryptionService,
  IRateLimiter,
  IStateRepository,
} from "@/lib/contracts";
import { defaultBurnoutScorer } from "@/features/burnout/BurnoutScorerService";
import { defaultCrisisDetector } from "@/features/crisis/CrisisDetectorService";
import { encrypt, decrypt } from "@/lib/encryption";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { defaultCloudSyncAdapter } from "@/lib/storage/CloudSyncAdapter";
import { defaultStateRepository } from "@/lib/storage/StateRepository";

/** Injectable dependencies for MindMirror (enables unit testing with mocks) */
export interface AppServicesDeps {
  stateRepository?: IStateRepository;
  crisisDetector?: ICrisisDetector;
  burnoutScorer?: IBurnoutScorer;
  cloudSync?: ICloudSyncAdapter;
  encryption?: IEncryptionService;
  rateLimiter?: IRateLimiter;
}

/**
 * Default encryption adapter implementing {@link IEncryptionService}.
 * Single Responsibility: AES-GCM encrypt/decrypt only.
 */
export class EncryptionService implements IEncryptionService {
  /** @param plaintext - JSON or journal text to encrypt */
  async encrypt(plaintext: string): Promise<string> {
    return encrypt(plaintext);
  }

  /** @param encrypted - Base64 ciphertext from {@link encrypt} */
  async decrypt(encrypted: string): Promise<string> {
    return decrypt(encrypted);
  }
}

/**
 * Rate limiter adapter for sensitive API routes.
 * Protects AI and sync endpoints from abuse.
 */
export class RateLimiterService implements IRateLimiter {
  check(identifier: string) {
    return checkRateLimit(identifier);
  }

  getClientIp(headers: Headers) {
    return getClientIp(headers);
  }
}

/**
 * Central registry wiring all domain services to their interface contracts.
 * Open/Closed: extend behavior by passing alternate implementations in {@link AppServicesDeps}.
 */
export class AppServices {
  readonly stateRepository: IStateRepository;
  readonly crisisDetector: ICrisisDetector;
  readonly burnoutScorer: IBurnoutScorer;
  readonly cloudSync: ICloudSyncAdapter;
  readonly encryption: IEncryptionService;
  readonly rateLimiter: IRateLimiter;

  constructor(deps: AppServicesDeps = {}) {
    this.stateRepository = deps.stateRepository ?? defaultStateRepository;
    this.crisisDetector = deps.crisisDetector ?? defaultCrisisDetector;
    this.burnoutScorer = deps.burnoutScorer ?? defaultBurnoutScorer;
    this.cloudSync = deps.cloudSync ?? defaultCloudSyncAdapter;
    this.encryption = deps.encryption ?? new EncryptionService();
    this.rateLimiter = deps.rateLimiter ?? new RateLimiterService();
  }
}

/** Shared application service container */
export const appServices = new AppServices();
