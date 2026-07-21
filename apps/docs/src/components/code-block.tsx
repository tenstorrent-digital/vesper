"use client";

import { use } from "react";

import {
  CodeBlock as VesperCodeBlock,
  type CodeBlockProps,
  setupCodeBlock,
} from "@repo/vesper/code-block";

/**
 * Thin wrapper around the Vesper `CodeBlock` that handles initialization.
 *
 * `setupCodeBlock` is a client function and cannot be called directly from
 * Server Components (e.g. in `mdx-components.tsx`). Instead we call it once at
 * module scope inside this `"use client"` module and use `use()` to suspend
 * until the highlighter is ready.
 *
 * @example
 * ```tsx
 * // In a Server Component or MDX component mapping:
 * import { CodeBlock } from "@/components/code-block";
 *
 * <CodeBlock lang="javascript">
 *   const x = 1;
 * </CodeBlock>
 * ```
 */

// Called once at module scope — the promise is cached across renders.
const setup = setupCodeBlock({
  langs: [import("@shikijs/langs/javascript"), import("@shikijs/langs/bash")],
});

export const CodeBlock = (props: CodeBlockProps) => {
  use(setup);
  return <VesperCodeBlock {...props} />;
};
