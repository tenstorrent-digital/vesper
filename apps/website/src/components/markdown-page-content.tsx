import { ReactNode } from "react";

import { ToCItem } from "@/lib/filesystem/docs/types";

import { ToC } from "./toc";

export function MarkdownPageContent({
  toc,
  children,
}: {
  toc: ToCItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between">
      <main className="prose min-w-0">{children}</main>
      <ToC toc={toc} />
    </div>
  );
}
