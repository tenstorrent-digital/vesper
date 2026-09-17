import { Typography } from "@tenstorrent/vesper/typography";

import type { TOCItem } from "@/lib/filesystem/docs/types";

export default async function TableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <aside className="gap-vesper-micro pl-vesper-4 sticky top-(--nav-scroll-margin) hidden w-[14rem] shrink-0 flex-col lg:flex">
      <Typography
        variant="label-xs-mono"
        className="p-vesper-2 not:first:mt-vesper-4 text-vesper-text-tertiary uppercase"
      >
        On this page
      </Typography>
      {items.map((item) => (
        <Typography
          key={item.id}
          className="p-vesper-2 rounded-vesper-2 hover:bg-vesper-background-tertiary data-active:bg-vesper-background-tertiary"
          as="a"
          href={`#${item.id}`}
          variant="label-md-bold"
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
