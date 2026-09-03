import { fullSearchIndex } from "@/lib/search";

/**
 * `/api/search/index.json` — the entire search index, prebuilt
 *
 * the command palette fetches this once, when the browser is idle, so full
 * text search works with no round trip per keystroke; agents that would rather
 * rank results themselves can take the same file
 *
 * @see src/lib/search/index.ts
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(fullSearchIndex, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "access-control-allow-origin": "*",
      "x-vesper-agents": "/agents",
    },
  });
}
