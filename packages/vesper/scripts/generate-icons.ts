import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { optimize } from "svgo";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { getGeneratedCodeWarning } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTO_GENERATED_WARNING = getGeneratedCodeWarning("yarn generate:icons");

// transform an svg file name into its kind, ie. user-multiple.svg -> user-multiple
const getIconKind = (fileName: string) => fileName.slice(0, -4);

// transform an svg kind into its component name, ie. model-openai -> ModelOpenAI
const getIconComponentName = (iconKind: string) => {
  return iconKind
    .split("-")
    .map((part) => {
      if (part === "ai") return "AI";
      if (part === "fe") return "FE";
      if (part === "tt") return "TT";
      if (part === "llk") return "LLK";
      if (part === "xla") return "XLA";
      if (part === "nn") return "NN";
      if (part === "quietbox") return "QuietBox";
      if (part === "loudbox") return "LoudBox";
      if (part === "youtube") return "YouTube";
      if (part === "github") return "GitHub";
      if (part === "deepseek") return "DeepSeek";
      if (part === "openai") return "OpenAI";
      if (part === "linkedin") return "LinkedIn";

      return part.charAt(0).toUpperCase().concat(part.slice(1));
    })
    .join("");
};

const iconFiles = fs
  .readdirSync(path.resolve(__dirname, "../assets/icons"))
  .filter((file) => file.endsWith(".svg"));

if (iconFiles.length === 0) {
  throw new Error("No SVG files found in assets/icons directory");
}

const icons = iconFiles.map((fileName) => {
  // get the icon svg as utf-8
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../assets/icons", fileName),
    "utf-8",
  );

  const kind = getIconKind(fileName);
  const componentName = getIconComponentName(kind);

  // prefix ids using the icon id to prevent collisions between elements inside other svgs
  const { data } = optimize(raw, {
    plugins: [{ name: "prefixIds", params: { prefix: kind } }],
  });

  // convert the optimized icon svg to a tree
  const tree = unified().use(rehypeParse, { fragment: true }).parse(data);

  // traverse and patch the tree
  visit(tree, "element", (node, _, parent) => {
    // convert the root <svg> element into a <symbol> element and remove extraneous properties
    if (node.tagName === "svg" && parent?.type === "root") {
      delete node.properties.width;
      delete node.properties.height;
      delete node.properties.fill;
      return;
    }

    const shouldPatchValue = (value: unknown) =>
      typeof value === "string" &&
      value !== "none" &&
      value !== "currentColor" &&
      !value.startsWith("url(");

    // patch non-colored icons so their fills and strokes use currentColor
    if (!kind.endsWith("-color")) {
      if ("fill" in node.properties && shouldPatchValue(node.properties.fill)) {
        node.properties.fill = "currentColor";
      }
      if (
        "stroke" in node.properties &&
        shouldPatchValue(node.properties.stroke)
      ) {
        node.properties.stroke = "currentColor";
      }
    }
  });

  // serialize tree into a string again now that it's been optimized and patched
  const markdown = unified().use(rehypeStringify).stringify(tree);

  return { kind, componentName, markdown };
});

// remove existing files in icons component folder
fs.rmSync(path.resolve(__dirname, "../src/components/icons"), {
  recursive: true,
  force: true,
});

// recreate icons component folder
fs.mkdirSync(path.resolve(__dirname, "../src/components/icons"), {
  recursive: true,
});

// create an individual component file for each icon
icons.forEach((icon) => {
  // spread {...props} into the opening svg tag
  const markdown = icon.markdown.replace(/<svg([^>]*)>/s, "<svg$1 {...props}>");

  const fileContents = `
${AUTO_GENERATED_WARNING}

import type { ComponentProps } from 'react';

export const ${icon.componentName} = (props: ComponentProps<'svg'>) => {
  return ${markdown}
}
`;

  fs.writeFileSync(
    path.resolve(__dirname, `../src/components/icons/${icon.kind}.tsx`),
    fileContents,
  );
});

// create icons components registry file
fs.writeFileSync(
  path.resolve(__dirname, `../src/components/icons/registry.tsx`),
  `
  ${AUTO_GENERATED_WARNING}

  import type { ComponentProps, ComponentType } from "react"
  import type { IconKind } from "./types"
  ${icons.map((icon) => `import { ${icon.componentName} } from './${icon.kind}'`).join("\n")}

  export const registry: { [K in IconKind]: ComponentType<ComponentProps<"svg">> } = {
    ${icons.map((icon) => `"${icon.kind}": ${icon.componentName},`).join("\n")}
  }`,
);

// create master component that imports and renders via registry (not tree-shakeable)
fs.writeFileSync(
  path.resolve(__dirname, `../src/components/icons/icon.tsx`),
  `
  ${AUTO_GENERATED_WARNING}

  import type { ComponentProps } from "react";
  import type { IconKind } from "./types";
  import { registry } from "./registry";

  export interface IconProps extends ComponentProps<"svg"> {
    kind: IconKind;
  }

  export function Icon({ kind, ...props }: IconProps) {
    const Component = registry[kind]
    if (!Component) return null

    return (
      <Component {...props} />
    );
  }`,
);

// create types file with exported IconType
fs.writeFileSync(
  path.resolve(__dirname, `../src/components/icons/types.ts`),
  `${AUTO_GENERATED_WARNING}

  export type IconKind = ${icons.map((icon) => `"${icon.kind}"`).join("|")}`,
);

// create constants file with exported ICON_KINDS
fs.writeFileSync(
  path.resolve(__dirname, `../src/components/icons/constants.ts`),
  `${AUTO_GENERATED_WARNING}

  import type { IconKind } from "./types";

  export const ICON_KINDS: IconKind[] = [${icons.map((icon) => `"${icon.kind}"`).join(",")}]`,
);

// create barrel file with exports for each icon component, constants, and types (tree-shakeable)
fs.writeFileSync(
  path.resolve(__dirname, `../src/components/icons/icons.ts`),
  `${AUTO_GENERATED_WARNING}

  export { Icon } from './icon'
  export { ICON_KINDS } from './constants'
  export type { IconKind } from './types'
  ${icons.map((icon) => `export { ${icon.componentName} } from './${icon.kind}'`).join("\n")}`,
);

// create story file for icon component
fs.writeFileSync(
  path.resolve(__dirname, `../src/components/icons/icons.stories.tsx`),
  `import type { Meta, StoryObj } from "@storybook/react-vite";

  import { Icon } from "@/components/icons/icons";

  const meta = {
    component: Icon,
  } satisfies Meta<typeof Icon>;

  export default meta;

  type Story = StoryObj<typeof meta>;

  export const Playground: Story = {
    args: { kind: "tenstorrent" },
    render: (props) => (
      <Icon width={32} height={32} color="var(--vesper-stone-900)" {...props} />
    ),
  };
  Playground.storyName = "icons";
`,
);
