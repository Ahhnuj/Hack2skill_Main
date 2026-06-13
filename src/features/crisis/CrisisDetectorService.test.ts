import { describe, it, expect } from "vitest";
import { CrisisDetectorService } from "@/features/crisis/CrisisDetectorService";

describe("CrisisDetectorService", () => {
  const detector = new CrisisDetectorService();

  it("implements ICrisisDetector contract for acute crisis", () => {
    const result = detector.detect("I want to end my life");
    expect(result.severity).toBe("acute");
    expect(detector.isAcute(result)).toBe(true);
    expect(detector.shouldShowBanner(result)).toBe(true);
  });

  it("returns none for safe text", () => {
    const result = detector.detect("Feeling okay about tomorrow's mock");
    expect(result.detected).toBe(false);
    expect(detector.shouldShowBanner(result)).toBe(false);
  });
});
