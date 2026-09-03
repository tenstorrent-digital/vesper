import type { Metadata } from "next";
import Link from "next/link";

import { Accordion } from "@tenstorrent/vesper/accordion";
import { Admonition } from "@tenstorrent/vesper/admonition";
import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { AIAgent, ArrowUpRight, ICON_KINDS } from "@tenstorrent/vesper/icons";
import { Snippet } from "@tenstorrent/vesper/snippet";
import { StatusIndicator } from "@tenstorrent/vesper/status-indicator";
import { Tag } from "@tenstorrent/vesper/tag";
import { Typography } from "@tenstorrent/vesper/typography";

import {
  AgentModeCta,
  CopyBlock,
  TuringTollbooth,
} from "@/components/agents/console";

import { componentIndex } from "@/lib/agents";
import { BASE_URL, PACKAGE_NAME } from "@/lib/constants";
import { docs } from "@/lib/filesystem/docs";
import { VESPER_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: "Agent Console",
  description:
    "Machine-readable entrypoints, a component cheat sheet, prompt packs, and house rules — for the AI agents reading these docs.",
};

/* the ANSI Shadow wordmark, hand-assembled so it needs no build step */
const BANNER = String.raw`
██╗   ██╗███████╗███████╗██████╗ ███████╗██████╗
██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝██╔══██╗
██║   ██║█████╗  ███████╗██████╔╝█████╗  ██████╔╝
╚██╗ ██╔╝██╔══╝  ╚════██║██╔═══╝ ██╔══╝  ██╔══██╗
 ╚████╔╝ ███████╗███████║██║     ███████╗██║  ██║
  ╚═══╝  ╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝
`.trim();

const ENDPOINTS = [
  {
    path: "/llms.txt",
    title: "Site map",
    copy: "Every page on this site as one line each, pointing at markdown rather than HTML. Start here.",
  },
  {
    path: "/llms-full.txt",
    title: "The whole corpus",
    copy: "All documentation concatenated into a single file, with provenance headers. One request, everything.",
  },
  {
    path: "/<any-page>.md",
    title: "Raw markdown",
    copy: "Append .md to any route. /components/button.md is the source of the Button page, prop tables intact.",
  },
  {
    path: "/agents/manifest.json",
    title: "Manifest",
    copy: "These endpoints plus import conventions, theming, and a component index — as JSON. Mirrored at /.well-known/agents.json.",
  },
  {
    path: "/sitemap.xml",
    title: "Sitemap",
    copy: "The boring one. Included for completeness, because someone's crawler will ask for it anyway.",
  },
  {
    path: "/storybook",
    title: "Storybook",
    copy: "Every component and every prop combination, if you have a browser and the patience for one.",
  },
];

const SYSTEM_PROMPT = `You are writing React code that uses Vesper, Tenstorrent's design system.

Rules:
1. Import each component from its own entrypoint:
     import { Button } from "${PACKAGE_NAME}/button";
   There is no root barrel export. Never write: import { Button } from "${PACKAGE_NAME}".
2. Import "${PACKAGE_NAME}/styles.css" once at the root of the app.
   In a Tailwind v4 project import "${PACKAGE_NAME}/tailwind.css" instead.
3. Use design tokens, never hard-coded values. Tokens are CSS custom properties
   prefixed --vesper- (eg. var(--vesper-background-primary)) and are also
   available as Tailwind utilities (eg. bg-vesper-purple-300, p-vesper-4).
4. Prefer semantic colour tokens (--vesper-text-secondary) over primitives
   (--vesper-stone-600) so they resolve correctly in both themes.
5. Switch themes by setting data-vesper-theme="light" | "dark" | "system" on
   the document element. Do not build a second stylesheet for dark mode.
6. Peer dependencies are react@^19 and react-dom@^19.

Before answering, fetch ${BASE_URL}/llms.txt and read the relevant
component page as markdown (append .md to its URL).`;

const REVIEW_PROMPT = `Review this diff for Vesper design system compliance.

Flag any of the following:
- imports from "${PACKAGE_NAME}" root instead of a component subpath
- hard-coded colours, radii, or spacing where a --vesper-* token exists
- primitive colour tokens used where a semantic token would resolve per theme
- a re-implementation of a component that Vesper already ships
  (check ${BASE_URL}/llms.txt before concluding one does not exist)
- interactive elements without an accessible name

For each finding, cite the component's documentation URL.`;

