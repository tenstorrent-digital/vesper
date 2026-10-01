"use client";

import { getTokenStyleObject, type ThemedToken } from "@shikijs/core";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generate-id";

import type { CodeBlockProps } from "./code-block";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { codeToTokenStream, handleLanguageRegistration } from "./utils";

export function StreamingCodeBlock({
  className,
  children: code,
  lang = "text",
  copyOnHover = false,
  showLineNumbers,
  ...props
}: Omit<CodeBlockProps, "children"> & {
  children: () => ReadableStream<string> | Promise<ReadableStream<string>>;
}) {
  handleLanguageRegistration(lang);

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

  // remount the renderer (resetting its tokens) whenever a new stream is supplied
  const streamKey = `${getKey(code)}-${typeof lang === "string" ? lang : getKey(lang)}`;

  return (
    <div
      className={cn("vesper-code-block", className)}
      data-copy-on-hover={copyOnHover}
      {...props}
    >
      <CodeBlockPreWrapper ref={ref} data-line-numbers={showLineNumbers}>
        <TokenStreamRenderer key={streamKey} code={code} lang={lang} />
      </CodeBlockPreWrapper>
      <CopyToClipboardButton />
    </div>
  );
}

/**
 * This component is a rewrite of the `ShikiStreamRenderer` component from the shiki repo:
 *
 * https://github.com/shikijs/shiki/blob/main/packages/stream/src/react/renderer.ts
 *
 * The main difference between shiki's version and ours is that we use an `AbortController` to abort the `WriteableStream` when the code/lang props change. This allows consumers to swap streamed code props on-demand without previously-supplied streams interfering with the rendered output of the new token streams.
 * */
function TokenStreamRenderer({
  code,
  lang,
}: {
  code: () => ReadableStream<string> | Promise<ReadableStream<string>>;
  lang: CodeBlockProps["lang"];
}) {
  const [tokens, setTokens] = useState<ThemedToken[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    Promise.resolve()
      .then(code)
      .then((stream) => {
        if (controller.signal.aborted) {
          stream.cancel().catch(() => {});
          return;
        }

        stream
          .pipeThrough(codeToTokenStream(lang))
          .pipeTo(
            new WritableStream({
              write(token) {
                if ("recall" in token)
                  setTokens((t) => t.slice(0, -token.recall));
                else setTokens((tokens) => [...tokens, token]);
              },
            }),
            { signal: controller.signal },
          )
          .catch(() => {});
      })
      .catch(() => {});

    return () => controller.abort();
  }, [code, lang]);

  return (
    <pre className="shiki vesper shiki-stream">
      <code>
        {tokensToLines(tokens).map((line, index) => (
          // lines have no identity other than their position
          // oxlint-disable-next-line react/no-array-index-key
          <span key={index} className="line">
            {line.map((token) => (
              <span
                key={getKey(token)}
                style={token.htmlStyle || getTokenStyleObject(token)}
              >
                {token.content}
              </span>
            ))}
          </span>
        ))}
      </code>
    </pre>
  );
}

// weakly map objects (tokens, stream factories and languages) to their keys, so keys are
// garbage collected along with the objects they identify
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

const tokensToLines = (tokens: ThemedToken[]) =>
  tokens.reduce(
    (lines, token) => {
      if (token.content === "\n") {
        lines.push([]);
        return lines;
      }
      lines[lines.length - 1]!.push(token);
      return lines;
    },
    [[]] as ThemedToken[][],
  );
