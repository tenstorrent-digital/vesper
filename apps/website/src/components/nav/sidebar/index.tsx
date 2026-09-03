import { Typography } from "@tenstorrent/vesper/typography";

import { getDocTree } from "@/lib/filesystem/docs";
import { cn } from "@/lib/tailwind/cn";

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
    <nav
      id="sidebar"
      aria-label="Sidebar"
      className={cn(
        "order-3 w-full min-w-fit md:order-none md:col-start-1 md:row-start-2 md:w-48",
        className,
      )}
    >
      <div className="flex w-full min-w-fit flex-col gap-4 border-t border-vesper-alpha-black-50 px-4 py-8 md:border-t-0 md:p-4">
        {groups.map(({ folder, pages }) => (
          <Tree key={folder ?? "root"} folder={folder} pages={pages} />
        ))}
        <Typography
          className="md:hidden"
          as="a"
          href="#"
          variant="heading-xs"
        >
          Back to Top ↑
        </Typography>
      </div>
    </nav>
  );
};
