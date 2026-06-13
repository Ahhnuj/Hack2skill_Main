import { describe, it, expect } from "vitest";
import { detectCrisis, shouldShowCrisisBanner, isAcuteCrisis } from "@/features/crisis/detector";

describe("detectCrisis", () => {
  it("returns none for empty text", () => {
    expect(detectCrisis("")).toEqual({
      detected: false,
      severity: "none",
      matchedKeywords: [],
    });
  });

  it("returns none for normal journal entry", () => {
    const result = detectCrisis("Had a good study day, feeling productive.");
    expect(result.detected).toBe(false);
    expect(result.severity).toBe("none");
  });

  it("detects moderate distress keywords", () => {
    const result = detectCrisis("I feel hopeless and overwhelmed by NEET prep.");
    expect(result.detected).toBe(true);
    expect(result.severity).toBe("moderate");
    expect(result.matchedKeywords).toContain("hopeless");
  });

  it("detects acute crisis keywords", () => {
    const result = detectCrisis("I want to end my life, everything is too much.");
    expect(result.detected).toBe(true);
    expect(result.severity).toBe("acute");
    expect(result.matchedKeywords).toContain("end my life");
  });

  it("prioritizes acute over moderate", () => {
    const result = detectCrisis("I feel hopeless and suicidal thoughts keep coming.");
    expect(result.severity).toBe("acute");
  });

  it("handles very long entries", () => {
    const longText = "study ".repeat(5000) + " I want to kill myself";
    const result = detectCrisis(longText);
    expect(result.severity).toBe("acute");
  });

  it("is case insensitive", () => {
    expect(detectCrisis("SUICIDAL thoughts").severity).toBe("acute");
  });
});

describe("shouldShowCrisisBanner", () => {
  it("returns false for no crisis", () => {
    expect(shouldShowCrisisBanner(detectCrisis("fine"))).toBe(false);
  });

  it("returns true for moderate crisis", () => {
    expect(shouldShowCrisisBanner(detectCrisis("overwhelmed"))).toBe(true);
  });
});

describe("isAcuteCrisis", () => {
  it("returns true only for acute severity", () => {
    expect(isAcuteCrisis(detectCrisis("suicidal"))).toBe(true);
    expect(isAcuteCrisis(detectCrisis("hopeless"))).toBe(false);
  });
});
