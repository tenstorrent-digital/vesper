"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Typography } from "@tenstorrent/vesper/typography";

export interface RailSection {
  id: string;
  label: string;
  pages: { href: string; title: string }[];
}

/**
 * the list of every page on the site, grouped by section
 *
 * shared by the desktop rail and the mobile drawer — `onNavigate` lets the
 * drawer close itself when a link is followed
 */
export const RailNav = ({
  sections,
  onNavigate,
}: {
  sections: RailSection[];
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <div className="rail-inner">
      {sections.map((section) => (
        <div key={section.id} className="rail-section">
          <Typography
            as="div"
            variant="label-xs-mono"
            className="rail-section-label"
          >
            {section.label}
          </Typography>

          {section.pages.map(({ href, title }) => (
            <Typography
              key={href}
              as={Link}
              href={href}
              variant="copy-sm"
              className="rail-link"
              data-active={pathname === href || undefined}
              aria-current={pathname === href ? "page" : undefined}
              onClick={onNavigate}
            >
              {title}
            </Typography>
          ))}
        </div>
      ))}
    </div>
  );
};
