import { Nav } from "@/components/nav/nav";
import { Sidebar } from "@/components/nav/sidebar";
import { Prose } from "@/components/prose";

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
    >
      <body>
        <div className="layout">
          <Nav />
          <Sidebar className="desktop" />
          <section className="content">
            <Prose>{children}</Prose>
          </section>
        </div>
      </body>
    </html>
  );
}
