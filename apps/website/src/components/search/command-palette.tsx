"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AIAgent,
  ArrowRight,
  CaretRight,
  Document,
  Grid,
  Search,
} from "@tenstorrent/vesper/icons";
import { Typography } from "@tenstorrent/vesper/typography";

import type { SearchEntry } from "@/lib/search";

import { OPEN_PALETTE_EVENT } from "./open-palette";

interface Result {
  href: string;
  title: string;
  /** the page a heading result belongs to, or the page's own description */
  sub?: string;
  section: string;
  score: number;
  kind: "page" | "heading";
}

/**
 * scores `query` against `text`
 *
 * exact substring matches win, then prefix-of-a-word matches, then a plain
 * subsequence match (so "tgl" still finds "Toggle"). returns `0` for no match
 */
const score = (query: string, text: string): number => {
  const haystack = text.toLowerCase();
  const index = haystack.indexOf(query);

  if (index === 0) return 100;
  if (index > 0) return haystack[index - 1] === " " ? 80 : 60;

  // subsequence: every character of the query appears, in order
  let cursor = 0;
  for (const character of query) {
    cursor = haystack.indexOf(character, cursor);
    if (cursor === -1) return 0;
    cursor += 1;
  }

  return 20;
};

const search = (entries: SearchEntry[], raw: string): Result[] => {
  const query = raw.trim().toLowerCase();

  if (!query) {
    return entries.slice(0, 8).map((entry) => ({
      href: entry.href,
      title: entry.title,
      sub: entry.description,
      section: entry.section,
      score: 0,
      kind: "page" as const,
    }));
  }

  const results: Result[] = [];

  for (const entry of entries) {
    const titleScore = score(query, entry.title);
    const descriptionScore = entry.description
      ? score(query, entry.description) * 0.35
      : 0;

    const best = Math.max(titleScore, descriptionScore);

    if (best > 0) {
      results.push({
        href: entry.href,
        title: entry.title,
        sub: entry.description,
        section: entry.section,
        // a page always outranks one of its own headings
        score: best + 10,
        kind: "page",
      });
    }

    for (const heading of entry.headings) {
      const headingScore = score(query, heading.text);

      if (headingScore > 40) {
        results.push({
          href: `${entry.href}#${heading.id}`,
          title: heading.text,
          sub: entry.title,
          section: entry.section,
          score: headingScore,
          kind: "heading",
        });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 24);
};

const iconFor = (result: Result) => {
  if (result.kind === "heading") return <CaretRight />;
  if (result.href === "/agents") return <AIAgent />;
  if (result.href.startsWith("/components")) return <Grid />;
  return <Document />;
};

/**
 * the ⌘K command palette
 *
 * mounted once in the root layout — it opens on ⌘K / ctrl+K, or when anything
 * on the page fires the `vesper:open-palette` event
 */
export const CommandPalette = ({ entries }: { entries: SearchEntry[] }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const results = useMemo(() => search(entries, query), [entries, query]);

  const close = useCallback(() => dialog.current?.close(), []);

  const open = useCallback((next = "") => {
    setQuery(next);
    setSelected(0);
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  // global shortcut + the `openPalette()` helper
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }

      // "/" is the other muscle memory for search, but not while typing
      const target = event.target as HTMLElement | null;
      const typing =
        target?.closest("input, textarea, select, [contenteditable]") !== null;

      if (event.key === "/" && !typing && !dialog.current?.open) {
        event.preventDefault();
        open();
      }
    };

    const onOpen = (event: Event) => {
      open((event as CustomEvent<{ query?: string }>).detail?.query ?? "");
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, [close, open]);

  // keep the highlighted row in view as the selection moves
  useEffect(() => {
    list.current
      ?.querySelector("[data-selected]")
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelected((current) => (current + 1) % Math.max(results.length, 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelected(
        (current) =>
          (current - 1 + Math.max(results.length, 1)) %
          Math.max(results.length, 1),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const result = results[selected];
      if (result) go(result.href);
    }
  };

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Search documentation"
      onClose={() => setQuery("")}
      // native dialogs do not close on a backdrop click on their own
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <div className="palette-input-row">
        <Search />
        <input
          autoFocus
          type="text"
          value={query}
          spellCheck={false}
          placeholder="Search components, tokens, guides…"
          aria-label="Search query"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0);
          }}
          onKeyDown={onInputKeyDown}
        />
        <kbd className="kbd">esc</kbd>
      </div>

      <div className="palette-results" ref={list}>
        {results.length === 0 ? (
          <div className="palette-empty">
            <Typography variant="copy-sm">
              Nothing matched “{query}”.
            </Typography>
          </div>
        ) : (
          <>
            <Typography
              as="div"
              variant="label-xs-mono"
              className="palette-group-label"
            >
              {query ? `${results.length} results` : "Jump to"}
            </Typography>

            {results.map((result, index) => (
              <a
                key={`${result.href}-${index}`}
                href={result.href}
                className="palette-item"
                data-selected={index === selected || undefined}
                onMouseEnter={() => setSelected(index)}
                onClick={(event) => {
                  event.preventDefault();
                  go(result.href);
                }}
              >
                <span className="palette-item-icon">{iconFor(result)}</span>

                <span className="palette-item-text">
                  <Typography
                    as="span"
                    variant="copy-sm-bold"
                    className="palette-item-title"
                  >
                    {result.title}
                  </Typography>
                  {result.sub && (
                    <Typography
                      as="span"
                      variant="copy-xs"
                      className="palette-item-sub"
                    >
                      {result.sub}
                    </Typography>
                  )}
                </span>

                <span className="palette-item-enter">
                  <ArrowRight width={14} height={14} />
                </span>
              </a>
            ))}
          </>
        )}
      </div>

      <div className="palette-footer">
        <Typography as="span" variant="label-xs-mono" className="palette-hint">
          <kbd className="kbd">↑</kbd>
          <kbd className="kbd">↓</kbd> navigate
        </Typography>
        <Typography as="span" variant="label-xs-mono" className="palette-hint">
          <kbd className="kbd">↵</kbd> open
        </Typography>
        <Typography
          as="span"
          variant="label-xs-mono"
          className="palette-hint palette-footer-end"
        >
          {entries.length} pages indexed
        </Typography>
      </div>
    </dialog>
  );
};
