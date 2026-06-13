import { describe, it, expect, vi } from "vitest";
import { generateId, debounce, formatDate, formatDateTime, ariaNumber } from "@/lib/utils";

describe("ariaNumber", () => {
  it("zero-pads mood values for accessible labels", () => {
    expect(ariaNumber(3, 5)).toBe("03");
    expect(ariaNumber(5, 5)).toBe("05");
  });

  it("zero-pads burnout scores to three digits", () => {
    expect(ariaNumber(88, 100)).toBe("088");
  });
});

describe("utils", () => {
  it("generateId returns a uuid string", () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it("debounce delays function execution", async () => {
    vi.useFakeTimers();
    let count = 0;
    const fn = debounce(() => {
      count += 1;
    }, 100);
    fn();
    fn();
    fn();
    expect(count).toBe(0);
    vi.advanceTimersByTime(100);
    expect(count).toBe(1);
    vi.useRealTimers();
  });

  it("formatDate formats ISO strings", () => {
    const formatted = formatDate("2026-06-13T10:00:00.000Z");
    expect(formatted).toContain("2026");
  });

  it("formatDateTime includes time", () => {
    const formatted = formatDateTime("2026-06-13T10:00:00.000Z");
    expect(formatted.length).toBeGreaterThan(5);
  });
});
