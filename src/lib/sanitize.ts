import DOMPurify from "dompurify";

/**
 * Sanitize user/AI text before rendering in the DOM.
 * Strips all HTML tags and dangerous content.
 */
export function sanitizeText(input: string): string {
  if (typeof window === "undefined") {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
