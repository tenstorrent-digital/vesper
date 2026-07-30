import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {},
  override: {},
});

/**
 * cn (class name utility)
 *
 * Combines and merges CLASS NAMES with Tailwind CSS conflict resolution.
 *
 * Uses clsx to conditionally construct className strings and tailwind-merge
 * to intelligently merge Tailwind CSS classes, where later classes override
 * earlier conflicting classes.
 *
 * @param inputs - Any number of class values (strings, objects, arrays, etc.)
 * @returns {string} A merged className string with Tailwind conflicts resolved
 *
 * @example
 * cn('px-2 py-1', 'px-4') // Returns 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', condition && 'text-blue-500') // Conditionally applies classes
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
