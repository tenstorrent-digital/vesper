import { navSections } from "@/lib/nav";

import { RailNav, type RailSection } from "./rail-nav";

/**
 * the site's navigation, flattened to just what the client needs
 *
 * `navSections` also carries every heading of every page (for search and the
 * table of contents) — none of that should end up in the rail's payload
 */
export const railSections: RailSection[] = navSections.map(
  ({ id, label, pages }) => ({
    id,
    label,
    pages: pages.map(({ href, title }) => ({ href, title })),
  }),
);

/** the sticky navigation column on the left of every page */
export const Rail = () => (
  <nav className="rail" aria-label="Documentation">
    <RailNav sections={railSections} />
  </nav>
);
