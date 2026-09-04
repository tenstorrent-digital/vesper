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
      data-scroll-behavior="smooth"
    >
      <body>
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[auto_1fr]">
          <Nav />
          <Sidebar />
          <main className="order-2 w-full min-w-0 pb-8 md:order-none md:col-start-2 md:row-start-2">
            <Prose>{children}</Prose>
          </main>
        </div>
      </body>
    </html>
  );
}
