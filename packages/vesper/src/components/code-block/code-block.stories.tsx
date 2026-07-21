import css from "@shikijs/langs/css";
import json from "@shikijs/langs/json";
import markdown from "@shikijs/langs/markdown";
import python from "@shikijs/langs/python";
import shellscript from "@shikijs/langs/shellscript";
import typescript from "@shikijs/langs/typescript";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock as CodeBlock } from "@/components/code-block/code-block";

import {
  createTextStream,
  SAMPLE_CODE_ANSI,
  SAMPLE_CODE_BASH,
  SAMPLE_CODE_CSS,
  SAMPLE_CODE_JSON,
  SAMPLE_CODE_MARKDOWN,
  SAMPLE_CODE_PYTHON,
  SAMPLE_CODE_TYPESCRIPT,
} from "./fixtures";

function CodeBlockStoryComponent({
  lang,
  showLineNumbers,
  stream,
}: {
  showLineNumbers: boolean;
  lang: "python" | "bash" | "ansi" | "json" | "markdown" | "typescript" | "css";
  stream: boolean;
}) {
  switch (lang) {
    case "ansi":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang="ansi"
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream ? createTextStream(SAMPLE_CODE_ANSI) : SAMPLE_CODE_ANSI}
        </CodeBlock>
      );
    case "css":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang={css}
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream ? createTextStream(SAMPLE_CODE_CSS) : SAMPLE_CODE_CSS}
        </CodeBlock>
      );
    case "json":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang={json}
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream ? createTextStream(SAMPLE_CODE_JSON) : SAMPLE_CODE_JSON}
        </CodeBlock>
      );
    case "markdown":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang={markdown}
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream
            ? createTextStream(SAMPLE_CODE_MARKDOWN)
            : SAMPLE_CODE_MARKDOWN}
        </CodeBlock>
      );
    case "typescript":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang={typescript}
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream
            ? createTextStream(SAMPLE_CODE_TYPESCRIPT)
            : SAMPLE_CODE_TYPESCRIPT}
        </CodeBlock>
      );
    case "bash":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang={shellscript}
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream ? createTextStream(SAMPLE_CODE_BASH) : SAMPLE_CODE_BASH}
        </CodeBlock>
      );
    case "python":
      return (
        <CodeBlock
          showLineNumbers={showLineNumbers}
          lang={python}
          style={{
            width: "min(calc(100vw - 4rem), 720px)",
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          {stream ? createTextStream(SAMPLE_CODE_PYTHON) : SAMPLE_CODE_PYTHON}
        </CodeBlock>
      );
    default:
      return null;
  }
}

const meta = {
  component: CodeBlockStoryComponent,
  argTypes: {
    lang: {
      control: "radio",
      options: [
        "python",
        "bash",
        "ansi",
        "json",
        "markdown",
        "typescript",
        "css",
      ],
    },
    stream: {
      description:
        "Not a `CodeBlock` component prop; this control is used to easily toggle on/off text streaming the storybook preview UI.",
    },
  },
} satisfies Meta<typeof CodeBlockStoryComponent>;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    lang: "python",
    showLineNumbers: false,
    stream: false,
  },
};
Playground.storyName = "code-block";

export default meta;
