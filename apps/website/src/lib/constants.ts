/**
 * base URL for the current environment
 *
 * resolves based on the deployment environment:
 * - development: http://localhost:3000
 * - preview: https://{branch-url}
 * - production: https://vesper-docs.vercel.app (for now)
 */
export const BASE_URL: string =
  // development
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : // preview
      process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL || "vesper-docs.vercel.app"}`
      : // otherwise, use production
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "vesper-docs.vercel.app"}`;

/**
 * port Storybook runs on in @tenstorrent/vesper in dev
 *
 * must match the port in `@tenstorrent/vesper`'s `dev` script, which runs storybook
 * with `--exact-port` so a port clash fails loudly instead of silently
 * relocating and breaking this rewrite
 *
 * (should figure out how to set this across the monorepo later)
 */
export const STORYBOOK_PORT = 5173;

/**
 * the URL of the Storybook instance from @tenstorrent/vesper
 */
export const STORYBOOK_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${STORYBOOK_PORT}`
    : `${BASE_URL}/storybook`;

/**
 * the repository Vesper is developed in
 */
export const GITHUB_URL = "https://github.com/tenstorrent-digital/vesper";

/**
 * `localStorage` key the visitor's chosen theme is stored under
 *
 * lives here rather than next to the switcher itself: the inline script in
 * `src/app/layout.tsx` runs on the server, and a server component cannot read
 * plain values exported from a `"use client"` module
 */
export const THEME_STORAGE_KEY = "vesper-docs-theme";
