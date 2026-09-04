"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

interface Heading {
  id: string;
  text: string;
  /** heading level, used to indent `h3`s under their `h2` */
  level: number;
}

/**
 * on-page navigation for the current document
 *
 * headings are read from the rendered DOM rather than from the MDX source: the
 * documents in `docs/` are compiled by `@next/mdx` and rendered on the server,
 * so this keeps the table of contents working for every route (including the
 * hand-written `/components` page) without a second pass over the content
 */
export const TableOfContents = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const elements = [
      ...document.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]"),
    ];

    setHeadings(
      elements.map((element) => ({
        id: element.id,
        text: element.textContent ?? "",
        level: Number(element.tagName[1]),
      })),
    );
    setActiveId(elements[0]?.id);

    if (elements.length === 0) return;

    /**
     * track which headings are above the top of the viewport rather than which
     * are intersecting: with a long section on screen no heading intersects at
     * all, which would otherwise leave the rail with nothing marked active
     */
    const observer = new IntersectionObserver(
      () => {
        const scrolledPast = elements.filter(
          (element) => element.getBoundingClientRect().top <= 96,
        );

        setActiveId(
          (scrolledPast.at(-1) ?? elements[0])?.id ?? elements[0]?.id,
        );
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: [0, 1] },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  // a single section is not worth a rail of its own
  if (headings.length < 2) return null;

  return (
    <nav id="toc" aria-label="On this page" className={className}>
      <div className="toc-inner">
        <Typography as="span" variant="label-xs-mono" className="toc-label">
          On this page
        </Typography>
        <ul className="toc-list">
          {headings.map(({ id, text, level }) => (
            <li key={id} data-level={level}>
              <Typography
                as="a"
                href={`#${id}`}
                variant="copy-sm"
                data-active={id === activeId || undefined}
                aria-current={id === activeId ? "location" : undefined}
              >
                {text}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
