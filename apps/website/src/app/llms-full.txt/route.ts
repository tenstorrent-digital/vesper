import { llmsFullTxt } from "@/lib/agents";

/**
 * `/llms-full.txt` — every document in `docs/`, concatenated
 *
 * @see src/lib/agents.ts
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFullTxt(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "x-vesper-agents": "/agents",
    },
  });
}
