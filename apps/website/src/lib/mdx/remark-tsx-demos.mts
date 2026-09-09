/**
 * Remark plugin that renders a document's component demos
 *
 * Every `tsx demo` code block in `docs/**` is extracted into a real module
 *
 * That module then gets imported back into the document, rendering the
 * component the block exports right above the block itself
 */

import type { Code, Nodes, Root, RootContent } from "mdast";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Transformer } from "unified";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DOC_FILE_EXT = /\.(md|mdx)$/;

export const DOCS_ROOT = path.resolve(__dirname, "../../../../../docs");

export const DEMOS_ROOT = path.resolve(__dirname, "../../generated-demos");

/**
 * Write to a file, skipping the write when it is already up to date
 *
 * Generated demos live inside the app, so rewriting one that did not
 * change would restart next's dev server for nothing (and bust turbo's cache)
 */
const createOrUpdateFile = async (filePath: string, content: string) => {
  const current = await readFile(filePath, "utf-8").catch(() => null);
  if (current === content) return;

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf-8");
};

/**
 * The module the nth demo of a document is generated into.
 * Returns `null` for anything that is not an `.mdx` file inside `docs/`
 */
const getDemoModulePath = (
  docPath: string | undefined,
  index: number,
): string | null => {
  if (!docPath || !DOC_FILE_EXT.test(docPath)) return null;

  const relativePath = path.relative(DOCS_ROOT, docPath);

  // outside `docs/`
  if (!relativePath || relativePath.startsWith("..")) return null;
  if (path.isAbsolute(relativePath)) return null;

  return path.join(DEMOS_ROOT, `${relativePath}.${index}.tsx`);
};

/**
 * Detects whether a given mdast node is a fenced code block we want to turn into a demo, ie:
 *
 * ````
 * ```tsx demo
 * export default function HelloWorld() {
 *   return <p>hello world!</p>
 * }
 * ```
 * ````
 */
const isDemoCodeBlock = (node: Nodes): node is Code =>
  node.type === "code" && node.lang === "tsx" && node.meta === "demo";

export default function remarkTsxDemos(): Transformer<Root> {
  return async (tree, file) => {
    // Ignore files outside of `docs/`
    if (!getDemoModulePath(file.path, 0)) return;

    /** Array of MDX ESM import statements that bring the demos into scope */
    const demoImportStatements: MdxjsEsm[] = [];

    /**
     * walk the tree depth first, inserting each demo before
     * the code block it was extracted from
     */
    const injectDemos = async (node: Nodes): Promise<void> => {
      if (!("children" in node)) return;

      if (node.type !== "root") {
        // Only recurse into children without injecting demos
        for (const child of node.children) await injectDemos(child);
        return;
      }

      const transformedChildren: RootContent[] = [];

      for (const child of node.children) {
        await injectDemos(child);

        // If the child is not a demo code block, only inject the child itself
        if (!isDemoCodeBlock(child)) {
          transformedChildren.push(child);
          continue;
        }

        // If the demo has no module path, only inject the child itself
        const demoModulePath = getDemoModulePath(
          file.path,
          demoImportStatements.length,
        );
        if (!demoModulePath) {
          transformedChildren.push(child);
          continue;
        }

        // Turn current demo index into a PascalCase component name, eg. "TsxDemo1"
        const demoName = `TsxDemo${demoImportStatements.length}`;

        await createOrUpdateFile(
          demoModulePath,
          `"use client"\n\n${child.value.trim()}`,
        );

        // Get the relative import path for the demo component's module
        let demoImportPath = path
          .relative(path.dirname(file.path), demoModulePath)
          .split(path.sep)
          .join("/");
        if (!demoImportPath.startsWith(".")) {
          demoImportPath = `./${demoImportPath}`;
        }

        // Create a MDX ESM import declaration node for the demo component
        const importNode: MdxjsEsm = {
          type: "mdxjsEsm",
          value: `import ${demoName} from "${demoImportPath}";`,
          data: {
            estree: {
              type: "Program",
              sourceType: "module",
              body: [
                {
                  type: "ImportDeclaration",
                  specifiers: [
                    {
                      type: "ImportDefaultSpecifier",
                      local: { type: "Identifier", name: demoName },
                    },
                  ],
                  source: { type: "Literal", value: demoImportPath },
                  attributes: [],
                },
              ],
            },
          },
        };
        // Add the import node to the array of demo import statements
        demoImportStatements.push(importNode);

        // Inject the rendered demo component before its code block node
        transformedChildren.push(
          {
            type: "mdxJsxFlowElement",
            name: demoName,
            attributes: [],
            children: [],
          },
          child,
        );
      }

      // Assign the node its new children with injected demos
      node.children = transformedChildren;
    };

    await injectDemos(tree);

    // Inject imports at the top of the document, after frontmatter
    const hasFrontmatter = tree.children[0]?.type === "yaml";
    tree.children.splice(hasFrontmatter ? 1 : 0, 0, ...demoImportStatements);
  };
}
