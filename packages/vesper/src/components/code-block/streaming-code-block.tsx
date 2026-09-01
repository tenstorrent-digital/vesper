"use client";

import {
  type UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getTokenStyleObject, type ThemedToken } from "@shikijs/core";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generateId";

import type { CodeBlockProps } from "./code-block";
import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { codeToTokenStream, handleLanguageRegistration } from "./utils";

export function StreamingCodeBlock({
  className,
  children: code,
  lang = "text",
  copyOnHover = false,
  showLineNumbers,
  scrollThumbVisibility,
  ...props
}: Omit<CodeBlockProps, "children"> & {
  children: () => ReadableStream<string> | Promise<ReadableStream<string>>;
}) {
  handleLanguageRegistration(lang);

  const shouldAutoScroll = useRef(true);
  const viewport = useRef<HTMLDivElement>(null);

  const handleTokensChanged = useCallback(() => {
    if (!shouldAutoScroll.current || !viewport.current) return;
    viewport.current.scrollTop = viewport.current.scrollHeight;
  }, []);

  const handleScroll = useCallback<UIEventHandler<HTMLDivElement>>((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    shouldAutoScroll.current = distanceFromBottom < 10;
  }, []);

  return (
    <div
      className={cn("vesper-code-block", className)}
      data-copy-on-hover={copyOnHover}
      {...props}
    >
      <CodeBlockPreWrapper
        viewportRef={viewport}
        thumbVisibility={scrollThumbVisibility}
        onScroll={handleScroll}
        data-line-numbers={showLineNumbers}
      >
        <TokenStreamRenderer
          code={code}
          lang={lang}
          onTokensChanged={handleTokensChanged}
        />
      </CodeBlockPreWrapper>
      <CopyToClipboardButton />
    </div>
  );
}

/**
 * This component is a re-implementation of the `ShikiStreamRenderer` component from the shiki repo:
 *
 * https://github.com/shikijs/shiki/blob/main/packages/stream/src/react/renderer.ts
 *
 * The main difference between shiki's implementation and our implementation is we use an `AbortController` to abort the `WriteableStream` when the code/lang props change. This allows consumers to swap streamed code props on-demand without previously-supplied streams interfering with the rendered output of the new token streams.
 * */
function TokenStreamRenderer({
  code,
  lang,
  onTokensChanged,
}: {
  code: () => ReadableStream<string> | Promise<ReadableStream<string>>;
  lang: CodeBlockProps["lang"];
  onTokensChanged(): void;
}) {
  // WeakMap for storing references to ThemedToken keys
  // Because WeakMaps garbage collect their own references, we don't have to worry about memory leaks when the tokens array is reset or changes
  const keys = useRef(new WeakMap<ThemedToken, string>());

  // Gets the associated key in the above WeakMap for a ThemedToken
  const getKey = useCallback((token: ThemedToken) => {
    let key = keys.current.get(token);
    if (!keys.current.has(token)) {
      key = generateId();
      keys.current.set(token, key);
    }
    return key;
  }, []);

  const [tokens, setTokens] = useState<ThemedToken[]>([]);

  useEffect(() => {
    setTokens((prevTokens) => (prevTokens.length ? [] : prevTokens));

    const controller = new AbortController();

    Promise.resolve()
      .then(code)
      .then((stream) => {
        if (controller.signal.aborted) {
          stream.cancel();
          return;
        }

        stream
          .pipeThrough(codeToTokenStream(lang))
          .pipeTo(
            new WritableStream({
              write(token) {
                if ("recall" in token) {
                  setTokens((t) => t.slice(0, -token.recall));
                } else {
                  setTokens((tokens) => [...tokens, token]);
                }
              },
            }),
            { signal: controller.signal },
          )
          .catch(() => {});
      })
      .catch(() => {});

    return () => controller.abort();
  }, [code, lang]);

  // eslint-disable-next-line
  useEffect(() => onTokensChanged(), [tokens]);

  return (
    <pre className="shiki vesper shiki-stream">
      <code>
        {tokensToLines(tokens).map((line, index) => (
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
