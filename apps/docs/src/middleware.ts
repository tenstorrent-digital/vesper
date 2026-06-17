import { type NextRequest, NextResponse } from "next/server";

const STORYBOOK_URL = "http://localhost:6006";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /storybook to /storybook/ for correct relative path resolution
  if (pathname === "/storybook") {
    return NextResponse.redirect(new URL("/storybook/", request.url), 307);
  }

  // Proxy /storybook/* to the Storybook dev server
  if (pathname.startsWith("/storybook/")) {
    const storybookPath = pathname.slice("/storybook".length) || "/";
    const destination = `${STORYBOOK_URL}${storybookPath}`;
    return NextResponse.rewrite(new URL(destination));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/storybook", "/storybook/:path*"],
};
