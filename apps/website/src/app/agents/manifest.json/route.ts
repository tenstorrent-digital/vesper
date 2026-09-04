import { agentManifest } from "@/lib/agents";

/**
 * `/agents/manifest.json` — every machine-readable entrypoint, as JSON
 *
 * also served at `/.well-known/agents.json` (see `src/proxy.ts`)
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(agentManifest(), {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "x-vesper-agents": "/agents",
    },
  });
}
