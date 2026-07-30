import { getDocsInFolder } from "@/lib/filesystem/docs";

import { Tree } from "./tree";

/**
 * get documents from `docs/components/`
 */
const componentPages = getDocsInFolder("components").map(
  ({ href, frontmatter }) => ({
    href,
    title: frontmatter.title,
  }),
);

export const Sidebar = ({ className }: { className?: string }) => {
  return (
    <nav id="sidebar" aria-label="Sidebar" className={className}>
      <Tree pages={componentPages} />
    </nav>
  );
};
