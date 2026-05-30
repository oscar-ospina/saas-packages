import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution.
 *
 * `clsx` handles conditional/array/object inputs; `tailwind-merge` (v3, required
 * for Tailwind v4 utility semantics) collapses conflicting utilities so the last
 * one wins (e.g. `cn("p-2", "p-4")` → `"p-4"`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
