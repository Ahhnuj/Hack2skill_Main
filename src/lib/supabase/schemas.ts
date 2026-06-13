import { z } from "zod";

export const deviceIdSchema = z.string().uuid();

export const syncPullQuerySchema = z.object({
  deviceId: deviceIdSchema,
});

export const syncPushBodySchema = z.object({
  deviceId: deviceIdSchema,
  encryptedState: z.string().min(1).max(5_000_000),
});

export const syncDeleteBodySchema = z.object({
  deviceId: deviceIdSchema,
  /** Sensitive operation — explicit user confirmation required */
  confirm: z.literal(true, { message: "Deletion requires confirm: true" }),
});
