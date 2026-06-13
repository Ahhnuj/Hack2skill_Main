import { describe, it, expect } from "vitest";
import { onboardingSchema, journalEntrySchema, chatRequestSchema } from "@/lib/schemas";

describe("Zod schemas", () => {
  it("validates onboarding input", () => {
    const result = onboardingSchema.safeParse({
      name: "Rahul",
      examType: "JEE",
      consentGiven: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects onboarding without consent", () => {
    const result = onboardingSchema.safeParse({
      name: "Rahul",
      examType: "JEE",
      consentGiven: false,
    });
    expect(result.success).toBe(false);
  });

  it("validates journal entry", () => {
    const result = journalEntrySchema.safeParse({
      content: "Good study day",
      mood: 4,
    });
    expect(result.success).toBe(true);
  });

  it("validates chat request", () => {
    const result = chatRequestSchema.safeParse({
      message: "I feel stressed",
      examType: "NEET",
      userName: "Priya",
    });
    expect(result.success).toBe(true);
  });
});
