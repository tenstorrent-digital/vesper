import { Toasts } from "@tenstorrent/vesper/toast";

import { Nav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";

import { getSidebarData } from "@/lib/filesystem/docs";
import { ibm_plex_mono, inter_tight } from "@/lib/style/fonts";
import { cn } from "@/lib/tailwind/cn";

import "@/lib/style/css/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter_tight.variable,
        ibm_plex_mono.variable,
        "antialiased",
      )}
      data-scroll-behavior="smooth"
    >
      <body>
        <div className="flex min-h-svh flex-col">
          <Nav />
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col-reverse items-start md:flex-row">
            <Sidebar data={getSidebarData()} />
            <div
              className={cn(
                "p-vesper-4 pb-vesper-12 mb-vesper-4 w-full min-w-0 flex-1 md:mb-0",
                "border-vesper-border-tertiary border-b md:border-b-0",
              )}
            >
              {children}
            </div>
          </div>
        </div>
        <Toasts />
      </body>
    </html>
  );
}
