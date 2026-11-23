"use client";

import type { ThemedToken } from "@pierre/highlights";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generate-id";

import type { CodeBlockProps } from "./code-block";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { HighlightedCode } from "./highlighted-code";
import {
  createLineHighlighter,
  type LineHighlighter,
  type LinesUpdate,
} from "./utils";

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
 * Highlights code as it streams in, including the line that's still streaming in
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
  const [lines, setLines] = useState<ThemedToken[][]>([[]]);

  useEffect(() => {
    const controller = new AbortController();
    let highlighter: LineHighlighter | undefined;

    // replace the lines that changed, keeping earlier lines as they are so
    // that they aren't re-rendered
    const updateLines = (update: LinesUpdate) =>
      setLines((lines) => [...lines.slice(0, update.start), ...update.lines]);

    Promise.resolve()
      .then(code)
      .then((stream) => {
        if (controller.signal.aborted) {
          stream.cancel().catch(() => {});
          return undefined;
        }

        // only created once there's a stream to highlight
        const streamHighlighter = createLineHighlighter(lang);
        highlighter = streamHighlighter;

        return stream.pipeTo(
          new WritableStream({
            write: (chunk) => updateLines(streamHighlighter.push(chunk)),
            close: () => updateLines(streamHighlighter.end()),
          }),
          { signal: controller.signal },
        );
      })
      .catch(() => {})
      // free the highlighter whether the stream closed, failed, or was aborted
      .finally(() => highlighter?.dispose());

    return () => {
      controller.abort();
      highlighter?.dispose();
    };
  }, [code, lang]);

  return <HighlightedCode lines={lines} />;
}

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
