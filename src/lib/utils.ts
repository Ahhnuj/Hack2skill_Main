import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names with conflict resolution.
 * @param inputs - Class name fragments (strings, objects, arrays)
 * @returns Merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate a cryptographically random UUID v4.
 * @returns UUID string for journal entries, messages, and insights
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Debounce a function — delays execution until `delayMs` after the last call.
 * @param fn - Callback to debounce
 * @param delayMs - Quiet period in milliseconds
 * @returns Debounced function with the same parameter signature as `fn`
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * Zero-pad a numeric value for accessible aria-labels (e.g. mood "03 of 05").
 * @param value - Numeric value to display
 * @param max - Maximum scale value (determines pad width)
 * @returns Zero-padded string suitable for screen readers
 */
export function ariaNumber(value: number, max: number): string {
  const width = max >= 100 ? 3 : 2;
  return String(value).padStart(width, "0");
}

/**
 * Format ISO date for Indian locale display.
 * @param iso - ISO-8601 date string
 * @returns Human-readable date (e.g. "13 Jun 2026")
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format ISO datetime for Indian locale display.
 * @param iso - ISO-8601 datetime string
 * @returns Human-readable date and time
 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
