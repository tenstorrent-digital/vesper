const warned = new Set<string>();

/**
 * Logs a development-only warning, at most once per distinct message.
 *
 * Form inputs re-render often, so an ungated warning would repeat on every keystroke. Deduplicating
 * keeps the console usable while still surfacing the problem.
 */
export function warnOnce(message: string) {
  if (process.env.NODE_ENV === "production") return;
  if (warned.has(message)) return;

  warned.add(message);
  console.warn(`[vesper] ${message}`);
}

/**
 * Clears the record of already-logged warnings.
 *
 * Exported for tests, which need each case to warn independently.
 */
export function resetWarnOnce() {
  warned.clear();
}
