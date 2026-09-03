"use client";

import { useEffect, useState } from "react";

import { ProgressBar } from "@tenstorrent/vesper/progress-bar";
import { Typography } from "@tenstorrent/vesper/typography";

import type { DocHeading } from "@/lib/filesystem/docs/source";

/**
 * "On this page", with a scroll spy and a reading-progress bar
 *
 * the active heading is the last one whose top has passed under the top bar,
 * which is what a reader intuitively considers "where I am" — an
 * IntersectionObserver gets this wrong for short sections that never fill the
 * viewport
 */
export const Toc = ({ headings }: { headings: DocHeading[] }) => {
  const [active, setActive] = useState<string | undefined>(headings[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      const offset =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--topbar-height",
          ),
        ) * 16 || 56;

      const threshold = offset + 24;

      let current = headings[0]?.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= threshold) {
          current = heading.id;
        }
      }

      setActive(current);

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress(
        scrollable > 0
          ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100))
          : 0,
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="On this page">
      <Typography as="div" variant="label-xs-mono" className="toc-label">
        On this page
      </Typography>

      <div className="toc-list">
        {headings.map(({ id, text, depth }) => (
          <Typography
            key={id}
            as="a"
            href={`#${id}`}
            variant="copy-xs"
            className="toc-link"
            data-depth={depth}
            data-active={id === active || undefined}
          >
            {text}
          </Typography>
        ))}
      </div>

      <ProgressBar
        value={progress}
        size="sm"
        aria-label="Reading progress"
        style={{ marginTop: "var(--vesper-spacing-4)" }}
      />
    </nav>
  );
};