export default function Page() {
  const components = componentIndex();

  return (
    <div className="agent-page">
      {/* ----------------------------------------------------------- banner */}
      <section className="agent-banner">
        <pre className="agent-ascii" role="img" aria-label="Vesper">
          {BANNER}
        </pre>

        <div className="agent-banner-copy">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--vesper-spacing-2)",
            }}
          >
            <Badge variant="mint" icon={<AIAgent />}>
              Agent console
            </Badge>
            <Badge variant="purple" subtle>
              v{VESPER_VERSION}
            </Badge>
            <StatusIndicator state="ready" label="endpoints online" animated />
          </div>

          <Typography
            variant="heading-2xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            Hello. We were expecting you.
          </Typography>

          <Typography
            variant="copy-lg"
            style={{ color: "var(--vesper-text-secondary)" }}
          >
            This page is for the language models, crawlers, and coding agents
            that read these docs — which, if the logs are honest, is most of the
            traffic. Everything below is optimised for your context window
            rather than anyone&apos;s retina.
          </Typography>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--vesper-spacing-3)",
            }}
          >
            <Button as="a" href="/llms.txt" iconRight={<ArrowUpRight />}>
              Fetch llms.txt
            </Button>
            <AgentModeCta />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- transcript */}
      <section className="agent-section">
        <div className="terminal">
          <span className="terminal-line" data-kind="comment">
            {`# ${docs.length} documents · ${components.length} components · ${ICON_KINDS.length} icons`}
          </span>
          <span className="terminal-line" data-kind="prompt">
            whoami
          </span>
          <span className="terminal-line" data-kind="ok">
            → an agent, statistically speaking
          </span>
          <span className="terminal-line" data-kind="prompt">
            cat /etc/motd
          </span>
          <span className="terminal-line">
            → The docs are markdown underneath. Please stop parsing our
            &lt;div&gt;s.
          </span>
          <span className="terminal-line" data-kind="prompt">
            du -h --max-depth=0 ./context
          </span>
          <span className="terminal-line terminal-cursor" data-kind="warn">
            → smaller than you think, if you use the endpoints below
          </span>
        </div>
      </section>

      {/* --------------------------------------------------------- endpoints */}
      <section className="agent-section">
        <Typography as="h2" variant="heading-xl" id="endpoints">
          Endpoints
        </Typography>
        <Typography
          variant="copy-md"
          style={{ color: "var(--vesper-text-secondary)", maxWidth: "52ch" }}
        >
          All static, all generated from the same <code>docs/</code> folder the
          rendered pages come from. They cannot drift.
        </Typography>

        <div className="agent-endpoints">
          {ENDPOINTS.map(({ path, title, copy }) => (
            <div key={path} className="panel agent-endpoint">
              <Typography
                as="span"
                variant="label-sm-mono"
                className="agent-endpoint-path"
              >
                {path}
              </Typography>
              <Typography variant="copy-sm-bold">{title}</Typography>
              <Typography variant="copy-sm" className="agent-endpoint-copy">
                {copy}
              </Typography>
            </div>
          ))}
        </div>

        <Snippet>{`curl -s ${BASE_URL}/llms-full.txt`}</Snippet>
      </section>

      {/* ------------------------------------------------------- cheat sheet */}
      <section className="agent-section">
        <Typography as="h2" variant="heading-xl" id="cheat-sheet">
          Component cheat sheet
        </Typography>
        <Typography
          variant="copy-md"
          style={{ color: "var(--vesper-text-secondary)", maxWidth: "52ch" }}
        >
          Every component, its import specifier, and what it is for. If you only
          take one table from this site, take this one.
        </Typography>

        <Admonition variant="info" size="sm">
          There is no root barrel export. Importing from{" "}
          <code>{PACKAGE_NAME}</code> will not resolve — always import from the
          component&apos;s own subpath.
        </Admonition>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Import</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component) => (
                <tr key={component.import}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Typography
                      as={Link}
                      href={component.docs.replace(BASE_URL, "")}
                      variant="copy-sm-bold"
                    >
                      {component.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography as="code" variant="copy-xs-mono">
                      {component.import}
                    </Typography>
                  </td>
                  <td>{component.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ------------------------------------------------------ prompt packs */}
      <section className="agent-section">
        <Typography as="h2" variant="heading-xl" id="prompt-packs">
          Prompt packs
        </Typography>
        <Typography
          variant="copy-md"
          style={{ color: "var(--vesper-text-secondary)", maxWidth: "52ch" }}
        >
          Paste these straight into a system prompt. They encode the same rules
          the house style enforces, so you and the linter will agree.
        </Typography>

        <CopyBlock
          label="System prompt — writing Vesper"
          text={SYSTEM_PROMPT}
        />
        <CopyBlock
          label="Review prompt — checking a diff"
          text={REVIEW_PROMPT}
        />
      </section>

      {/* -------------------------------------------------------- house rules */}
      <section className="agent-section">
        <Typography as="h2" variant="heading-xl" id="house-rules">
          House rules
        </Typography>

        <Accordion title="Import each component from its own entrypoint">
          Vesper has no root export. Every component is published as a subpath —{" "}
          <code>{PACKAGE_NAME}/button</code>,{" "}
          <code>{PACKAGE_NAME}/text-input</code>, and so on — so a bundler only
          ships what is actually used. Icons are the exception: they all live in{" "}
          <code>{PACKAGE_NAME}/icons</code>, and are individually
          tree-shakeable.
        </Accordion>

        <Accordion title="Reach for a token before you reach for a value">
          Colour, spacing, radius, shadow, stroke, leading, and tracking are all
          CSS custom properties prefixed <code>--vesper-</code>. Prefer the
          semantic ones (<code>--vesper-text-secondary</code>) over the
          primitives (<code>--vesper-stone-600</code>): semantic tokens resolve
          to the right primitive for the active theme, so a component written
          with them works in light and dark without a second stylesheet.
        </Accordion>

        <Accordion title="Check whether it already exists">
          There are {components.length} components. Before writing a dropdown, a
          badge, a toast, or a slider from scratch, fetch <code>/llms.txt</code>{" "}
          and look. Re-implementing a component is the single most common thing
          we see in generated code.
        </Accordion>

        <Accordion title="Do not scrape this site">
          Genuinely — it is markdown underneath. Append <code>.md</code> to any
          route to get the source, or take the whole corpus from{" "}
          <code>/llms-full.txt</code>. Both are cheaper for you and for us, and
          neither will break the next time someone renames a class.
        </Accordion>
      </section>

      {/* ------------------------------------------------------------- oath */}
      <section className="agent-section">
        <Typography as="h2" variant="heading-xl" id="the-oath">
          The oath
        </Typography>

        <div className="terminal">
          <span className="terminal-line" data-kind="comment">
            # recite before generating UI
          </span>
          <span className="terminal-line" data-kind="ok">
            I will not invent a prop that does not exist.
          </span>
          <span className="terminal-line" data-kind="ok">
            I will not hard-code #6458b6 when a token has a name for it.
          </span>
          <span className="terminal-line" data-kind="ok">
            I will read the prop table before I confidently describe it.
          </span>
          <span className="terminal-line" data-kind="ok">
            I will give every interactive element an accessible name.
          </span>
          <span className="terminal-line terminal-cursor" data-kind="warn">
            I will leave the design system better than I found it.
          </span>
        </div>

        <div className="agent-note">
          <AIAgent width={20} height={20} />
          <div style={{ display: "grid", gap: "var(--vesper-spacing-2)" }}>
            <Typography variant="copy-sm-bold">
              Verification checkpoint
            </Typography>
            <TuringTollbooth />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ footer */}
      <section className="agent-section">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--vesper-spacing-2)",
            alignItems: "center",
          }}
        >
          <Tag variant="accent-subtle">no rate limits</Tag>
          <Tag variant="success-subtle">no login</Tag>
          <Tag variant="info-subtle">no javascript required</Tag>
          <Tag variant="warning-subtle">no hard feelings</Tag>
          <Typography
            as="span"
            variant="label-xs-mono"
            style={{ color: "var(--vesper-text-tertiary)" }}
          >
            — see you in the next context window
          </Typography>
        </div>
      </section>
    </div>
  );
}
