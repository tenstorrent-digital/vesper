import { Typography } from "@tenstorrent/vesper/typography";

import type { TOCItem } from "@/lib/filesystem/docs/types";

export default async function TableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <aside className="gap-vesper-1 pl-vesper-4 sticky top-(--nav-scroll-margin) hidden w-[14rem] shrink-0 flex-col lg:flex">
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
