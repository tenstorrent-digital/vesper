import { importPathFor } from "@/lib/agents";
import { BASE_URL } from "@/lib/constants";
import { fullSearchIndex } from "@/lib/search";
import { search, type SearchResultKind, WEIGHTS } from "@/lib/search/query";

/**
 * `/api/search` — the docs search, for agents
 *
 * the same index and the same ranking the ⌘K palette uses, so a person and an
 * agent asking the same question get the same answers in the same order
 *
 *     GET /api/search?q=toast&limit=5
 *     GET /api/search?q=timeout&kind=content
 *
 * every result carries a `markdown` URL, because the point of finding a page
 * is reading it, and reading it should not involve HTML
 */
export const dynamic = "force-dynamic";

const KINDS: SearchResultKind[] = ["page", "heading", "content"];

const MAX_LIMIT = 50;

const USAGE = {
  endpoint: `${BASE_URL}/api/search`,
  parameters: {
    q: "the search query (required)",
    limit: `how many results to return, 1-${MAX_LIMIT} (default 10)`,
    kind: `filter by result kind: ${KINDS.join(", ")} (repeatable, default all)`,
  },
  examples: [
    `${BASE_URL}/api/search?q=toast`,
    `${BASE_URL}/api/search?q=auto-dismiss&kind=content&limit=3`,
  ],
  related: {
    index: `${BASE_URL}/api/search/index.json`,
    map: `${BASE_URL}/llms.txt`,
    everything: `${BASE_URL}/llms-full.txt`,
  },
};

const HEADERS = {
  "cache-control": "public, max-age=60, stale-while-revalidate=600",
  // a search endpoint nobody can call from anywhere is not much of an endpoint
  "access-control-allow-origin": "*",
  "x-vesper-agents": "/agents",
};

export function GET(request: Request) {
  const parameters = new URL(request.url).searchParams;
  const query = parameters.get("q") ?? parameters.get("query") ?? "";

  if (!query.trim()) {
    return Response.json(
      {
        error: "Missing required parameter: q",
        usage: USAGE,
      },
      { status: 400, headers: HEADERS },
    );
  }

  const requested = [
    ...parameters.getAll("kind"),
    ...(parameters.get("kinds")?.split(",") ?? []),
  ]
    .map((kind) => kind.trim())
    .filter((kind): kind is SearchResultKind =>
      KINDS.includes(kind as SearchResultKind),
    );

  const limit = Math.min(
    Math.max(Number(parameters.get("limit")) || 10, 1),
    MAX_LIMIT,
  );

  const results = search(fullSearchIndex, query, {
    limit,
    ...(requested.length > 0 ? { kinds: requested } : {}),
  });

  return Response.json(
    {
      query,
      count: results.length,
      limit,
      weights: WEIGHTS,
      results: results.map((result) => {
        const [path] = result.href.split("#");
        const slug = path!.split("/").filter(Boolean);

        return {
          title: result.title,
          page: result.kind === "page" ? result.title : result.sub,
          section: result.section,
          kind: result.kind,
          score: result.score,
          snippet: result.snippet,
          url: `${BASE_URL}${result.href}`,
          markdown: `${BASE_URL}${path}.md`,
          import: importPathFor(slug),
        };
      }),
      hint: "Fetch a result's `markdown` URL for the whole document, or /llms-full.txt for all of them.",
    },
    { headers: HEADERS },
  );
}
