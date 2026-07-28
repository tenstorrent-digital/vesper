import { type NextRequest, NextResponse } from "next/server";

import { STORYBOOK_URL } from "@/lib/constants";

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/storybook", "/storybook/:path*"],
};
