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

import {
  search,
  SEARCH_INDEX_PATH,
  type SearchEntry,
  type SearchResult,
  terms,
} from "@/lib/search/query";

import { OPEN_PALETTE_EVENT } from "./open-palette";

const iconFor = (result: SearchResult) => {
  if (result.kind === "heading" || result.kind === "content")
    return <CaretRight />;
  if (result.href === "/agents") return <AIAgent />;
  if (result.href.startsWith("/components")) return <Grid />;
  return <Document />;
};

/**
 * marks every part of `text` that the query matched on
 *
 * built from {@link terms}, so it highlights the phrase, its words, and the
 * stems those words matched on — and does it by splitting the string rather
 * than by setting any inner HTML
 */
const highlight = (text: string, query: string) => {
  const words = terms(query);
  if (words.length === 0) return text;

  const pattern = new RegExp(
    `(${words
      // longest first, so "toasts" wins over the "toast" inside it
      .sort((a, b) => b.length - a.length)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&"))
      .join("|")})`,
    "gi",
  );

  // splitting on one capturing group alternates text, match, text, match…
  return text
    .split(pattern)
    .map((part, index) =>
      index % 2 === 1 ? <mark key={index}>{part}</mark> : part,
    );
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

  /**
   * the full-text half of the index
   *
   * `entries` (titles, descriptions, headings) arrives with the page, so the
   * palette is useful on the first keystroke; the prose is a few hundred
   * kilobytes, so it is fetched once in the background and swapped in
   */
  const [fullText, setFullText] = useState<SearchEntry[] | null>(null);
  const loading = useRef(false);

  const loadFullText = useCallback(async () => {
    if (loading.current) return;
    loading.current = true;

    try {
      const response = await fetch(SEARCH_INDEX_PATH);
      if (response.ok) setFullText((await response.json()) as SearchEntry[]);
    } catch {
      // the lite index still works — full text is an upgrade, not a dependency
    }
  }, []);

  const results = useMemo(
    () => search(fullText ?? entries, query),
    [entries, fullText, query],
  );

  const close = useCallback(() => dialog.current?.close(), []);

  const open = useCallback(
    (next = "") => {
      setQuery(next);
      setSelected(0);
      if (!dialog.current?.open) dialog.current?.showModal();
      // in case the browser never got around to being idle
      void loadFullText();
    },
    [loadFullText],
  );

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
      const typing = Boolean(
        target?.closest("input, textarea, select, [contenteditable]"),
      );

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

  /**
   * pull the full-text index down once the browser has nothing better to do —
   * by the time ⌘K is pressed it is usually already here
   */
  useEffect(() => {
    if (typeof requestIdleCallback !== "function") {
      const timer = setTimeout(loadFullText, 2_000);
      return () => clearTimeout(timer);
    }

    const handle = requestIdleCallback(() => void loadFullText(), {
      timeout: 5_000,
    });

    return () => cancelIdleCallback(handle);
  }, [loadFullText]);

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
                    {highlight(result.title, query)}
                    {result.snippet && result.sub && (
                      <span className="palette-item-page"> · {result.sub}</span>
                    )}
                  </Typography>
                  {result.snippet ? (
                    <Typography
                      as="span"
                      variant="copy-xs"
                      className="palette-item-snippet"
                    >
                      {highlight(result.snippet, query)}
                    </Typography>
                  ) : (
                    result.sub && (
                      <Typography
                        as="span"
                        variant="copy-xs"
                        className="palette-item-sub"
                      >
                        {result.sub}
                      </Typography>
                    )
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
          {entries.length} pages
          {fullText ? ", full text" : " indexed"}
        </Typography>
      </div>
    </dialog>
  );
};
