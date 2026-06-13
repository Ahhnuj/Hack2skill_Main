import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names with conflict resolution */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Generate a UUID v4 */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Debounce a function call */
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

/** Format ISO date for display */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format ISO datetime for display */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
