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
});
