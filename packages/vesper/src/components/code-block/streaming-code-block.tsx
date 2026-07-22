"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTokenStyleObject, type ThemedToken } from "@shikijs/core";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generateId";

import { CodeBlockPreWrapper, CopyToClipboardButton } from "./components";
import { CodeBlockProps } from "./types";
import { codeToTokenStream, handleLanguageRegistration } from "./utils";

export function StreamingCodeBlock({
  className,
  children: code,
  lang = "text",
  ...props
}: Omit<CodeBlockProps, "children" | "showLineNumbers" | "transformers"> & {
  children: ReadableStream<string>;
}) {
  handleLanguageRegistration(lang);

  const ref = useRef<HTMLDivElement>(null);

  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    if (!ref.current) return;

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
  }, [code]);

  return (
    <div className={cn("vesper-code-block", className)} {...props}>
      <CodeBlockPreWrapper ref={ref} data-line-numbers>
        <TokenStreamRenderer code={code} lang={lang} />
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
}: {
  code: ReadableStream<string>;
  lang: CodeBlockProps["lang"];
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

    code
      .pipeThrough(codeToTokenStream(lang))
      .pipeTo(
        new WritableStream({
          write(token) {
            if ("recall" in token) setTokens((t) => t.slice(0, -token.recall));
            else setTokens((tokens) => [...tokens, token]);
          },
        }),
        { signal: controller.signal },
      )
      .catch(() => {});

    return () => controller.abort();
  }, [code, lang]);

  return (
    <pre className="shiki vesper shiki-stream">
      <code>
        {tokens.map((token) => (
          <span
            key={getKey(token)}
            style={token.htmlStyle || getTokenStyleObject(token)}
          >
            {token.content}
          </span>
        ))}
      </code>
    </pre>
  );
}
