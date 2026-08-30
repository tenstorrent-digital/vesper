"use client";

import { ScrollArea } from "@tenstorrent/vesper/scroll-area";

interface ScrollAreaDemoProps {
  kind: "intro-example" | "basic-usage" | "thumb-variants" | "thumb-visibility";
}

export function ScrollAreaDemo(props: ScrollAreaDemoProps) {
  if (props.kind === "intro-example") {
    return (
      <ScrollArea
        style={{
          maxWidth: "24rem",
          height: "16rem",
        }}
      >
        <Grid cols={20} rows={10} />
      </ScrollArea>
    );
  }

  if (props.kind === "basic-usage") {
    return (
      <ScrollArea style={{ maxWidth: "24rem", height: "10rem" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
        <br />
        <br />
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        <br />
        <br />
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </ScrollArea>
    );
  }

  if (props.kind === "thumb-variants") {
    return (
      <ScrollArea
        thumbVariant="inverse"
        style={{
          maxWidth: "24rem",
          height: "10rem",
          background: "var(--vesper-stone-300)",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
        <br />
        <br />
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        <br />
        <br />
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </ScrollArea>
    );
  }

  if (props.kind === "thumb-visibility") {
    return (
      <ScrollArea
        thumbVariant="inverse"
        thumbVisibility="on-interaction"
        style={{
          maxWidth: "24rem",
          height: "10rem",
          background: "var(--vesper-stone-300)",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
        <br />
        <br />
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        <br />
        <br />
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </ScrollArea>
    );
  }

  return null;
}

function Grid({ rows, cols }: { rows: number; cols: number }) {
  return (
    <div className="gap-vesper-2 flex flex-col">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="gap-vesper-2 h-vesper-12 flex shrink-0">
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className="w-vesper-12 h-vesper-12 border-vesper-border-primary shrink-0 border"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
