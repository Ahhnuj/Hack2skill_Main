import { z } from "zod";

/** Valid Indian competitive exam types for API validation */
export const examTypeSchema = z.enum(["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC"]);

/** Mood pulse scale 1–5 for journal entries */
export const moodLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

/** Onboarding form validation with required consent */
export const onboardingSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  examType: examTypeSchema,
  consentGiven: z.literal(true, {
    message: "Consent is required to use MindMirror",
  }),
});

/** Reflective journal entry validation */
export const journalEntrySchema = z.object({
  content: z.string().min(1).max(10000).trim(),
  mood: moodLevelSchema,
});

/** Mirror Insights AI analysis request validation */
export const insightRequestSchema = z.object({
  entries: z
    .array(
      z.object({
        content: z.string(),
        mood: moodLevelSchema,
        createdAt: z.string(),
      }),
    )
    .min(1)
    .max(30),
  examType: examTypeSchema,
  userName: z.string().min(1).max(50),
});

/** Empathetic companion chat request validation */
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000).trim(),
  examType: examTypeSchema,
  userName: z.string().min(1).max(50),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(20)
    .optional(),
  journalContext: z.array(z.string()).max(5).optional(),
});

/** Structured Mirror Insights AI response validation */
export const insightResponseSchema = z.object({
  triggers: z.array(z.string()).min(1).max(5),
  patterns: z.array(z.string()).min(1).max(5),
  burnoutScore: z.number().min(0).max(100),
  suggestedCoping: z.string().min(1),
  motivationalNote: z.string().min(1),
});
