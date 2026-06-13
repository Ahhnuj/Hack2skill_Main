import { describe, it, expect } from "vitest";
import {
  parseMood,
  inferMoodFromText,
  validateJournalContent,
} from "@/features/journal/mood-parser";

describe("parseMood", () => {
  it("parses valid mood values", () => {
    expect(parseMood(3)).toBe(3);
    expect(parseMood("4")).toBe(4);
  });

  it("returns null for invalid values", () => {
    expect(parseMood(0)).toBeNull();
    expect(parseMood(6)).toBeNull();
    expect(parseMood("abc")).toBeNull();
    expect(parseMood(null)).toBeNull();
  });
});

describe("inferMoodFromText", () => {
  it("returns null for empty text", () => {
    expect(inferMoodFromText("")).toBeNull();
  });

  it("infers mood from keywords", () => {
    expect(inferMoodFromText("Feeling terrible today")).toBe(1);
    expect(inferMoodFromText("I'm happy and excited")).toBe(5);
    expect(inferMoodFromText("It's okay, fine I guess")).toBe(3);
  });
});

describe("validateJournalContent", () => {
  it("rejects empty content", () => {
    expect(validateJournalContent("   ").valid).toBe(false);
  });

  it("accepts valid content", () => {
    expect(validateJournalContent("Today was a long study day.").valid).toBe(true);
  });

  it("rejects content over 10000 chars", () => {
    expect(validateJournalContent("a".repeat(10001)).valid).toBe(false);
  });
});
