import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock, setupCodeBlock } from "@/components/code-block/code-block";
import {
  createTextStream,
  SAMPLE_CODE_ANSI,
  SAMPLE_CODE_BASH,
  SAMPLE_CODE_CSS,
  SAMPLE_CODE_JSON,
  SAMPLE_CODE_MARKDOWN,
  SAMPLE_CODE_TYPESCRIPT,
} from "./fixtures";

await setupCodeBlock({
  langs: [
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/css"),
    import("@shikijs/langs/json"),
    import("@shikijs/langs/markdown"),
    import("@shikijs/langs/shellscript"),
  ],
});

function CodeBlockStoryComponent({
  lang,
  showLineNumbers,
  stream,
}: {
  showLineNumbers: boolean;
  lang: "typescript" | "css" | "json" | "markdown" | "ansi" | "bash";
  stream: boolean;
}) {
  let code: string | ReadableStream<string> = SAMPLE_CODE_TYPESCRIPT;
  switch (lang) {
    case "ansi":
      code = SAMPLE_CODE_ANSI;
      break;
    case "css":
      code = SAMPLE_CODE_CSS;
      break;
    case "json":
      code = SAMPLE_CODE_JSON;
      break;
    case "markdown":
      code = SAMPLE_CODE_MARKDOWN;
      break;
    case "typescript":
      code = SAMPLE_CODE_TYPESCRIPT;
      break;
    case "bash":
      code = SAMPLE_CODE_BASH;
      break;
    default:
      break;
  }

  if (stream) {
    code = createTextStream(code);
  }

  return (
    <CodeBlock
      showLineNumbers={showLineNumbers}
      lang={lang}
      code={code}
      style={{
        width: "min(calc(100vw - 4rem), 720px)",
        maxHeight: "calc(100vh - 4rem)",
      }}
    />
  );
}

const meta = {
  component: CodeBlockStoryComponent,
  argTypes: {
    lang: {
      control: "radio",
      options: ["typescript", "css", "json", "markdown", "ansi", "bash"],
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
    lang: "typescript",
    showLineNumbers: false,
    stream: false,
  },
};
Playground.storyName = "code-block";

export default meta;
