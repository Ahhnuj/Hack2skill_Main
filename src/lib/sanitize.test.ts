import { describe, it, expect } from "vitest";
import { sanitizeText } from "@/lib/sanitize";

describe("sanitizeText", () => {
  it("strips HTML tags in browser environment", () => {
    const result = sanitizeText('<script>alert("xss")</script>Hello');
    expect(result).not.toContain("<script>");
    expect(result).toContain("Hello");
  });

  it("handles plain text", () => {
    expect(sanitizeText("Normal journal entry")).toBe("Normal journal entry");
  });

  it("escapes HTML on server when window is undefined", () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulate SSR
    delete globalThis.window;
    expect(sanitizeText('<img src=x onerror="alert(1)">')).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
    globalThis.window = originalWindow;
  });
});
