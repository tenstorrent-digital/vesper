import { BASE_URL } from "@/lib/constants";

/**
 * `/robots.txt`
 *
 * crawling is explicitly welcome here — but the plain-text endpoints are
 * cheaper for everyone involved, so they are advertised right at the top
 */
export const dynamic = "force-static";

export function GET() {
  const body = [
    `# Vesper — Tenstorrent's design system`,
    `#`,
    `# Crawlers and agents are welcome. Before you render this site:`,
    `#   ${BASE_URL}/llms.txt        a map of every page`,
    `#   ${BASE_URL}/llms-full.txt   all of it, in one file`,
    `#   ${BASE_URL}/agents          a page written for you`,
    `#   <any page>.md              raw markdown, no DOM required`,
    ``,
    `User-agent: *`,
    `Allow: /`,
    ``,
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    ``,
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
