"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { ArrowUpRight, Search } from "@tenstorrent/vesper/icons";
import { TextInput } from "@tenstorrent/vesper/text-input";
import { Toggle } from "@tenstorrent/vesper/toggle";
import { Typography } from "@tenstorrent/vesper/typography";

import { CATEGORIES, SHOWCASE } from "@/components/showcase/registry";

const ALL = "all";

/**
 * `/components` — every component in the system, previewed live and filterable
 * by name, keyword, or category
 */
export const Gallery = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return SHOWCASE.filter((entry) => {
      if (category !== ALL && entry.category !== category) return false;
      if (!needle) return true;

      return `${entry.name} ${entry.category} ${entry.keywords ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [query, category]);

  return (
    <div className="gallery">
      <header className="home-section-head">
        <Typography as="div" variant="label-xs-mono" className="eyebrow">
          {SHOWCASE.length} components
        </Typography>
        <Typography as="h1" variant="heading-2xl" className="doc-title">
          The whole box
        </Typography>
        <Typography variant="copy-lg" className="home-section-copy">
          Every component Vesper ships, rendered live. Filter by what you are
          trying to build, then follow one through to its documentation.
        </Typography>
      </header>

      <div className="gallery-toolbar">
        <TextInput
          className="gallery-search"
          aria-label="Filter components"
          placeholder="Filter by name or keyword…"
          size="sm"
          iconLeft={<Search />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <div className="gallery-filters">
          <Toggle
            size="sm"
            value={category}
            onValueChange={setCategory}
            options={[
              { text: "All", value: ALL },
              ...CATEGORIES.map((name) => ({
                text: name[0]!.toUpperCase() + name.slice(1),
                value: name,
              })),
            ]}
          />
        </div>

        <Typography as="span" variant="label-xs-mono" className="gallery-count">
          {String(results.length).padStart(2, "0")} / {SHOWCASE.length}
        </Typography>
      </div>

      {results.length === 0 ? (
        <div className="gallery-empty">
          <Typography variant="heading-sm">
            No component matches that.
          </Typography>
          <Typography variant="copy-sm">
            Try “input”, “overlay”, or something less specific.
          </Typography>
        </div>
      ) : (
        <div className="gallery-grid">
          {results.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="panel gallery-card"
            >
              {/*
                the preview is decorative, and `pointer-events: none` alone
                would still leave its inputs and buttons in the tab order —
                `inert` takes them out of it as well
              */}
              <div className="gallery-preview" inert aria-hidden="true">
                {entry.preview}
              </div>

              <div className="gallery-meta">
                <Typography variant="copy-md-bold" className="gallery-name">
                  {entry.name}
                </Typography>
                <Typography
                  as="span"
                  variant="label-xs-mono"
                  style={{ color: "var(--vesper-text-tertiary)" }}
                >
                  {entry.category}
                </Typography>
                <ArrowUpRight className="gallery-arrow" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
