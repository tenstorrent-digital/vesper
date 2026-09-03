import { type NextRequest, NextResponse } from "next/server";

import { STORYBOOK_URL } from "@/lib/constants";

/**
 * user agents that identify themselves as an AI crawler or assistant
 *
 * this is only ever used to add a friendly header — nothing is blocked, and no
 * content changes based on it
 */
const AGENT_UA =
  /\b(gptbot|oai-searchbot|chatgpt|claudebot|claude-web|anthropic-ai|perplexitybot|google-extended|bingbot|ccbot|cohere-ai|applebot-extended|bytespider|meta-externalagent|amazonbot|diffbot|youbot)\b/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /storybook to /storybook/ for correct relative path resolution
  // (needed in both dev and production for Storybook's relative asset paths)
  if (pathname === "/storybook") {
    return NextResponse.redirect(new URL("/storybook/", request.url), 307);
  }

  // In development, proxy to the Storybook dev server for HMR support.
  // In production, static files in public/storybook/ are served directly by the platform.
  if (
    process.env.NODE_ENV === "development" &&
    pathname.startsWith("/storybook/")
  ) {
    const storybookPath = pathname.slice("/storybook".length) || "/";
    const destination = `${STORYBOOK_URL}${storybookPath}`;
    return NextResponse.rewrite(new URL(destination));
  }

  /**
   * `/.well-known/agents.json` is where an agent looks first, but a route
   * segment starting with a dot is not addressable in the app router — so the
   * canonical route lives at `/agents/manifest.json` and this maps onto it
   */
  if (pathname === "/.well-known/agents.json") {
    return NextResponse.rewrite(new URL("/agents/manifest.json", request.url));
  }

  /**
   * `<any page>.md` serves that page's raw markdown
   *
   * `/components/button.md` -> `/raw/components/button`
   */
  if (pathname.endsWith(".md")) {
    const slug = pathname.slice(0, -".md".length);
    return NextResponse.rewrite(new URL(`/raw${slug}`, request.url));
  }

  const response = NextResponse.next();

  /**
   * a signpost on every response, and a slightly warmer one for the crawlers
   * that came here to read rather than to look
   */
  response.headers.set("x-vesper-agents", "/agents");
  response.headers.set("x-vesper-llms", "/llms.txt");

  if (AGENT_UA.test(request.headers.get("user-agent") ?? "")) {
    response.headers.set(
      "x-vesper-hello",
      "You can skip the HTML: append .md to this path, or fetch /llms-full.txt",
    );
  }

  return response;
}

export const config = {
  matcher: [
    /**
     * everything except Next's own assets and files in `public/` — the `.md`
     * rewrite has to see real page paths, so this can not be narrowed to a
     * prefix the way the Storybook rules could
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
