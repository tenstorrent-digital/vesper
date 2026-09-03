/**
 * shared helpers for opening the ⌘K command palette from anywhere
 *
 * the palette is mounted once in the root layout, and every trigger (the top
 * bar button, the mobile icon, a link inside a document) just fires an event —
 * so no context provider has to wrap the whole server-rendered tree
 */

export const OPEN_PALETTE_EVENT = "vesper:open-palette";

export const openPalette = (query?: string) => {
  window.dispatchEvent(
    new CustomEvent(OPEN_PALETTE_EVENT, { detail: { query } }),
  );
};
