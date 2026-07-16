import { useEffect, useRef, useState, type ComponentProps } from "react";
import { type ShikiTransformer } from "@shikijs/core";
import { ShikiStreamRenderer } from "@shikijs/stream/react";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";
import { store } from "./store";

export const { setupCodeBlock } = store;

export interface CodeBlockProps extends Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML"
> {
  lang?: string;
  code?: string | ReadableStream<string>;
  showLineNumbers?: boolean;
  transformers?: ShikiTransformer[];
}

export function CodeBlock({
  className,
  code = "",
  lang = "text",
  showLineNumbers = false,
  transformers,
  ...props
}: CodeBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={cn("vesper-code-block", className)} {...props}>
      <Typography
        as="div"
        data-line-numbers={showLineNumbers}
        variant="copy-xs-mono"
        className="vesper-code-block-pre-wrapper"
        ref={ref}
      >
        {typeof code === "string" ? (
          store.codeToJsx({ code, lang, transformers })
        ) : (
          <StreamedCode code={code} lang={lang} />
        )}
      </Typography>
      <IconButton
        variant="tertiary"
        icon={<Copy />}
        aria-label="Copy code"
        size="sm"
        type="button"
        onClick={() => {
          /**
           * If a consumer supplies transformers to a code block instance, the passed in code string may contain hidden comments that tell the highlighter to output modified hast nodes. In such cases we want to copy the rendered text content because it will omit those hidden comments.
           */
          const content = ref.current?.textContent || "";
          navigator.clipboard.writeText(content);
        }}
      />
    </div>
  );
}

function StreamedCode({
  code,
  lang,
}: {
  lang: string;
  code: ReadableStream<string>;
}) {
  const stream = useRef(store.codeToStream({ code, lang }));
  const [key, setKey] = useState(0);
  useEffect(() => {
    stream.current = store.codeToStream({ code, lang });
    setKey((k) => k + 1);
  }, [code, lang]);

  return <ShikiStreamRenderer key={key} stream={stream.current} />;
}
