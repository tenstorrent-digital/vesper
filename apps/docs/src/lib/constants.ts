/**
 * base URL for the current environment
 *
 * resolves based on the deployment environment:
 * - development: http://localhost:3001
 * - preview: https://{branch-url}
 * - production: https://vesper-docs.vercel.app (for now)
 */
export const BASE_URL: string =
  // development
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : // preview
      process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL || "vesper-docs.vercel.app"}`
      : // otherwise, use production
        `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "vesper-docs.vercel.app"}`;

/**
 * port Storybook runs on in @repo/vesper in dev
 *
 * must match the port in `@repo/vesper`'s `dev` script, which runs storybook
 * with `--exact-port` so a port clash fails loudly instead of silently
 * relocating and breaking this rewrite
 *
 * (should figure out how to set this across the monorepo later)
 */
export const STORYBOOK_PORT = 3000;

/**
 * the URL of the Storybook instance from @repo/vesper
 */
export const STORYBOOK_URL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:${STORYBOOK_PORT}`
    : `${BASE_URL}/storybook`;
