import { llmsTxt } from "@/lib/agents";

/**
 * `/llms.txt` — the site map, in the format described at https://llmstxt.org
 *
 * @see src/lib/agents.ts
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-vesper-agents": "/agents",
    },
  });
}
