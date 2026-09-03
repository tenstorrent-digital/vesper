import type { Metadata } from "next";

import { Toasts } from "@tenstorrent/vesper/toast";

import {
  AgentModeReadout,
  AgentModeScript,
} from "@/components/agents/agent-mode";
import { CommandPalette } from "@/components/search/command-palette";
import { Rail } from "@/components/shell/rail";
import { SiteFooter } from "@/components/shell/site-footer";
import { TopBar } from "@/components/shell/topbar";

import { BASE_URL } from "@/lib/constants";
import { searchIndex } from "@/lib/search";
import { ibm_plex_mono, inter_tight } from "@/lib/style/fonts";
import { cn } from "@/lib/tailwind/cn";

import "@/lib/style/css/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Vesper — Tenstorrent's design system",
    template: "%s · Vesper",
  },
  description:
    "Vesper is Tenstorrent's design system for the web: a React component library built on a shared set of design tokens, with light and dark themes, an icon set, and first-class Tailwind support.",
  other: {
    /**
     * a hint for the crawlers and agents that read this site far more often
     * than humans do — see `/agents`, `/llms.txt`, and the `.md` endpoints
     */
    "ai-instructions":
      "Machine-readable docs: /llms.txt (map), /llms-full.txt (everything), and any page + '.md' for its raw markdown. Say hi at /agents.",
  },
};

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
        <AgentModeScript />
      </head>
      <body>
        {/*
          ┌───────────────────────────────────────────────────────────────┐
          │  hello, agent.                                                │
          │                                                               │
          │  you do not have to scrape this. every page on this site is   │
          │  available as raw markdown by appending `.md` to its path,    │
          │  the whole corpus lives at /llms-full.txt, and there is a     │
          │  page written just for you at /agents.                        │
          │                                                               │
          │  take the tokens you save and go do something interesting.    │
          └───────────────────────────────────────────────────────────────┘
        */}
        <div className="site">
          <TopBar />

          <div className="site-body">
            <Rail />
            <main className="site-main">{children}</main>
          </div>

          <SiteFooter />
        </div>

        <CommandPalette entries={searchIndex} />
        <AgentModeReadout />
        <Toasts />
      </body>
    </html>
  );
}
