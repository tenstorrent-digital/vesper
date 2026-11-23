"use client";

import type { ThemedToken } from "@pierre/highlights";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generate-id";

import type { CodeBlockProps } from "./code-block";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { HighlightedCode } from "./highlighted-code";
import { codeToLines, createLineTokenizer } from "./utils";

export function StreamingCodeBlock({
  className,
  children: code,
  lang = "text",
  showLineNumbers,
  ...props
}: Omit<CodeBlockProps, "children"> & {
  children: () => ReadableStream<string> | Promise<ReadableStream<string>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    if (!ref.current) return undefined;

    const observer = new MutationObserver(() => {
      if (!ref.current || !shouldAutoScroll.current) return;
      ref.current.scrollTop = ref.current.scrollHeight;
    });

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      shouldAutoScroll.current = distanceFromBottom < 10;
    };

    const el = ref.current;
    el.addEventListener("scroll", handleScroll);
    observer.observe(el, { childList: true, subtree: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // remount the renderer (resetting its lines) whenever a new stream or language is supplied
  const streamKey = `${getKey(code)}-${lang}`;

  return (
    <div className={cn("vesper-code-block", className)} {...props}>
      <CodeBlockPreWrapper ref={ref} data-line-numbers={showLineNumbers}>
        <HighlightedCodeStream key={streamKey} code={code} lang={lang} />
      </CodeBlockPreWrapper>
      <CopyToClipboardButton />
    </div>
  );
}

/**
 * Highlights code as it streams in
 *
 * Complete lines are highlighted by a tokenizer that keeps track of syntax state across lines (eg. unclosed comments or strings). The line that's still streaming in is highlighted on its own, and is replaced by the tokenizer's output once it's complete.
 *
 * An `AbortController` aborts the stream when the code/lang props change (which remounts this component), so previously-supplied streams can't interfere with the rendered output of new ones.
 */
function HighlightedCodeStream({
  code,
  lang,
}: {
  code: () => ReadableStream<string> | Promise<ReadableStream<string>>;
  lang: CodeBlockProps["lang"];
}) {
  const [lines, setLines] = useState<ThemedToken[][]>([]);
  // the line that's still streaming in, or `null` once the stream has closed
  const [pendingLine, setPendingLine] = useState<ThemedToken[] | null>([]);

  useEffect(() => {
    const controller = new AbortController();
    const tokenizer = createLineTokenizer(lang);
    let pendingText = "";

    Promise.resolve()
      .then(code)
      .then((stream) => {
        if (controller.signal.aborted) {
          stream.cancel().catch(() => {});
          return;
        }

        stream
          .pipeTo(
            new WritableStream({
              write(chunk) {
                const completeLines = tokenizer.pushCode(chunk);
                if (completeLines.length > 0) {
                  setLines((lines) => [...lines, ...completeLines]);
                }

                pendingText = getLastLine(pendingText + chunk);
                setPendingLine(codeToLines(pendingText, lang).flat());
              },
              close() {
                const remainingLines = tokenizer.end();
                setLines((lines) => [...lines, ...remainingLines]);
                setPendingLine(null);
              },
            }),
            { signal: controller.signal },
          )
          .catch(() => {});
      })
      .catch(() => {});

    return () => {
      controller.abort();
      tokenizer.dispose();
    };
  }, [code, lang]);

  return (
    <HighlightedCode lines={pendingLine ? [...lines, pendingLine] : lines} />
  );
}

// get the text after the last line break
const getLastLine = (text: string) => text.slice(text.lastIndexOf("\n") + 1);

// weakly map stream factories to their keys, so keys are garbage collected
// along with the factories they identify
const keys = new WeakMap<object, string>();

// get (or create) the key associated with an object
const getKey = (value: object) => {
  let key = keys.get(value);
  if (key === undefined) {
    key = generateId();
    keys.set(value, key);
  }
  return key;
};
