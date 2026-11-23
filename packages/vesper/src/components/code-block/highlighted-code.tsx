import type { ThemedToken } from "@pierre/highlights";

import { Fragment, memo } from "react";

import { getTokenStyle } from "./utils";

/** Renders lines of syntax-highlighted tokens */
export function HighlightedCode({ lines }: { lines: ThemedToken[][] }) {
  return (
    <pre className="vesper-code-block-pre">
      <code>
        {lines.map((tokens, index) => (
          // lines have no identity other than their position
          // oxlint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            {/* line breaks are not rendered, but they keep them in copied text */}
            {index > 0 && "\n"}
            <HighlightedLine tokens={tokens} />
          </Fragment>
        ))}
      </code>
    </pre>
  );
}

// memoized so that lines which have finished streaming aren't re-rendered as more lines stream in
const HighlightedLine = memo(function HighlightedLine({
  tokens,
}: {
  tokens: ThemedToken[];
}) {
  return (
    <span className="vesper-code-block-line">
      {tokens.map((token) => (
        // a token's offset is unique within its line
        <span key={token.offset} style={getTokenStyle(token)}>
          {token.content}
        </span>
      ))}
    </span>
  );
});
