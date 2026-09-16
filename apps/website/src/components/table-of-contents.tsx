import { Typography } from "@tenstorrent/vesper/typography";

import type { TOCItem } from "@/lib/filesystem/docs/types";
import { cn } from "@/lib/tailwind/cn";

export default async function TableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <aside
      className={cn(
        "sticky top-(--nav-scroll-margin)",
        "gap-vesper-1 hidden flex-col lg:flex",
        "pl-vesper-4 w-[14rem] shrink-0",
      )}
    >
      <Typography variant="label-lg-bold" className="mb-vesper-4">
        On this page
      </Typography>
      {items.map((item) => (
        <Typography
          key={item.id}
          as="a"
          variant="copy-xs"
          href={`#${item.id}`}
          className="text-vesper-text-tertiary hover:underline"
          style={{
            marginLeft: `calc(var(--vesper-spacing-3) * ${item.depth - 1})`,
          }}
        >
          {item.text}
        </Typography>
      ))}
    </aside>
  );
}
