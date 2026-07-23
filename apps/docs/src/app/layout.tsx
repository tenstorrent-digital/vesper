import Nav from "@/components/nav";
import Prose from "@/components/prose";

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
      <body className="">
        {/* nav, header, footer, etc */}
        <Nav />

        <Prose>{children}</Prose>
      </body>
    </html>
  );
}
