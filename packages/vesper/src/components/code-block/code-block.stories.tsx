import css from "@shikijs/langs/css";
import json from "@shikijs/langs/json";
import markdown from "@shikijs/langs/markdown";
import python from "@shikijs/langs/python";
import shellscript from "@shikijs/langs/shellscript";
import typescript from "@shikijs/langs/typescript";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock, CodeBlockProps } from "@/components/code-block/code-block";

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
import {
  SCROLL_THUMB_VISIBILITIES,
  ScrollThumbVisibility,
} from "../scroll-area/scroll-area";

const STORY_LANG_OPTIONS = [
  "python",
  "bash",
  "ansi",
  "json",
  "markdown",
  "typescript",
  "css",
] as const;

type StoryLang = (typeof STORY_LANG_OPTIONS)[number];

const PARAMS: {
  [K in StoryLang]: { code: string; lang: CodeBlockProps["lang"] };
} = {
  ansi: {
    code: SAMPLE_CODE_ANSI,
    lang: "ansi",
  },
  bash: {
    code: SAMPLE_CODE_BASH,
    lang: shellscript,
  },
  css: {
    code: SAMPLE_CODE_CSS,
    lang: css,
  },
  json: {
    code: SAMPLE_CODE_JSON,
    lang: json,
  },
  markdown: {
    code: SAMPLE_CODE_MARKDOWN,
    lang: markdown,
  },
  python: {
    code: SAMPLE_CODE_PYTHON,
    lang: python,
  },
  typescript: {
    code: SAMPLE_CODE_TYPESCRIPT,
    lang: typescript,
  },
};

function CodeBlockStoryComponent({
  lang,
  showLineNumbers,
  stream,
  copyOnHover,
  scrollThumbVisibility,
}: {
  showLineNumbers: boolean;
  lang: StoryLang;
  stream: boolean;
  copyOnHover: boolean;
  scrollThumbVisibility: ScrollThumbVisibility;
}) {
  const params = PARAMS[lang];

  return (
    <CodeBlock
      showLineNumbers={showLineNumbers}
      lang={params.lang}
      copyOnHover={copyOnHover}
      scrollThumbVisibility={scrollThumbVisibility}
      style={{
        width: "min(calc(100vw - 4rem), 720px)",
        maxHeight: "calc(100vh - 4rem)",
      }}
    >
      {stream ? () => createTextStream(params.code) : params.code}
    </CodeBlock>
  );
}

const meta = {
  component: CodeBlockStoryComponent,
  argTypes: {
    lang: {
      control: "radio",
      options: STORY_LANG_OPTIONS,
    },
    stream: {
      description:
        "Not a `CodeBlock` component prop; this control is used to easily toggle on/off text streaming the storybook preview UI.",
    },
    copyOnHover: {
      control: "boolean",
      description:
        "Whether only show the copy to clipboard button when `CodeBlock` is hovered.",
    },
    scrollThumbVisibility: {
      control: "radio",
      options: SCROLL_THUMB_VISIBILITIES,
      description:
        "Determines when to show the scroll thumbs when the `CodeBlock` has overflow",
    },
  },
} satisfies Meta<typeof CodeBlockStoryComponent>;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    lang: "python",
    showLineNumbers: false,
    stream: false,
    copyOnHover: false,
    scrollThumbVisibility: "always",
  },
};
Playground.storyName = "code-block";

export default meta;
