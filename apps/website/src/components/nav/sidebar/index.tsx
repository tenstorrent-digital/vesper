import { getDocTree } from "@/lib/filesystem/docs";

import { Tree } from "./tree";

/**
 * every document in `docs/`, grouped by folder
 *
 * read from the doc index rather than from the route folders, so adding a
 * document to `docs/` is all it takes to get a sidebar entry
 */
const groups = getDocTree().map(({ folder, docs }) => ({
  folder,
  pages: docs.map(({ href, frontmatter }) => ({
    href,
    title: frontmatter.title,
  })),
}));

export const Sidebar = ({ className }: { className?: string }) => {
  return (
    <nav id="sidebar" aria-label="Sidebar" className={className}>
      {groups.map(({ folder, pages }) => (
        <Tree key={folder ?? "root"} folder={folder} pages={pages} />
      ))}
    </nav>
  );
};
