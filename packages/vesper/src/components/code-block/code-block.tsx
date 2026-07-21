"use client";

import {
  type ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as jsxRuntime from "react/jsx-runtime";
import {
  createHighlighterCoreSync,
  getTokenStyleObject,
  type LanguageRegistration,
  type ShikiTransformer,
  type ThemedToken,
} from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { CodeToTokenTransformStream } from "@shikijs/stream";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";

import { IconButton } from "@/components/icon-button/icon-button";
import { Copy } from "@/components/icons/icons";
import { Typography } from "@/components/typography/typography";

import { cn } from "@/utils/cn";
import { generateId } from "@/utils/generateId";

import { theme } from "./theme";

export interface CodeBlockProps extends Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML" | "lang"
> {
  /**
   * The language syntax of the supplied code. The language must correspond to one of the languages registered when calling `setupCodeBlock`. Omitting this prop will render supplied code as plain text with no syntax highlighting.
   *
   * @example
   * <CodeBlock lang="javascript">
   *   const count = 0
   * </CodeBlock>
   * */
  lang?: LanguageRegistration[] | "text" | "ansi";
  /**
   * The code to render. Can be a `string`, or a `ReadableStream<string>` if you wish to stream something like build logs, output from an LLM, etc.
   *
   * @example
   * <CodeBlock>
   *   const count = 0
   * </CodeBlock>
   */
  children?: string | ReadableStream<string>;
  /**
   * Whether or not to show line numbers on the left-hand side of the code block. Note that if you are streaming code, line numbers will not appear.
   *
   * @example
   * <CodeBlock showLineNumbers>
   *   const count = 0
   * </CodeBlock>
   */
  showLineNumbers?: boolean;
  /**
   * An array of transformers to apply and manipulate the hast tree. For information on Shiki transformers, see [the shiki transformers guide](https://shiki.style/guide/transformers).
   *
   * Transforms will not apply to streamed code.
   *
   * @example
   * import { transformerNotationDiff } from '@shikijs/transformers'
   *
   * <CodeBlock transformers={[transformerNotationDiff()]}>
   *   const count = 0
   * </CodeBlock>
   */
  transformers?: ShikiTransformer[];
}

const highlighter = createHighlighterCoreSync({
  langs: [],
  engine: createJavaScriptRegexEngine({ forgiving: true }),
  themes: [theme],
});

function handleLanguageRegistration(lang: CodeBlockProps["lang"]) {
  if (!lang || typeof lang === "string") return;

  const langName = getLangName(lang);
  if (langName && !highlighter.getLoadedLanguages().includes(langName)) {
    highlighter.loadLanguageSync(lang);
  }
}

export function CodeBlock({
  className,
  children: code = "",
  lang = "text",
  showLineNumbers = false,
  transformers,
  ...props
}: CodeBlockProps) {
  handleLanguageRegistration(lang);

  const ref = useRef<HTMLDivElement>(null);

  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    if (typeof code === "string" || !ref.current) return;

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
      <Typography
        as="div"
        data-line-numbers={showLineNumbers}
        variant="copy-xs-mono"
        className="vesper-code-block-pre-wrapper"
        ref={ref}
      >
        {typeof code === "string" ? (
          toJsxRuntime(
            highlighter.codeToHast(code, {
              lang: getLangName(lang),
              theme: "vesper",
              transformers,
              tabindex: false,
            }),
            jsxRuntime,
          )
        ) : (
          <TokenStreamRenderer code={code} lang={getLangName(lang)} />
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
          navigator.clipboard?.writeText(content).catch(() => {});
        }}
      />
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
  lang: string;
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
      .pipeThrough(
        new CodeToTokenTransformStream({
          highlighter,
          lang,
          theme: "vesper",
          allowRecalls: true,
        }),
      )
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

const getLangName = (lang: LanguageRegistration[] | "text" | "ansi") =>
  typeof lang === "string" ? lang : lang[0]?.name || "text";
