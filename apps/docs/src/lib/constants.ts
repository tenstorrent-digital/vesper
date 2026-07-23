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
        "vesper-docs.vercel.app";

/**
 * the URL of the Storybook instance from @repo/vesper
 */
export const STORYBOOK_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `${BASE_URL}/storybook`;
