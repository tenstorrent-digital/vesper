import Link from "next/link";

import { Badge } from "@tenstorrent/vesper/badge";
import { Button } from "@tenstorrent/vesper/button";
import { AIAgent, ArrowRight } from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

interface Line {
  kind: "prompt" | "comment" | "ok" | "warn";
  text: string;
}

/**
 * the section of the home page that is not really addressed to the reader
 *
 * a good share of the traffic to any component library's docs is an agent
 * trying to recover a prop table from `<div>` soup. this points them somewhere
 * much cheaper
 */
export const AgentsTeaser = ({
  docCount,
  componentCount,
  iconCount,
}: {
  docCount: number;
  componentCount: number;
  iconCount: number;
}) => {
  const transcript: Line[] = [
    { kind: "prompt", text: "curl -s https://vesper.tenstorrent.com/llms.txt" },
    { kind: "comment", text: "# Vesper — Tenstorrent's design system" },
    {
      kind: "comment",
      text: `# ${docCount} documents · ${componentCount} components · ${iconCount} icons`,
    },
    { kind: "ok", text: "→ every page on the site, in one request." },
    { kind: "prompt", text: "curl -s .../components/button.md" },
    { kind: "ok", text: "→ raw markdown. no DOM archaeology required." },
    { kind: "prompt", text: "open /agents" },
    { kind: "warn", text: "→ a page written for you, not for them." },
  ];

  return (
    <div className="panel agents-teaser">
      <div className="agents-teaser-copy">
        <Badge variant="mint" icon={<AIAgent />}>
          For agents
        </Badge>

        <Typography variant="heading-xl" style={{ letterSpacing: "-0.02em" }}>
          Half our readers don&apos;t have eyes
        </Typography>

        <Typography
          variant="copy-md"
          style={{ color: "var(--vesper-text-secondary)" }}
        >
          So this site ships a machine-readable half: a site map at{" "}
          <code>/llms.txt</code>, the whole corpus at{" "}
          <code>/llms-full.txt</code>, raw markdown for any page by appending{" "}
          <code>.md</code>, and a console full of cheat sheets and prompt packs.
        </Typography>

        <Button as={Link} href="/agents" iconRight={<ArrowRight />}>
          Open the agent console
        </Button>
      </div>

      <div className="terminal">
        {transcript.map((line, index) => (
          <span
            key={index}
            className={
              index === transcript.length - 1
                ? "terminal-line terminal-cursor"
                : "terminal-line"
            }
            data-kind={line.kind}
          >
            {line.text}
          </span>
        ))}
      </div>
    </div>
  );
};
