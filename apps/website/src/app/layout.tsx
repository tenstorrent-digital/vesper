import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav/nav";
import { Sidebar } from "@/components/nav/sidebar";
import { TableOfContents } from "@/components/nav/table-of-contents";
import { Prose } from "@/components/prose";

import { THEME_STORAGE_KEY } from "@/lib/constants";
import { ibm_plex_mono, inter_tight } from "@/lib/style/fonts";
import { cn } from "@/lib/tailwind/cn";

import "@/lib/style/css/globals.css";

/**
 * applies the stored theme before first paint, so a reload never flashes the
 * theme the visitor just switched away from
 *
 * deliberately tiny and dependency-free: it runs ahead of hydration, and the
 * value it reads is written by `ThemeToggle`
 */
const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t)document.documentElement.setAttribute("data-vesper-theme",t)}catch(e){}`;

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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="layout">
          <Nav />
          <Sidebar className="desktop" />
          <main className="content">
            <Prose>{children}</Prose>
            <Footer />
          </main>
          <TableOfContents className="desktop" />
        </div>
      </body>
    </html>
  );
}
